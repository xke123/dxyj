/**
 * Player.ts — 原版钻地机器人控制器（含水晶背包与主动技能释放）
 *
 * 对标 e.java (机器人实体) + b.java W()/u() (按键挖掘逻辑) + b.java i() (水晶道具使用):
 *  - HP (e.I) + MaxHP (e.J=100) + Power (e.j=10) + Coins (e.C)
 *  - 道具背包 (bL.M[8] + bL.j 容量上限)
 *  - 拾取/挖掘即时宝藏与功能水晶
 *  - 主动释放 8 大水晶技能
 */

import {
  COLS, ROWS, TILE_SIZE, SpecialType, CrystalType, TreasureKind,
  CRYSTAL_METAS,
  type PlayerState,
} from './Types';
import { GridEngine } from './GridEngine';

export class PlayerController {
  public state: PlayerState;
  private engine: GridEngine;
  private moveSpeed = 0.25;
  private fallCooldown = 0;
  private onCoinCollect?: (coins: number) => void;
  private onInventoryChange?: () => void;
  private onDead?: () => void;
  private onWin?: () => void;

  public targetRow: number;

  constructor(engine: GridEngine, targetRow: number) {
    this.engine = engine;
    this.targetRow = targetRow;

    const startCol = Math.floor(COLS / 2);
    const startRow = 2;

    this.state = {
      gridX: startCol,
      gridY: startRow,
      x: startCol * TILE_SIZE,
      y: startRow * TILE_SIZE,
      targetX: startCol * TILE_SIZE,
      targetY: startRow * TILE_SIZE,
      hp: 100,
      maxHp: 100,
      power: 10,
      coins: 0,
      sessionCoins: 0,
      // 开局赠送基础水晶道具各1个方便体验与测试
      crystals: [1, 1, 1, 1, 1, 1, 1, 1],
      maxBackpack: 10,
      facing: 'down',
      isDigging: false,
      digAnimTimer: 0,
      depth: 0,
      targetDepth: targetRow * 2,
      won: false,
      dead: false,
    };
  }

  public setCallbacks(
    onCoinCollect: (coins: number) => void,
    onDead: () => void,
    onWin: () => void,
    onInventoryChange?: () => void
  ): void {
    this.onCoinCollect = onCoinCollect;
    this.onDead = onDead;
    this.onWin = onWin;
    this.onInventoryChange = onInventoryChange;
  }

  public getTotalCrystals(): number {
    return this.state.crystals.reduce((a, b) => a + b, 0);
  }

  // ── 尝试拾取或交互格子 ──
  private handleTileInteraction(nx: number, ny: number): boolean {
    const tile = this.engine.grid[ny]?.[nx];
    if (!tile) return false;

    // 1. 空白直接通行
    if (tile.kind === SpecialType.EMPTY) {
      this.moveTo(nx, ny);
      return true;
    }

    // 2. 可拾取法术水晶
    if (tile.kind === SpecialType.CRYSTAL && tile.crystalType !== undefined) {
      if (this.getTotalCrystals() >= this.state.maxBackpack) {
        this.engine.addFloatingText(
          nx * TILE_SIZE + TILE_SIZE / 2,
          ny * TILE_SIZE,
          '🎒 道具栏已满!',
          '#ff5252',
          18
        );
        return false;
      }

      const crystalType = tile.crystalType;
      const meta = CRYSTAL_METAS[crystalType];
      this.state.crystals[crystalType]++;
      this.engine.clearTile(nx, ny);
      this.engine.audio.playRelicFound();
      this.engine.addFloatingText(
        nx * TILE_SIZE + TILE_SIZE / 2,
        ny * TILE_SIZE,
        `+1 ${meta.name} ${meta.icon}`,
        meta.color,
        18
      );
      this.onInventoryChange?.();
      this.moveTo(nx, ny);
      return true;
    }

    // 3. 即时宝藏
    if (tile.kind === SpecialType.TREASURE) {
      if (tile.treasureKind === TreasureKind.ENERGY_ORB) {
        // 即时能量水晶：HP+20
        this.state.hp = Math.min(this.state.maxHp, this.state.hp + 20);
        this.engine.clearTile(nx, ny);
        this.engine.audio.playRelicFound();
        this.engine.addFloatingText(
          nx * TILE_SIZE + TILE_SIZE / 2,
          ny * TILE_SIZE,
          '+20 ⚡ 能量恢复',
          '#00e5ff',
          20
        );
      } else {
        // 金币宝藏
        const coins = tile.coins ?? 1000;
        let name = '宝藏';
        if (tile.treasureKind === TreasureKind.FOSSIL) name = '化石';
        else if (tile.treasureKind === TreasureKind.ANTIQUE) name = '古董';
        else if (tile.treasureKind === TreasureKind.GOLD_BAR) name = '金块';
        else if (tile.treasureKind === TreasureKind.DIAMOND) name = '钻石';

        this.state.sessionCoins += coins;
        this.state.coins += coins;
        this.engine.clearTile(nx, ny);
        this.engine.audio.playRelicFound();
        this.engine.addFloatingText(
          nx * TILE_SIZE + TILE_SIZE / 2,
          ny * TILE_SIZE,
          `+${coins} 💰 ${name}`,
          '#ffd700',
          20
        );
        this.onCoinCollect?.(coins);
      }
      this.moveTo(nx, ny);
      return true;
    }

    return false;
  }

