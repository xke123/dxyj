/**
 * main.ts — 原版《地心游记》核心游戏主循环
 *
 * 状态机（对应原版 bW）：
 *  'playing'  → 挖掘进行中
 *  'dead'     → HP归零，显示失败提示，3s后重置
 *  'win'      → 到达目标深度，显示通关奖励
 */

import './style.css';
import { COLS, ROWS, TILE_SIZE, TARGET_ROW } from './core/Types';
import { GridEngine } from './core/GridEngine';
import { PlayerController } from './core/Player';
import { Camera } from './render/Camera';
import { CanvasRenderer } from './render/CanvasRenderer';
import { ParticleSystem } from './render/ParticleSystem';
import { SoundEffects } from './audio/SoundEffects';

// ── 游戏状态 ──
type GamePhase = 'playing' | 'dead' | 'win';

class Game {
  private canvas: HTMLCanvasElement;
  private particles: ParticleSystem;
  private audio: SoundEffects;
  private engine: GridEngine;
  private player: PlayerController;
  private camera: Camera;
  private renderer: CanvasRenderer;

  private phase: GamePhase = 'playing';
  private phaseTimer: number = 0;
  private lastTime: number = 0;
  private keysDown: Set<string> = new Set();
  private moveCooldown: number = 0;
  private totalCoins: number = 0;  // 累计存档金币

  // HUD 元素
  private hpFillEl!: HTMLElement;
  private hpTextEl!: HTMLElement;
  private coinsEl!: HTMLElement;
  private depthEl!: HTMLElement;
  private targetDepthEl!: HTMLElement;
  private overlayEl!: HTMLElement;
  private overlayTitleEl!: HTMLElement;
  private overlayBodyEl!: HTMLElement;

  constructor() {
    this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

    const worldW = COLS * TILE_SIZE;
    const worldH = ROWS * TILE_SIZE;

    this.particles = new ParticleSystem();
    this.audio = new SoundEffects();
    this.engine = new GridEngine(this.particles, this.audio);
    this.player = new PlayerController(this.engine, TARGET_ROW);
    this.camera = new Camera(worldW, worldH);
    this.engine.setCamera(this.camera);

    this.renderer = new CanvasRenderer(
      this.canvas, this.engine, this.player, this.camera, this.particles
    );

    this.player.setCallbacks(
      (coins) => { this.totalCoins += coins; this.updateHUD(); },
      () => this.onDead(),
      () => this.onWin()
    );

    this.bindDOM();
    this.setupInput();
    window.addEventListener('resize', () => this.handleResize());
    this.handleResize();

    requestAnimationFrame((t) => this.loop(t));
  }

  private bindDOM(): void {
    this.hpFillEl       = document.getElementById('hp-fill')!;
    this.hpTextEl       = document.getElementById('hp-text')!;
    this.coinsEl        = document.getElementById('coins-val')!;
    this.depthEl        = document.getElementById('depth-val')!;
    this.targetDepthEl  = document.getElementById('target-depth-val')!;
    this.overlayEl      = document.getElementById('overlay')!;
    this.overlayTitleEl = document.getElementById('overlay-title')!;
    this.overlayBodyEl  = document.getElementById('overlay-body')!;

    // 目标深度固定显示
    this.targetDepthEl.textContent = `${TARGET_ROW * 2}m`;

    document.getElementById('btn-restart')?.addEventListener('click', () => this.restart());
  }

  private setupInput(): void {
    window.addEventListener('keydown', (e) => {
      this.keysDown.add(e.code);
      // 5键/空格 主动挖掘
      if (e.code === 'Space' || e.code === 'KeyJ' || e.code === 'Digit5') {
        e.preventDefault();
        this.player.digFacing();
      }
    });
    window.addEventListener('keyup', (e) => this.keysDown.delete(e.code));

    // 虚拟按键（触屏/移动端）
    const btns: Array<[string, number, number]> = [
      ['btn-up',    0, -1], ['btn-down', 0,  1],
      ['btn-left', -1,  0], ['btn-right', 1,  0],
    ];
    for (const [id, dx, dy] of btns) {
      const el = document.getElementById(id);
      if (!el) continue;
      let interval: number;
      const start = () => {
        this.player.tryMove(dx, dy);
        interval = window.setInterval(() => this.player.tryMove(dx, dy), 140);
      };
      const stop = () => clearInterval(interval);
      el.addEventListener('pointerdown', start);
      el.addEventListener('pointerup', stop);
      el.addEventListener('pointerleave', stop);
    }
    document.getElementById('btn-dig')?.addEventListener('click', () => this.player.digFacing());
  }

  private handleResize(): void {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    this.canvas.width  = vw;
    this.canvas.height = vh;
    this.camera.viewportWidth  = vw;
    this.camera.viewportHeight = vh;
  }

