import './style.css';
import { COLS, ROWS, TILE_SIZE } from './core/Types';
import { ParticleSystem } from './render/ParticleSystem';
import { SoundEffects } from './audio/SoundEffects';
import { GridEngine } from './core/GridEngine';
import { PlayerController } from './core/Player';
import { Camera } from './render/Camera';
import { CanvasRenderer } from './render/CanvasRenderer';

class GameApp {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: ParticleSystem;
  private audio: SoundEffects;
  private gridEngine: GridEngine;
  private playerCtrl: PlayerController;
  private camera: Camera;
  private renderer: CanvasRenderer;

  private lastTime: number = 0;
  private keysDown: Set<string> = new Set();
  private moveCooldown: number = 0;

  // DOM 元素引用
  private depthValEl!: HTMLElement;
  private staminaFillEl!: HTMLElement;
  private staminaTextEl!: HTMLElement;
  private relicCountEl!: HTMLElement;
  private locationNameEl!: HTMLElement;
  private deductionLocDescEl!: HTMLElement;
  private deductionTreasureDescEl!: HTMLElement;
  private relicListEl!: HTMLElement;
  private inventoryModalEl!: HTMLElement;

  constructor() {
    this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;

    const worldWidth = COLS * TILE_SIZE;
    const worldHeight = ROWS * TILE_SIZE;

    this.particles = new ParticleSystem();
    this.audio = new SoundEffects();
    this.gridEngine = new GridEngine(this.particles, this.audio);
    this.playerCtrl = new PlayerController(this.gridEngine);
    this.camera = new Camera(worldWidth, worldHeight);

    // 将摄像机注入网格引擎，供震屏特效调用
    this.gridEngine.setCamera(this.camera);

    this.renderer = new CanvasRenderer(
      this.canvas,
      this.gridEngine,
      this.playerCtrl,
      this.camera,
      this.particles
    );

    this.bindDomElements();
    this.setupEventListeners();
    this.handleResize();

    // 启动主游戏循环
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  private bindDomElements(): void {
    this.depthValEl = document.getElementById('depth-val')!;
    this.staminaFillEl = document.getElementById('stamina-fill')!;
    this.staminaTextEl = document.getElementById('stamina-text')!;
    this.relicCountEl = document.getElementById('relic-count')!;
    this.locationNameEl = document.getElementById('location-name')!;
    this.deductionLocDescEl = document.getElementById('deduction-loc-desc')!;
    this.deductionTreasureDescEl = document.getElementById('deduction-treasure-desc')!;
    this.relicListEl = document.getElementById('relic-list')!;
    this.inventoryModalEl = document.getElementById('inventory-modal')!;
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', this.handleResize.bind(this));

    // 键盘监听
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      const code = e.code;
      this.keysDown.add(code);

      if (code === 'KeyI') {
        this.toggleInventory();
      }

      if (code === 'KeyJ' || code === 'Space') {
        e.preventDefault();
        this.playerCtrl.digFacing();
      }
    });

    window.addEventListener('keyup', (e: KeyboardEvent) => {
      this.keysDown.delete(e.code);
    });

    // 虚拟触控按键监听
    document.getElementById('btn-left')?.addEventListener('click', () => this.playerCtrl.tryMove(-1, 0));
    document.getElementById('btn-right')?.addEventListener('click', () => this.playerCtrl.tryMove(1, 0));
    document.getElementById('btn-up')?.addEventListener('click', () => this.playerCtrl.tryMove(0, -1));
    document.getElementById('btn-down')?.addEventListener('click', () => this.playerCtrl.tryMove(0, 1));
    document.getElementById('btn-dig')?.addEventListener('click', () => this.playerCtrl.digFacing());

    // 行囊笔记模态框交互
    document.getElementById('btn-inventory')?.addEventListener('click', () => this.toggleInventory(true));
    document.getElementById('btn-close-modal')?.addEventListener('click', () => this.toggleInventory(false));

