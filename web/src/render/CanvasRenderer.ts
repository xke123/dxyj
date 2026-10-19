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
  COLS, TILE_SIZE, SpecialType, CrystalType, TreasureKind,
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
    const worldH = this.engine.rows * TILE_SIZE;

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

    for (let r = 8; r < this.engine.rows; r += 8) {
      const y = r * TILE_SIZE;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(worldW, y);
      ctx.stroke();
      const depthM = (r - 2) * 2;
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
    const endR   = Math.min(this.engine.rows - 1, Math.ceil((camY + vh) / TILE_SIZE));

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
      // ── 8大核心主动功能水晶：坚固的玄武岩深渊基底 + 璀璨法术晶体 ──
      const crystalType = tile.crystalType ?? CrystalType.RED;
      const meta = CRYSTAL_METAS[crystalType];

      // 实体矿石基底（实心方块质感，清晰占据网格）
      ctx.fillStyle = '#1a2233';
      ctx.fillRect(x + pad, y + pad, inner, inner);

      // 上左高光棱边
      ctx.fillStyle = '#2d3b56';
      ctx.fillRect(x + pad, y + pad, inner, 3);
      ctx.fillRect(x + pad, y + pad, 3, inner);

      // 下右深色阴影
      ctx.fillStyle = '#0f1420';
      ctx.fillRect(x + pad, y + S - pad - 3, inner, 3);
      ctx.fillRect(x + S - pad - 3, y + pad, 3, inner);

      // 内凹能量槽
      const slotPad = 5;
      ctx.fillStyle = '#0b0f17';
      ctx.fillRect(x + slotPad, y + slotPad, S - slotPad * 2, S - slotPad * 2);

      const pulse = 0.75 + 0.25 * Math.sin(now * 0.008 + x * 0.1);
      ctx.strokeStyle = meta.color;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + slotPad, y + slotPad, S - slotPad * 2, S - slotPad * 2);

      // 菱形宝石晶体
      const cx = x + S / 2;
      const cy = y + S / 2;
      const r = S * 0.28;

      ctx.save();
      ctx.shadowColor = meta.color;
      ctx.shadowBlur = 12 * pulse;
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
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx + r * 0.4, cy - r * 0.2);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx - r * 0.4, cy - r * 0.2);
      ctx.closePath();
      ctx.fill();

      // 水晶短名文字标示
      ctx.font = 'bold 10px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(meta.shortName, cx, cy + r * 0.35);

    } else if (kind === SpecialType.TREASURE) {
      // ── 即时宝藏与能量球：实心古代宝箱/浮雕秘宝方块（实实在在占据完整网格）──
      const isEnergy = tile.treasureKind === TreasureKind.ENERGY_ORB;

      // 1. 实心方块基底（宝藏为古典红木/金铜铸造实心方块，能量球为深海符文实心岩石）
      const baseMain = isEnergy ? '#0d2838' : '#3e2723';
      const baseLight = isEnergy ? '#194d6b' : '#5d4037';
      const baseDark = isEnergy ? '#06131c' : '#1b0000';

      ctx.fillStyle = baseMain;
      ctx.fillRect(x + pad, y + pad, inner, inner);

      // 上左高光棱边
      ctx.fillStyle = baseLight;
      ctx.fillRect(x + pad, y + pad, inner, 3);
      ctx.fillRect(x + pad, y + pad, 3, inner);

      // 下右阴影
      ctx.fillStyle = baseDark;
      ctx.fillRect(x + pad, y + S - pad - 3, inner, 3);
      ctx.fillRect(x + S - pad - 3, y + pad, 3, inner);

      // 2. 宝箱/古迹金属包边与四角金铜铆钉
      const glow = 0.7 + 0.3 * Math.sin(now * 0.01 + y * 0.1);
      const frameColor = isEnergy ? `rgba(0, 229, 255, ${glow})` : `rgba(255, 215, 0, ${glow})`;
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 4, y + 4, S - 8, S - 8);

      // 四角铆钉
      ctx.fillStyle = isEnergy ? '#80d8ff' : '#ffe082';
      const rivetOff = 5;
      const rivetR = 2;
      for (const [rx, ry] of [
        [x + rivetOff, y + rivetOff],
        [x + S - rivetOff, y + rivetOff],
        [x + rivetOff, y + S - rivetOff],
        [x + S - rivetOff, y + S - rivetOff],
      ]) {
        ctx.beginPath();
        ctx.arc(rx, ry, rivetR, 0, Math.PI * 2);
        ctx.fill();
      }

      const cx = x + S / 2;
      const cy = y + S / 2;

      if (isEnergy) {
        // 即时能量水晶球（蓝光呼吸闪烁）
        ctx.save();
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 14 * glow;
        ctx.fillStyle = '#00e5ff';
        ctx.beginPath();
        ctx.arc(cx, cy, S * 0.26, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.font = `${S * 0.38}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚡', cx, cy + 1);
      } else {
        // 金币、化石、古董、钻石宝藏浮雕徽章
        let icon = '💰';
        if (tile.treasureKind === TreasureKind.FOSSIL) icon = '🦴';
        else if (tile.treasureKind === TreasureKind.ANTIQUE) icon = '🏺';
        else if (tile.treasureKind === TreasureKind.DIAMOND) icon = '💎';
        else if (tile.treasureKind === TreasureKind.GOLD_BAR) icon = '👑';

        // 徽章光芒与图标
        ctx.save();
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 10 * glow;
        ctx.font = `${S * 0.48}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(icon, cx, cy + 1);
        ctx.restore();
      }

    } else if (kind === SpecialType.GOAL) {
      // ── 最底层终极通关奖励宝箱（华丽的金色通关大宝箱）──
      const glow = 0.75 + 0.25 * Math.sin(now * 0.008 + x * 0.1);

      // 1. 底座黄金祭台/宝箱基底
      ctx.fillStyle = '#3a1f0a';
      ctx.fillRect(x + pad, y + pad, inner, inner);

      // 上左高光棱边
      ctx.fillStyle = '#6d4218';
      ctx.fillRect(x + pad, y + pad, inner, 3);
      ctx.fillRect(x + pad, y + pad, 3, inner);

      // 宝箱深色红木/古铜实心箱体
      ctx.fillStyle = '#7a4212';
      ctx.fillRect(x + 4, y + 10, S - 8, S - 13);

      // 2. 宝箱盖（圆拱形金色箱盖，带流光高光）
      const lidH = S * 0.36;
      ctx.fillStyle = '#a6681d';
      ctx.beginPath();
      ctx.roundRect(x + 3, y + 4, S - 6, lidH, [5, 5, 0, 0]);
      ctx.fill();

      // 箱盖顶部流光高光
      ctx.fillStyle = '#ffe082';
      ctx.fillRect(x + 5, y + 5, S - 10, 2);

      // 3. 黄金金属包边与角码
      ctx.save();
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 14 * glow;
      ctx.strokeStyle = `rgba(255, 215, 0, ${glow})`;
      ctx.lineWidth = 2.2;
      ctx.strokeRect(x + 4, y + 5, S - 8, S - 8);

      // 箱身中间的纵向黄金加固横带
      ctx.fillStyle = '#ffd54f';
      ctx.fillRect(x + S / 2 - 3, y + 5, 6, S - 8);
      ctx.restore();

      // 4. 正中央皇家锁扣与镶嵌红宝石
      const cx = x + S / 2;
      const cy = y + S / 2 + 2;

      // 黄金锁牌
      ctx.fillStyle = '#ffa000';
      ctx.beginPath();
      ctx.arc(cx, cy, 5.5, 0, Math.PI * 2);
      ctx.fill();

      // 璀璨红宝石核心
      ctx.fillStyle = '#ff1744';
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();

      // 5. 宝箱上方漂浮的奖杯/皇冠与光芒
      ctx.save();
      ctx.font = `${S * 0.35}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🏆', cx, y + 3);
      ctx.restore();

    } else if (kind === SpecialType.BEDROCK) {
      // ── 地底最深处的远古不可摧毁基岩 ──
      ctx.fillStyle = '#10141a';
      ctx.fillRect(x + pad, y + pad, inner, inner);

      // 金属深灰色棱边
      ctx.fillStyle = '#263238';
      ctx.fillRect(x + pad, y + pad, inner, 2);
      ctx.fillRect(x + pad, y + pad, 2, inner);
      ctx.fillStyle = '#05070a';
      ctx.fillRect(x + pad, y + S - pad - 2, inner, 2);
      ctx.fillRect(x + S - pad - 2, y + pad, 2, inner);

      // 岩体纹理与地心微光缝隙
      ctx.strokeStyle = '#37474f';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + 6, y + 10);
      ctx.lineTo(x + 20, y + 24);
      ctx.lineTo(x + 36, y + 18);
      ctx.moveTo(x + 16, y + 36);
      ctx.lineTo(x + 28, y + 28);
      ctx.stroke();

      // 地心微热红光斑
      ctx.fillStyle = 'rgba(255, 87, 34, 0.25)';
      ctx.fillRect(x + 8, y + 18, 5, 5);
      ctx.fillRect(x + 26, y + 12, 4, 4);
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
    const targetAbsRow = this.playerCtrl.targetRow;
    if (targetAbsRow < 0 || targetAbsRow >= this.engine.rows) return;

    const y = targetAbsRow * TILE_SIZE;
    const worldW = COLS * TILE_SIZE;

    ctx.save();
    const now = performance.now();
    const glow = 0.6 + 0.4 * Math.sin(now * 0.006);

    ctx.setLineDash([12, 6]);
    ctx.strokeStyle = `rgba(255, 215, 0, ${glow})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(worldW, y);
    ctx.stroke();

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'right';
    const prize = this.playerCtrl.stage?.prize ?? 5000;
    const depthM = this.playerCtrl.stage?.depthM ?? 60;
    ctx.fillText(`🏆 终点通关宝箱 ${depthM}m（奖金 +${prize.toLocaleString()}）`, worldW - 8, y - 6);
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

    // 无敌闪烁
    if (p.isInvincible) {
      ctx.globalAlpha = Math.floor(performance.now() / 60) % 2 === 0 ? 0.35 : 1.0;
    }

    // 被砸扁压特效（原版 bL.a(7) 动画）
    if (p.isCrushed) {
      ctx.scale(1.35, 0.45);
    }

    let angle = 0;
    if (p.facing === 'down')  angle = 0;
    else if (p.facing === 'up')    angle = Math.PI;
    else if (p.facing === 'left')  angle = Math.PI / 2;
    else if (p.facing === 'right') angle = -Math.PI / 2;
    ctx.rotate(angle);

    // 机器人机身（受砸时变红警示）
    ctx.fillStyle = p.isCrushed ? '#d32f2f' : '#37474f';
    ctx.fillRect(-S * 0.32, -S * 0.28, S * 0.64, S * 0.56);

    ctx.strokeStyle = p.isCrushed ? '#ff5252' : '#78909c';
    ctx.lineWidth = 2;
    ctx.strokeRect(-S * 0.32, -S * 0.28, S * 0.64, S * 0.56);

    // 驾驶舱护罩（青色光芒 / 受砸红光）
    ctx.fillStyle = p.isCrushed ? '#ff1744' : '#00e5ff';
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
