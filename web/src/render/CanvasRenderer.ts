import {
  COLS,
  ROWS,
  TILE_SIZE,
  TileType,
  type Tile,
} from '../core/Types';
import { GridEngine } from '../core/GridEngine';
import { PlayerController } from '../core/Player';
import { Camera } from './Camera';
import { ParticleSystem } from './ParticleSystem';

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private gridEngine: GridEngine;
  private playerCtrl: PlayerController;
  private camera: Camera;
  private particles: ParticleSystem;

  constructor(
    canvas: HTMLCanvasElement,
    gridEngine: GridEngine,
    playerCtrl: PlayerController,
    camera: Camera,
    particles: ParticleSystem
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.gridEngine = gridEngine;
    this.playerCtrl = playerCtrl;
    this.camera = camera;
    this.particles = particles;
  }

  public render(): void {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // 清空背景
    ctx.fillStyle = '#0a0e14';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    // 摄像机视口变换（包含震屏偏移）
    ctx.translate(-this.camera.getRenderX(), -this.camera.getRenderY());

    // 绘制地底背景与纵向标尺线
    this.renderSubsurfaceBackground(ctx);

    // 绘制所有方块
    this.renderTiles(ctx);

    // 绘制主角探照手电光柱
    this.renderFlashlight(ctx);

    // 绘制主角
    this.renderPlayer(ctx);

    // 绘制粒子
    this.particles.render(ctx);

    // 绘制浮动文字
    this.renderFloatingTexts(ctx);

    ctx.restore();
  }

  private renderSubsurfaceBackground(ctx: CanvasRenderingContext2D): void {
    const worldW = COLS * TILE_SIZE;
    const worldH = ROWS * TILE_SIZE;

    // 深度渐变底色
    const grad = ctx.createLinearGradient(0, 0, 0, worldH);
    grad.addColorStop(0, '#0f1722');     // 浅表冰层幽蓝
    grad.addColorStop(0.3, '#13111c');   // 中层古都暗紫
    grad.addColorStop(0.7, '#180e12');   // 深层地宫熔岩暗红
    grad.addColorStop(1, '#080608');     // 地核原点幽邃黑
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, worldW, worldH);

    // 左右两侧边界岩壁
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, worldW, worldH);

    // 绘制每 10 米深度的暗色分界线与标识
    ctx.font = '11px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    for (let r = 5; r < ROWS; r += 8) {
      const y = r * TILE_SIZE;
      ctx.beginPath();
      ctx.setLineDash([4, 6]);
      ctx.moveTo(0, y);
      ctx.lineTo(worldW, y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillText(`- ${(r * 1.2).toFixed(0)}m 地层 -`, 10, y - 4);
    }
  }

  private renderTiles(ctx: CanvasRenderingContext2D): void {
    const startCol = Math.max(0, Math.floor(this.camera.x / TILE_SIZE) - 1);
    const endCol = Math.min(COLS - 1, Math.ceil((this.camera.x + this.camera.viewportWidth) / TILE_SIZE) + 1);
    const startRow = Math.max(0, Math.floor(this.camera.y / TILE_SIZE) - 1);
    const endRow = Math.min(ROWS - 1, Math.ceil((this.camera.y + this.camera.viewportHeight) / TILE_SIZE) + 1);

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const tile = this.gridEngine.grid[r][c];
        if (tile.type === TileType.EMPTY) continue;

        // 加上预警高频震颤偏移 shakeVisualX / shakeVisualY 与下落平滑插值 fallYOffset
        let drawX = c * TILE_SIZE + (tile.shakeVisualX || 0);
        let drawY = r * TILE_SIZE + (tile.shakeVisualY || 0) + (tile.fallYOffset || 0);

        // 受击震颤偏移
        if (tile.shakeTime > 0) {
          drawX += (Math.random() - 0.5) * 6;
          drawY += (Math.random() - 0.5) * 6;
        }

        this.drawSingleTile(ctx, tile, drawX, drawY);
      }
    }
  }

  private drawSingleTile(ctx: CanvasRenderingContext2D, tile: Tile, x: number, y: number): void {
    const size = TILE_SIZE;
    const padding = 1.5;

    ctx.save();

    // 基础方块主体
    const color = this.gridEngine.getTileColor(tile.type);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x + padding, y + padding, size - padding * 2, size - padding * 2, 4);
    ctx.fill();

    // 预警震颤时添加显眼的金色呼吸光圈外框与角标红点
    if (tile.shakeWarning) {
      const pulse = 0.6 + 0.4 * Math.sin(performance.now() * 0.02);
      ctx.strokeStyle = `rgba(255, 214, 0, ${pulse})`;
      ctx.lineWidth = 3.5;
      ctx.strokeRect(x + 1, y + 1, size - 2, size - 2);

      // 角标危险红光警示
      ctx.fillStyle = '#ff1744';
      ctx.beginPath();
      ctx.arc(x + 5, y + 5, 2.5, 0, Math.PI * 2);
      ctx.arc(x + size - 5, y + 5, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 晶莹高光斜角边框（现代斜角水晶质感）
    if (tile.type >= TileType.ICE_AZURE && tile.type <= TileType.SOLAR_AMBER) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + padding, y + size - padding);
      ctx.lineTo(x + padding, y + padding);
      ctx.lineTo(x + size - padding, y + padding);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.moveTo(x + size - padding, y + padding);
      ctx.lineTo(x + size - padding, y + size - padding);
      ctx.lineTo(x + padding, y + size - padding);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillRect(x + size * 0.3, y + size * 0.3, 3, 3);
    }

    // 【数字岩石】：带耐久数字 3..2..1
    if (tile.type === TileType.HARD_ROCK) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 4, y + 4, size - 8, size - 8);

      ctx.font = 'bold 18px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${tile.durability}`, x + size / 2, y + size / 2);

      const damageStage = tile.maxDurability - tile.durability;
      if (damageStage > 0) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 8, y + 8);
        ctx.lineTo(x + 20, y + 22);
        if (damageStage >= 2) {
          ctx.lineTo(x + 14, y + 36);
          ctx.moveTo(x + 20, y + 22);
          ctx.lineTo(x + 36, y + 28);
        }
        ctx.stroke();
      }
    }

    // 【古代合金壁】：带防爆铆钉与赤红耐久数字
    if (tile.type === TileType.ANCIENT_ALLOY) {
      ctx.strokeStyle = '#37474f';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 3, y + 3, size - 6, size - 6);

      ctx.fillStyle = '#90a4ae';
      ctx.fillRect(x + 6, y + 6, 3, 3);
      ctx.fillRect(x + size - 9, y + 6, 3, 3);
      ctx.fillRect(x + 6, y + size - 9, 3, 3);
      ctx.fillRect(x + size - 9, y + size - 9, 3, 3);

      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = '#ef5350';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${tile.durability}`, x + size / 2, y + size / 2);
    }

    // 宝藏与钥匙图标
    if (tile.type === TileType.RELIC_CRATE || tile.type === TileType.KEY_CHEST) {
      ctx.strokeStyle = tile.type === TileType.KEY_CHEST ? '#ff4081' : '#ffea00';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(x + 3, y + 3, size - 6, size - 6);

      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const icon = tile.relic?.icon || (tile.type === TileType.KEY_CHEST ? '🗝️' : '📦');
      ctx.fillText(icon, x + size / 2, y + size / 2 + 1);
    }

    ctx.restore();
  }

  private renderFlashlight(ctx: CanvasRenderingContext2D): void {
    const p = this.playerCtrl.player;
    const px = p.x + TILE_SIZE / 2;
    const py = p.y + TILE_SIZE / 2;

    ctx.save();
    let angle = Math.PI / 2;
    if (p.facing === 'left') angle = Math.PI;
    else if (p.facing === 'right') angle = 0;
    else if (p.facing === 'up') angle = -Math.PI / 2;

    const beamDist = 180;
    const beamAngle = 0.55;

    const grad = ctx.createRadialGradient(px, py, 10, px, py, beamDist);
    grad.addColorStop(0, 'rgba(255, 240, 200, 0.35)');
    grad.addColorStop(0.6, 'rgba(255, 230, 160, 0.12)');
    grad.addColorStop(1, 'rgba(255, 230, 160, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.arc(px, py, beamDist, angle - beamAngle, angle + beamAngle);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  private renderPlayer(ctx: CanvasRenderingContext2D): void {
    const p = this.playerCtrl.player;
    const px = p.x;
    const py = p.y;
    const size = TILE_SIZE;

    ctx.save();
    ctx.translate(px, py);

    // 探险者身体
    ctx.fillStyle = '#2b3a4a';
    ctx.beginPath();
    ctx.roundRect(8, 14, size - 16, size - 16, 6);
    ctx.fill();

    // 防风皮质披肩
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(10, 14, size - 20, 8);

    // 兜帽与面罩
    ctx.fillStyle = '#1e2833';
    ctx.beginPath();
    ctx.arc(size / 2, 12, 9, 0, Math.PI * 2);
    ctx.fill();

    // 额头探照矿灯
    ctx.fillStyle = '#ffff66';
    ctx.shadowColor = '#ffff00';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(size / 2, 7, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 手中洛阳探铲
    ctx.save();
    ctx.translate(size / 2, size / 2);
    if (p.isDigging) {
      ctx.rotate(p.facing === 'left' ? -1.2 : 1.2);
    }
    ctx.strokeStyle = '#b0bec5';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(p.facing === 'left' ? -16 : 16, 12);
    ctx.stroke();

    ctx.fillStyle = '#cfd8dc';
    ctx.fillRect(p.facing === 'left' ? -20 : 14, 10, 6, 6);
    ctx.restore();

    ctx.restore();
  }

  private renderFloatingTexts(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const ft of this.gridEngine.floatingTexts) {
      ctx.globalAlpha = ft.alpha;
      ctx.font = `bold ${ft.size}px sans-serif`;
      ctx.fillStyle = ft.color;
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.restore();
  }
}