    // 鼠标点击画布直接挖掘点击的相邻方块
    this.canvas.addEventListener('mousedown', (e: MouseEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseWorldX = (e.clientX - rect.left) + this.camera.getRenderX();
      const mouseWorldY = (e.clientY - rect.top) + this.camera.getRenderY();

      const clickCol = Math.floor(mouseWorldX / TILE_SIZE);
      const clickRow = Math.floor(mouseWorldY / TILE_SIZE);

      const p = this.playerCtrl.player;
      const dist = Math.abs(clickCol - p.gridX) + Math.abs(clickRow - p.gridY);
      if (dist <= 2) {
        this.playerCtrl.dig(clickCol, clickRow);
      }
    });
  }

  private handleResize(): void {
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.ctx.scale(dpr, dpr);

    this.camera.resize(w, h);
  }

  private toggleInventory(forceState?: boolean): void {
    const isHidden = this.inventoryModalEl.classList.contains('modal-hidden');
    const newState = forceState !== undefined ? !forceState : !isHidden;

    if (newState) {
      this.inventoryModalEl.classList.add('modal-hidden');
    } else {
      this.inventoryModalEl.classList.remove('modal-hidden');
      this.updateInventoryView();
    }
  }

  private updateInventoryView(): void {
    const inventory = this.playerCtrl.player.inventory;
    const hasTileClue = inventory.some(i => i.relic.id === 'clue_tile');
    const hasCoinClue = inventory.some(i => i.relic.id === 'clue_coin');
    const hasStoneClue = inventory.some(i => i.relic.id === 'clue_stone');

    // 动态推理更新
    if (hasTileClue || hasCoinClue || hasStoneClue) {
      this.locationNameEl.textContent = '【华夏故都·冰封旧址】(已确认)';
      this.locationNameEl.style.color = '#38bdf8';
      this.deductionLocDescEl.innerHTML = `
        <span class="active">✓ 判定成功！</span><br>
        根据出土的<b>【龙纹琉璃瓦残片】</b>与<b>【开元通宝古铜钱】</b>，证实此处地下正处于千年前旧时代东方文明之心脏——<b>华夏大都宫廷御苑</b>的绝对正上方！
      `;
      this.deductionLocDescEl.classList.add('active');

      this.deductionTreasureDescEl.innerHTML = `
        <span class="active">✓ 宝藏推导明确！</span><br>
        古都在此，则镇国枢纽必沉睡于此。最深层必定封存着华夏文明的大秘宝——<b>【始源传国玉玺】</b>！你需要一层层起出青铜符印与机关信物作为钥匙，解封地核大门！
      `;
      this.deductionTreasureDescEl.classList.add('active');
    }

    // 渲染出土列表
    if (inventory.length === 0) {
      this.relicListEl.innerHTML = '<div class="empty-hint">暂无出土物，继续向下挥铲破冰...</div>';
      return;
    }

    this.relicListEl.innerHTML = inventory.map(item => `
      <div class="relic-item-card ${item.relic.category === 'key' ? 'is-key' : ''}">
        <div class="relic-icon">${item.relic.icon}</div>
        <div class="relic-body">
          <div class="relic-title">
            <span>${item.relic.name}</span>
            <span class="relic-count">x${item.count}</span>
          </div>
          <div class="relic-strata">发掘于 ${item.discoveredAtDepth}m (${item.relic.strata})</div>
          <div class="relic-desc">${item.relic.description}</div>
        </div>
      </div>
    `).join('');
  }

  private handleContinuousInput(dt: number): void {
    this.moveCooldown -= dt;
    if (this.moveCooldown > 0) return;

    let dx = 0;
    let dy = 0;

    if (this.keysDown.has('KeyA') || this.keysDown.has('ArrowLeft')) dx = -1;
    else if (this.keysDown.has('KeyD') || this.keysDown.has('ArrowRight')) dx = 1;
    else if (this.keysDown.has('KeyS') || this.keysDown.has('ArrowDown')) dy = 1;
    else if (this.keysDown.has('KeyW') || this.keysDown.has('ArrowUp')) dy = -1;

    if (dx !== 0 || dy !== 0) {
      const moved = this.playerCtrl.tryMove(dx, dy);
      if (moved) {
        this.moveCooldown = 0.15; // 连按响应平滑度
      }
    }
  }

  private updateHUD(): void {
    const p = this.playerCtrl.player;

    // 深度
    this.depthValEl.textContent = `${p.depth.toFixed(1)} 米`;

    // 体力/体温
    const staminaPercent = Math.max(0, Math.floor((p.stamina / p.maxStamina) * 100));
    this.staminaTextEl.textContent = `${staminaPercent}%`;
    this.staminaFillEl.style.width = `${staminaPercent}%`;

    // 出土数量
    this.relicCountEl.textContent = `${p.inventory.length}`;
  }

  private gameLoop(timestamp: number): void {
    if (!this.lastTime) this.lastTime = timestamp;
    const dt = Math.min(0.1, (timestamp - this.lastTime) / 1000);
    this.lastTime = timestamp;

    // 1. 处理持续输入
    this.handleContinuousInput(dt);

    // 2. 更新主角状态与重力
    this.playerCtrl.update(dt);

    // 3. 更新网格物理、预警颤抖、重力塌陷与落石砸中主角判定
    this.gridEngine.updatePhysics(
      dt,
      this.playerCtrl.player.gridX,
      this.playerCtrl.player.gridY,
      (_crushCol, _crushRow) => {
        this.playerCtrl.onCrushedByRock();
      }
    );

    // 4. 更新粒子系统
    this.particles.update(dt);

    // 5. 摄像机动态追踪主角与屏幕震屏
    this.camera.follow(this.playerCtrl.player.x + TILE_SIZE / 2, this.playerCtrl.player.y + TILE_SIZE / 2);
    this.camera.update(dt);

    // 6. 更新 HUD 数据
    this.updateHUD();

    // 7. 渲染画面
    this.renderer.render();

    requestAnimationFrame(this.gameLoop.bind(this));
  }
}

// 页面加载完成后启动
window.addEventListener('DOMContentLoaded', () => {
  new GameApp();
});
