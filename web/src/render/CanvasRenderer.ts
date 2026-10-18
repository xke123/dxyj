/**
 * CanvasRenderer.ts — 原版风格渲染器（现代宽屏）
 *
 * 渲染层严格还原原版外观：
 *  - 4色方块（纯色矩形 + 高光斜线 + 暗影斜线）
 *  - 数字岩石（灰色矩形 + 中央耐久数字 + 裂纹）
 *  - 宝藏（金色闪光框 + 金币图标）
 *  - 玩家（简洁的钻地机器人轮廓）
 *  - HUD：HP条、金币、当前深度、目标深度
 */

import {
  COLS, ROWS, TILE_SIZE, SpecialType,
  TILE_COLORS, ROCK_COLORS,
  type Tile,
} from '../core/Types';
import { GridEngine } from '../core/GridEngine';
import { PlayerController } from '../core/Player';
import { Camera } from './Camera';
import { ParticleSystem } from './ParticleSystem';

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private engine: GridEngine;
  private playerCtrl: PlayerController;
  private camera: Camera;
  private particles: ParticleSystem;

  constructor(
    canvas: HTMLCanvasElement,
    engine: GridEngine,
    playerCtrl: PlayerController,
    camera: Camera,
    particles: ParticleSystem
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.engine = engine;
    this.playerCtrl = playerCtrl;
    this.camera = camera;
    this.particles = particles;
  }

  public render(): void {
    const ctx = this.ctx;
    const { width, height } = this.canvas;

    ctx.fillStyle = '#0a0a12';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(-this.camera.getRenderX(), -this.camera.getRenderY());

    this.drawBackground(ctx);
    this.drawTiles(ctx);
    this.drawPlayer(ctx);
    this.particles.render(ctx);
    this.drawFloatingTexts(ctx);
    this.drawTargetDepthIndicator(ctx);

    ctx.restore();
  }

  // ── 深色地下背景 + 深度标尺 ──
  private drawBackground(ctx: CanvasRenderingContext2D): void {
    const worldW = COLS * TILE_SIZE;
    const worldH = ROWS * TILE_SIZE;

    const grad = ctx.createLinearGradient(0, 0, 0, worldH);
    grad.addColorStop(0,    '#0d1117');
    grad.addColorStop(0.25, '#110e1a');
    grad.addColorStop(0.6,  '#180a0a');
    grad.addColorStop(1,    '#050308');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, worldW, worldH);

    // 边界
    ctx.strokeStyle = '#1a2030';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, worldW, worldH);

    // 深度分界线（每8行一条虚线）
    ctx.setLineDash([3, 5]);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.font = '10px monospace';

    for (let r = 8; r < ROWS; r += 8) {
      const y = r * TILE_SIZE;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(worldW, y);
      ctx.stroke();
      const depthM = (r + this.engine.scrolledRows - 4) * 2;
      if (depthM > 0) ctx.fillText(`${depthM}m`, 6, y - 3);
    }
    ctx.setLineDash([]);
  }

  // ── 绘制所有方块（核心渲染） ──
  private drawTiles(ctx: CanvasRenderingContext2D): void {
    const camX = this.camera.x;
    const camY = this.camera.y;
    const vw = this.camera.viewportWidth;
    const vh = this.camera.viewportHeight;

    const startC = Math.max(0, Math.floor(camX / TILE_SIZE) - 1);
    const endC   = Math.min(COLS - 1, Math.ceil((camX + vw) / TILE_SIZE));
    const startR = Math.max(0, Math.floor(camY / TILE_SIZE) - 1);
    const endR   = Math.min(ROWS - 1, Math.ceil((camY + vh) / TILE_SIZE));

    for (let r = startR; r <= endR; r++) {
      for (let c = startC; c <= endC; c++) {
        const tile = this.engine.grid[r]?.[c];
        if (!tile || tile.kind === SpecialType.EMPTY) continue;

        const dx = c * TILE_SIZE + (tile.shakeVisualX || 0);
        const dy = r * TILE_SIZE + (tile.shakeVisualY || 0) + (tile.fallYOffset || 0);

        this.drawTile(ctx, tile, dx, dy);
      }
    }
  }

  // ── 单块渲染（原版风格：纯色+2D高光斜线）──
  private drawTile(ctx: CanvasRenderingContext2D, tile: Tile, x: number, y: number): void {
    const S = TILE_SIZE;
    const pad = 1;
    const inner = S - pad * 2;

    ctx.save();

    const kind = tile.kind;

    if (kind >= 0 && kind <= 3) {
      // ── 彩色矿块（原版 4 色）──
      const colors = TILE_COLORS[kind as number];

      // 主体
      ctx.fillStyle = colors.main;
      ctx.fillRect(x + pad, y + pad, inner, inner);

      // 左上高光（亮斜边，对应原版像素高光）
      ctx.fillStyle = colors.light;
      ctx.fillRect(x + pad, y + pad, inner, 3);       // 顶
      ctx.fillRect(x + pad, y + pad, 3, inner);       // 左

      // 右下阴影（深色斜边）
      ctx.fillStyle = colors.dark;
      ctx.fillRect(x + pad, y + S - pad - 3, inner, 3);  // 底
      ctx.fillRect(x + S - pad - 3, y + pad, 3, inner);  // 右

      // 预警：金色外框
      if (tile.shakeWarning) {
        const pulse = 0.5 + 0.5 * Math.sin(performance.now() * 0.018);
        ctx.strokeStyle = `rgba(255, 220, 0, ${pulse})`;
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 1, y + 1, S - 2, S - 2);
      }

    } else if (kind === SpecialType.ROCK) {
      // ── 数字岩石（对应原版灰色岩石 + 耐久数字）──
      const durIdx = Math.min(tile.durability - 1, ROCK_COLORS.length - 1);
      const rockColor = ROCK_COLORS[Math.max(0, durIdx)];

      ctx.fillStyle = rockColor;
      ctx.fillRect(x + pad, y + pad, inner, inner);

      // 内嵌深色边框
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 5, y + 5, S - 10, S - 10);

      // 裂纹（随受损程度增多）
      const dmg = tile.maxDurability - tile.durability;
      if (dmg >= 1) {
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + 10, y + 8);
        ctx.lineTo(x + 22, y + 20);
        ctx.stroke();
      }
      if (dmg >= 2) {
        ctx.beginPath();
        ctx.moveTo(x + 22, y + 20);
        ctx.lineTo(x + 16, y + 34);
        ctx.moveTo(x + 22, y + 20);
        ctx.lineTo(x + 34, y + 26);
        ctx.stroke();
      }
      if (dmg >= 3) {
        ctx.beginPath();
        ctx.moveTo(x + 8, y + 30);
        ctx.lineTo(x + 20, y + 38);
        ctx.stroke();
      }

      // 耐久数字（原版显示 1-5）
      ctx.font = `bold ${S * 0.4}px monospace`;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${tile.durability}`, x + S / 2, y + S / 2);

    } else if (kind === SpecialType.TREASURE) {
      // ── 宝藏（金色闪光）──
      ctx.fillStyle = '#3d2d00';
      ctx.fillRect(x + pad, y + pad, inner, inner);

      // 金色边框闪烁
      const glow = 0.6 + 0.4 * Math.sin(performance.now() * 0.015);
      ctx.strokeStyle = `rgba(255, 215, 0, ${glow})`;
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 3, y + 3, S - 6, S - 6);

      // 金币图标
      ctx.font = `${S * 0.5}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💰', x + S / 2, y + S / 2 + 1);
    }

    // 受击颤动
    if (tile.shakeTimer && tile.shakeTimer > 0) {
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y + 1, S - 2, S - 2);
    }

    ctx.restore();
  }

  // ── 目标深度指示线 ──
  private drawTargetDepthIndicator(ctx: CanvasRenderingContext2D): void {
    const targetAbsRow = this.playerCtrl.targetRow - this.engine.scrolledRows;
    if (targetAbsRow < 0 || targetAbsRow >= ROWS) return;

    const y = targetAbsRow * TILE_SIZE;
    const worldW = COLS * TILE_SIZE;

    ctx.save();
    ctx.setLineDash([8, 4]);
    ctx.strokeStyle = 'rgba(255, 200, 0, 0.7)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(worldW, y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(255, 200, 0, 0.9)';
    ctx.font = 'bold 12px monospace';
    ctx.textBaseline = 'bottom';
    ctx.fillText('▼ 目标深度', 8, y - 2);
    ctx.restore();
  }

  // ── 玩家渲染（钻地机器人，简洁风格） ──
  private drawPlayer(ctx: CanvasRenderingContext2D): void {
    const p = this.playerCtrl.state;
    const px = p.x;
    const py = p.y;
    const S = TILE_SIZE;

    ctx.save();
    ctx.translate(px, py);

    if (p.dead) {
      // 死亡状态：红色闪烁
      const blink = Math.floor(performance.now() / 100) % 2;
      if (blink) {
        ctx.fillStyle = 'rgba(255,0,0,0.6)';
        ctx.fillRect(6, 6, S - 12, S - 12);
      }
      ctx.restore();
      return;
    }

    // ── 机器人轮廓（简洁方形机器人，类似原版像素风）──
    // 车体
    ctx.fillStyle = '#1a3a5c';
    ctx.fillRect(6, 14, S - 12, S - 18);

    // 车顶圆弧（驾驶舱）
    ctx.fillStyle = '#2255aa';
    ctx.beginPath();
    ctx.arc(S / 2, 14, (S - 16) / 2, Math.PI, 0);
    ctx.fill();

    // 驾驶舱玻璃
    ctx.fillStyle = '#7ecbff';
    ctx.beginPath();
    ctx.arc(S / 2, 14, (S - 20) / 2, Math.PI, 0);
    ctx.fill();

    // 灯（面向方向）
    const faceRight = p.facing === 'right' || p.facing === 'down';
    ctx.fillStyle = '#ffff88';
    ctx.shadowColor = '#ffff00';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(faceRight ? S - 10 : 10, S / 2 + 2, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 钻头（对应原版的方向性钻头）
    ctx.strokeStyle = '#90caf9';
    ctx.lineWidth = 3;
    const drill = p.isDigging ? 12 : 8;
    ctx.beginPath();
    if (p.facing === 'right') {
      ctx.moveTo(S - 10, S / 2 + 2);
      ctx.lineTo(S - 10 + drill, S / 2 + 2);
    } else if (p.facing === 'left') {
      ctx.moveTo(10, S / 2 + 2);
      ctx.lineTo(10 - drill, S / 2 + 2);
    } else if (p.facing === 'down') {
      ctx.moveTo(S / 2, S - 6);
      ctx.lineTo(S / 2, S - 6 + drill);
    } else {
      ctx.moveTo(S / 2, 6);
      ctx.lineTo(S / 2, 6 - drill);
    }
    ctx.stroke();

    // HP低时闪红
    if (p.hp < 30) {
      const blink = 0.5 + 0.5 * Math.sin(performance.now() * 0.02);
      ctx.fillStyle = `rgba(255, 0, 0, ${blink * 0.4})`;
      ctx.fillRect(6, 14, S - 12, S - 18);
    }

    ctx.restore();
  }

  // ── 浮动文字 ──
  private drawFloatingTexts(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const ft of this.engine.floatingTexts) {
      ctx.globalAlpha = ft.alpha;
      ctx.font = `bold ${ft.size}px monospace`;
      ctx.fillStyle = ft.color;
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.restore();
  }
}