  // ── 方向移动逻辑 ──
  public tryMove(dirX: number, dirY: number): boolean {
    if (this.state.isDigging || this.state.dead || this.state.won) return false;

    if (dirX > 0) this.state.facing = 'right';
    else if (dirX < 0) this.state.facing = 'left';
    else if (dirY > 0) this.state.facing = 'down';
    else if (dirY < 0) this.state.facing = 'up';

    const nx = this.state.gridX + dirX;
    const ny = this.state.gridY + dirY;

    if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) return false;

    return this.handleTileInteraction(nx, ny);
  }

  // ── 原版 W() 挖掘朝向格子 ──
  public digFacing(): boolean {
    if (this.state.isDigging || this.state.dead || this.state.won) return false;

    let dx = 0, dy = 0;
    if (this.state.facing === 'down')  dy = 1;
    else if (this.state.facing === 'up')    dy = -1;
    else if (this.state.facing === 'left')  dx = -1;
    else if (this.state.facing === 'right') dx = 1;

    const tx = this.state.gridX + dx;
    const ty = this.state.gridY + dy;

    if (tx < 0 || tx >= COLS || ty < 0 || ty >= ROWS) return false;

    const targetTile = this.engine.grid[ty]?.[tx];
    if (!targetTile || targetTile.kind === SpecialType.EMPTY) return false;

    // 先检查是否是宝藏或水晶
    if (targetTile.kind === SpecialType.CRYSTAL || targetTile.kind === SpecialType.TREASURE) {
      return this.handleTileInteraction(tx, ty);
    }

    // 每次挖掘固定消耗 1 点生命能量
    this.consumeHp(1);

    this.state.isDigging = true;
    this.state.digAnimTimer = 0.12;

    if (targetTile.kind === SpecialType.ROCK) {
      const destroyed = this.engine.hitRock(tx, ty);
      if (destroyed && dy > 0) {
        this.moveTo(tx, ty);
      }
      return true;
    }

    if (targetTile.kind >= 0 && targetTile.kind <= 3) {
      this.engine.excavateColor(tx, ty);
      if (dy > 0) {
        this.moveTo(tx, ty);
      }
      return true;
    }

    return false;
  }

  // ── 主动释放 8 大水晶技能（对标原版 i()）──
  public useCrystal(type: CrystalType): boolean {
    if (this.state.dead || this.state.won) return false;
    if (this.state.crystals[type] <= 0) {
      const meta = CRYSTAL_METAS[type];
      this.engine.addFloatingText(
        this.state.x + TILE_SIZE / 2,
        this.state.y - 10,
        `❌ 没有【${meta.name}】`,
        '#888888',
        16
      );
      return false;
    }

    // 扣除数量
    this.state.crystals[type]--;
    const meta = CRYSTAL_METAS[type];

    // 分发具体技能
    switch (type) {
      case CrystalType.RED:
      case CrystalType.YELLOW:
      case CrystalType.BLUE:
      case CrystalType.GREEN: {
        const count = this.engine.clearColorTiles(type, this.state.gridY);
        this.engine.addFloatingText(
          this.state.x + TILE_SIZE / 2,
          this.state.y - 14,
          `✨ ${meta.name} 清除 ×${count}`,
          meta.color,
          20
        );
        break;
      }
      case CrystalType.BLACK: {
        const count = this.engine.clearRockTiles(this.state.gridY);
        this.engine.addFloatingText(
          this.state.x + TILE_SIZE / 2,
          this.state.y - 14,
          `⚫ 黑色水晶 碎岩 ×${count}`,
          '#b0bec5',
          20
        );
        break;
      }
      case CrystalType.FLASH: {
        this.engine.castLaser(this.state.gridX, this.state.gridY, 14);
        this.engine.addFloatingText(
          this.state.x + TILE_SIZE / 2,
          this.state.y - 14,
          `⚡ 闪亮激光 贯穿开路!`,
          '#00e5ff',
          22
        );
        break;
      }
      case CrystalType.EARTHQUAKE: {
        const count = this.engine.castEarthquake(this.state.gridX, this.state.gridY, 4);
        this.engine.addFloatingText(
          this.state.x + TILE_SIZE / 2,
          this.state.y - 14,
          `💥 震荡波 摧毁 ×${count}`,
          '#ff9100',
          22
        );
        break;
      }
      case CrystalType.ENERGY_BLUE: {
        this.state.hp = Math.min(this.state.maxHp, this.state.hp + 20);
        this.engine.audio.playRelicFound();
        this.engine.addFloatingText(
          this.state.x + TILE_SIZE / 2,
          this.state.y - 14,
          `💙 生命体力 +20`,
          '#00b0ff',
          22
        );
        break;
      }
    }

    this.onInventoryChange?.();
    return true;
  }

  private consumeHp(amount: number): void {
    this.state.hp = Math.max(0, this.state.hp - amount);
    if (this.state.hp <= 0 && !this.state.dead) {
      this.state.dead = true;
      this.engine.audio.playGameOver();
      this.onDead?.();
    }
  }

  public onCrush(): void {
    if (this.state.dead) return;
    this.consumeHp(30);
    this.engine.camera?.triggerShake(12, 0.35);
    this.engine.audio.playCascadeRumble();
  }

  private moveTo(nx: number, ny: number): void {
    this.state.gridX = nx;
    this.state.gridY = ny;
    this.state.targetX = nx * TILE_SIZE;
    this.state.targetY = ny * TILE_SIZE;

    // 深度更新（原版深度 = 行号*2m）
    const absoluteRow = ny + this.engine.scrolledRows;
    this.state.depth = Math.max(0, (absoluteRow - 2) * 2);

    // 通关判断
    if (absoluteRow >= this.targetRow && !this.state.won && !this.state.dead) {
      this.state.won = true;
      this.onWin?.();
    }
  }

  // ── 每帧更新（平滑插值 + 重力坠落）──
  public update(dt: number): void {
    if (this.state.isDigging) {
      this.state.digAnimTimer -= dt;
      if (this.state.digAnimTimer <= 0) {
        this.state.isDigging = false;
      }
    }

    // 平滑插值渲染坐标
    const t = 1 - Math.pow(this.moveSpeed, dt * 60);
    this.state.x += (this.state.targetX - this.state.x) * t;
    this.state.y += (this.state.targetY - this.state.y) * t;

    // 原版重力检查：脚下为空时自然坠落
    this.fallCooldown -= dt;
    if (this.fallCooldown <= 0 && !this.state.dead && !this.state.won) {
      const belowY = this.state.gridY + 1;
      if (belowY < ROWS) {
        const belowTile = this.engine.grid[belowY]?.[this.state.gridX];
        if (belowTile && belowTile.kind === SpecialType.EMPTY) {
          this.moveTo(this.state.gridX, belowY);
          this.fallCooldown = 0.08;
        }
      }
    }
  }
}
