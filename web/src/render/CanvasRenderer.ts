/**
 * CanvasRenderer.ts — 原版风格渲染器（现代宽屏 + 水晶宝藏特效）
 *
 * 渲染层严格还原原版外观与特效：
 *  - 4色方块（纯色矩形 + 高光斜线 + 暗影斜线）
 *  - 数字岩石（灰色矩形 + 中央耐久数字 + 裂纹）
 *  - 8大功能水晶（绚丽彩色棱晶宝石 + 动态闪烁辉光）
 *  - 4大即时宝藏（化石、古董、金块、钻石）与能量球
 *  - 强力视觉特效：闪亮垂直激光光柱、地震波环形冲击波
 *  - 玩家（简洁灵动的钻地机器人轮廓）
 */

import {
  COLS, ROWS, TILE_SIZE, SpecialType, CrystalType, TreasureKind,
  TILE_COLORS, ROCK_COLORS, CRYSTAL_METAS,
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
    this.drawEffects(ctx);
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
    const now = performance.now();

    ctx.save();

    const kind = tile.kind;

    if (kind >= 0 && kind <= 3) {
      // ── 彩色矿块（原版 4 色）──
      const colors = TILE_COLORS[kind as number];

      ctx.fillStyle = colors.main;
      ctx.fillRect(x + pad, y + pad, inner, inner);

      // 左上高光
      ctx.fillStyle = colors.light;
      ctx.fillRect(x + pad, y + pad, inner, 3);
      ctx.fillRect(x + pad, y + pad, 3, inner);

      // 右下阴影
      ctx.fillStyle = colors.dark;
      ctx.fillRect(x + pad, y + S - pad - 3, inner, 3);
      ctx.fillRect(x + S - pad - 3, y + pad, 3, inner);

      // 预警：金色外框
      if (tile.shakeWarning) {
        const pulse = 0.5 + 0.5 * Math.sin(now * 0.018);
        ctx.strokeStyle = `rgba(255, 220, 0, ${pulse})`;
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 1, y + 1, S - 2, S - 2);
      }

    } else if (kind === SpecialType.ROCK) {
      // ── 数字岩石 ──
      const durIdx = Math.min(tile.durability - 1, ROCK_COLORS.length - 1);
      const rockColor = ROCK_COLORS[Math.max(0, durIdx)];

      ctx.fillStyle = rockColor;
      ctx.fillRect(x + pad, y + pad, inner, inner);

      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 5, y + 5, S - 10, S - 10);

      // 裂纹
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

      // 耐久数字
      ctx.font = `bold ${S * 0.4}px monospace`;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${tile.durability}`, x + S / 2, y + S / 2);

    } else if (kind === SpecialType.CRYSTAL) {
      // ── 8大核心主动功能水晶 ──
      const crystalType = tile.crystalType ?? CrystalType.RED;
      const meta = CRYSTAL_METAS[crystalType];

      // 底槽背景
      ctx.fillStyle = '#11151f';
      ctx.fillRect(x + pad, y + pad, inner, inner);

      const pulse = 0.7 + 0.3 * Math.sin(now * 0.008 + x);
      ctx.strokeStyle = meta.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 3, y + 3, S - 6, S - 6);

      // 菱形宝石晶体
      const cx = x + S / 2;
      const cy = y + S / 2;
      const r = S * 0.32;

      ctx.save();
      ctx.shadowColor = meta.color;
      ctx.shadowBlur = 10 * pulse;
      ctx.fillStyle = meta.color;
      ctx.beginPath();
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx + r * 0.85, cy);
      ctx.lineTo(cx, cy + r);
      ctx.lineTo(cx - r * 0.85, cy);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 水晶高光折射面
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.beginPath();
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx + r * 0.4, cy - r * 0.2);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx - r * 0.4, cy - r * 0.2);
      ctx.closePath();
      ctx.fill();

      // 小图标/文字标示
      ctx.font = '10px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(meta.shortName, cx, cy + r * 0.2);

    } else if (kind === SpecialType.TREASURE) {
      // ── 即时宝藏与能量球 ──
      ctx.fillStyle = '#161922';
      ctx.fillRect(x + pad, y + pad, inner, inner);

      const glow = 0.6 + 0.4 * Math.sin(now * 0.012 + y);
      ctx.strokeStyle = `rgba(255, 215, 0, ${glow})`;
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 3, y + 3, S - 6, S - 6);

      const cx = x + S / 2;
      const cy = y + S / 2;

      if (tile.treasureKind === TreasureKind.ENERGY_ORB) {
        // 即时能量水晶球（蓝光闪烁）
        ctx.save();
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 12 * glow;
        ctx.fillStyle = '#00e5ff';
        ctx.beginPath();
        ctx.arc(cx, cy, S * 0.28, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.font = `${S * 0.4}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚡', cx, cy + 1);
      } else {
        // 金币与文物
        let icon = '💰';
        if (tile.treasureKind === TreasureKind.FOSSIL) icon = '🦴';
        else if (tile.treasureKind === TreasureKind.ANTIQUE) icon = '🏺';
        else if (tile.treasureKind === TreasureKind.DIAMOND) icon = '💎';

        ctx.font = `${S * 0.5}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(icon, cx, cy + 1);
      }
    }

    // 受击颤动
    if (tile.shakeTimer && tile.shakeTimer > 0) {
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y + 1, S - 2, S - 2);
    }

    ctx.restore();
  }

  // ── 绘制全屏法术特效（激光光柱、地震波） ──
  private drawEffects(ctx: CanvasRenderingContext2D): void {
    // 1. 闪亮水晶：垂直贯穿激光束
    for (const laser of this.engine.activeLasers) {
      const alpha = laser.timer / laser.maxTimer;
      const x = laser.col * TILE_SIZE + TILE_SIZE / 2;
      const startY = laser.startR * TILE_SIZE;
      const endY = (laser.endR + 1) * TILE_SIZE;
      const beamW = TILE_SIZE * 0.8;

      ctx.save();
      // 外层青色光晕
      ctx.fillStyle = `rgba(0, 229, 255, ${0.45 * alpha})`;
      ctx.fillRect(x - beamW / 2, startY, beamW, endY - startY);

      // 内层亮白核心
      ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * alpha})`;
      ctx.fillRect(x - beamW * 0.25, startY, beamW * 0.5, endY - startY);

      // 顶部光圈
      ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(x, startY, beamW * 0.6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 2. 震荡水晶：大范围地震波
    for (const sw of this.engine.activeShockwaves) {
      const alpha = sw.timer / sw.maxTimer;
      ctx.save();
      ctx.strokeStyle = `rgba(255, 145, 0, ${alpha * 0.85})`;
      ctx.lineWidth = 6 * alpha;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();

      // 内圈辅波
      ctx.strokeStyle = `rgba(255, 215, 0, ${alpha * 0.5})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, Math.max(0, sw.radius - 16), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  // ── 目标深度指示线 ──
  private drawTargetDepthIndicator(ctx: CanvasRenderingContext2D): void {
    if (this.playerCtrl.targetRow <= 0) return;
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

    ctx.fillStyle = '#ffc800';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`🚩 目标深度 ${this.playerCtrl.targetRow * 2}m`, worldW - 8, y - 6);
    ctx.restore();
  }

  // ── 绘制玩家实体 ──
  private drawPlayer(ctx: CanvasRenderingContext2D): void {
    const p = this.playerCtrl.state;
    const S = TILE_SIZE;
    const cx = p.x + S / 2;
    const cy = p.y + S / 2;

    ctx.save();
    ctx.translate(cx, cy);

    let angle = 0;
    if (p.facing === 'down')  angle = 0;
    else if (p.facing === 'up')    angle = Math.PI;
    else if (p.facing === 'left')  angle = Math.PI / 2;
    else if (p.facing === 'right') angle = -Math.PI / 2;
    ctx.rotate(angle);

    // 机器人机身
    ctx.fillStyle = '#37474f';
    ctx.fillRect(-S * 0.32, -S * 0.28, S * 0.64, S * 0.56);

    ctx.strokeStyle = '#78909c';
    ctx.lineWidth = 2;
    ctx.strokeRect(-S * 0.32, -S * 0.28, S * 0.64, S * 0.56);

    // 驾驶舱护罩（青色光芒）
    ctx.fillStyle = '#00e5ff';
    ctx.beginPath();
    ctx.arc(0, -S * 0.05, S * 0.16, 0, Math.PI * 2);
    ctx.fill();

    // 钻头（前方三角形）
    const digOffset = p.isDigging ? (Math.sin(performance.now() * 0.06) > 0 ? 3 : -2) : 0;
    ctx.fillStyle = '#ffd600';
    ctx.beginPath();
    ctx.moveTo(-S * 0.2, S * 0.28 + digOffset);
    ctx.lineTo(S * 0.2,  S * 0.28 + digOffset);
    ctx.lineTo(0,        S * 0.46 + digOffset);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#ff6f00';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }

  // ── 绘制浮动文字 ──
  private drawFloatingTexts(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    for (const ft of this.engine.floatingTexts) {
      ctx.globalAlpha = ft.alpha;
      ctx.font = `bold ${ft.size}px monospace`;
      ctx.fillStyle = ft.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.restore();
  }
}