  // ── 主循环 ──
  private loop(now: number): void {
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;

    if (this.phase === 'playing') {
      this.handleInput(dt);
      this.player.update(dt);
      this.engine.updatePhysics(dt,
        this.player.state.gridX,
        this.player.state.gridY,
        () => this.player.onCrush()
      );
      this.engine.updateFloatingTexts(dt);
      this.particles.update(dt);

      // 摄像机跟随玩家
      this.camera.follow(
        this.player.state.x + TILE_SIZE / 2,
        this.player.state.y + TILE_SIZE / 2
      );
      this.camera.update(dt);
      this.updateHUD();
    } else {
      // 死亡/通关阶段只更新粒子和计时
      this.particles.update(dt);
      this.camera.update(dt);
      this.phaseTimer -= dt;
    }

    this.renderer.render();
    requestAnimationFrame((t) => this.loop(t));
  }

  // ── 键盘持续移动 ──
  private handleInput(dt: number): void {
    this.moveCooldown -= dt;
    if (this.moveCooldown > 0) return;

    const moved =
      (this.keysDown.has('ArrowUp')    || this.keysDown.has('KeyW') || this.keysDown.has('Digit8')) ? this.player.tryMove(0, -1) :
      (this.keysDown.has('ArrowDown')  || this.keysDown.has('KeyS') || this.keysDown.has('Digit2')) ? this.player.tryMove(0,  1) :
      (this.keysDown.has('ArrowLeft')  || this.keysDown.has('KeyA') || this.keysDown.has('Digit4')) ? this.player.tryMove(-1, 0) :
      (this.keysDown.has('ArrowRight') || this.keysDown.has('KeyD') || this.keysDown.has('Digit6')) ? this.player.tryMove(1,  0) :
      false;

    if (moved) this.moveCooldown = 0.13;
  }

  // ── HP归零（对应原版 bL.I<=0 传送回地面）──
  private onDead(): void {
    this.phase = 'dead';
    this.phaseTimer = 3;
    const lost = this.player.state.sessionCoins;
    this.totalCoins -= lost; // 本次下潜战利品清空

    this.overlayTitleEl.textContent = '⚠️ 能量耗尽！';
    this.overlayBodyEl.innerHTML = `
      <p>机器人被自动传送回地面</p>
      <p class="penalty">本次下潜收集的 <strong>${lost}</strong> 金币已丢失</p>
      <p>累计金币：<strong>${Math.max(0, this.totalCoins)}</strong></p>
      <p class="hint">3秒后自动重新挑战...</p>
    `;
    this.overlayEl.className = 'overlay-dead';
    setTimeout(() => this.restart(), 3000);
  }

  // ── 到达目标深度通关 ──
  private onWin(): void {
    this.phase = 'win';
    const bonus = TARGET_ROW * 100; // 通关奖金
    this.totalCoins += bonus;

    this.overlayTitleEl.textContent = '🏆 挖到底部！';
    this.overlayBodyEl.innerHTML = `
      <p>成功抵达目标深度 <strong>${TARGET_ROW * 2}m</strong></p>
      <p class="bonus">通关奖金 +<strong>${bonus}</strong> 金币</p>
      <p>累计金币：<strong>${this.totalCoins}</strong></p>
    `;
    this.overlayEl.className = 'overlay-win';
  }

  // ── 重新开始（保留累计金币）──
  private restart(): void {
    this.phase = 'playing';
    this.overlayEl.className = 'overlay-hidden';
    this.engine.buildInitialWorld();
    this.engine.scrolledRows = 0;
    this.engine.floatingTexts = [];
    this.player = new PlayerController(this.engine, TARGET_ROW);
    this.player.setCallbacks(
      (coins) => { this.totalCoins += coins; this.updateHUD(); },
      () => this.onDead(),
      () => this.onWin()
    );
    this.renderer = new CanvasRenderer(
      this.canvas, this.engine, this.player, this.camera, this.particles
    );
    this.updateHUD();
  }

  // ── HUD 更新 ──
  private updateHUD(): void {
    const p = this.player.state;
    const hpPct = Math.max(0, (p.hp / p.maxHp) * 100);

    this.hpFillEl.style.width = `${hpPct}%`;
    this.hpFillEl.style.backgroundColor =
      hpPct > 50 ? '#4caf50' :
      hpPct > 25 ? '#ff9800' : '#f44336';
    this.hpTextEl.textContent = `${p.hp}/${p.maxHp}`;
    this.coinsEl.textContent  = this.totalCoins.toLocaleString();
    this.depthEl.textContent  = `${Math.floor(p.depth)}m`;
  }
}

// 启动
window.addEventListener('DOMContentLoaded', () => new Game());
