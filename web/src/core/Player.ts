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
  COLS, TILE_SIZE, SpecialType, CrystalType, TreasureKind,
  CRYSTAL_METAS, UPGRADE_MATRIX, getStageTargetRow,
  type PlayerState, type StageInfo, type SaveData, type Tile,
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

  public stage?: StageInfo;
  public targetRow: number;

  constructor(engine: GridEngine, stage?: StageInfo, saveData?: SaveData) {
    this.engine = engine;
    this.stage = stage;
    const startCol = Math.floor(COLS / 2);
    const startRow = 2;

    const level = saveData ? Math.max(1, Math.min(20, saveData.level)) : 1;
    const upgrade = UPGRADE_MATRIX[level - 1];
    const depthM = stage ? stage.depthM : 80;
    this.targetRow = getStageTargetRow(depthM);

    this.state = {
      gridX: startCol,
      gridY: startRow,
      x: startCol * TILE_SIZE,
      y: startRow * TILE_SIZE,
      targetX: startCol * TILE_SIZE,
      targetY: startRow * TILE_SIZE,
      hp: upgrade.maxHp,
      maxHp: upgrade.maxHp,
      power: upgrade.power,
      coins: saveData ? saveData.coins : 0,
      sessionCoins: 0,
      crystals: saveData ? [...saveData.crystals] : [1, 1, 1, 1, 1, 1, 1, 1],
      maxBackpack: upgrade.backpack,
      facing: 'down',
      isDigging: false,
      digAnimTimer: 0,
      isCrushed: false,
      crushTimer: 0,
      isInvincible: false,
      invincibleTimer: 0,
      depth: 0,
      targetDepth: depthM > 0 ? depthM : 60,
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

  // ── 拾取宝藏或水晶物品（触碰或从天而降接住）──
  public collectTileItem(tile: Tile, wx?: number, wy?: number): boolean {
    const px = wx ?? (this.state.x + TILE_SIZE / 2);
    const py = wy ?? (this.state.y + TILE_SIZE / 2);

    // 1. 法术水晶
    if (tile.kind === SpecialType.CRYSTAL && tile.crystalType !== undefined) {
      if (this.getTotalCrystals() >= this.state.maxBackpack) {
        this.engine.addFloatingText(px, py, '🎒 道具栏已满!', '#ff5252', 18);
        return false;
      }

      const crystalType = tile.crystalType as CrystalType;
      const meta = CRYSTAL_METAS[crystalType];
      this.state.crystals[crystalType]++;
      this.engine.audio.playRelicFound();
      this.engine.addFloatingText(
        px,
        py - 10,
        `+1 ${meta.name} ${meta.icon}`,
        meta.color,
        18
      );
      this.onInventoryChange?.();
      return true;
    }

    // 2. 即时宝藏
    if (tile.kind === SpecialType.TREASURE) {
      if (tile.treasureKind === TreasureKind.ENERGY_ORB) {
        // 即时能量水晶：HP+20
        this.state.hp = Math.min(this.state.maxHp, this.state.hp + 20);
        this.engine.audio.playRelicFound();
        this.engine.addFloatingText(
          px,
          py - 10,
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
        this.engine.audio.playRelicFound();
        this.engine.addFloatingText(
          px,
          py - 10,
          `+${coins} 💰 ${name}`,
          '#ffd700',
          20
        );
        this.onCoinCollect?.(coins);
      }
      return true;
    }

    return false;
  }

  // ── 开启最底层的通关秘宝箱 ──
  public collectGoalChest(nx: number, ny: number): void {
    if (this.state.won || this.state.dead) return;
    this.state.won = true; // 关键防线：第一时间标记通关，彻底阻止任何后续重复触发与重入递归！

    const prize = this.stage ? this.stage.prize : 8000;
    this.state.sessionCoins += prize;
    this.state.coins += prize;

    const wx = nx * TILE_SIZE + TILE_SIZE / 2;
    const wy = ny * TILE_SIZE + TILE_SIZE / 2;

    this.engine.particles.emitSparkle(wx, wy, '#ffd700', 45);
    this.engine.particles.emitSparkle(wx, wy, '#00e5ff', 30);
    this.engine.camera?.triggerShake(14, 0.4);
    this.engine.audio.playRelicFound();

    this.engine.addFloatingText(
      wx,
      wy - 18,
      `🏆 开启通关宝箱! +${prize.toLocaleString()} 奖金`,
      '#ffd700',
      24
    );

    // 就地安全同步坐标与深度，绝不调用会反向递归调用本函数的 moveTo
    this.state.gridX = nx;
    this.state.gridY = ny;
    this.state.targetX = nx * TILE_SIZE;
    this.state.targetY = ny * TILE_SIZE;
    const absoluteRow = ny + this.engine.scrolledRows;
    this.state.depth = Math.max(0, absoluteRow - 2);

    this.onWin?.();
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

    // 2. 可拾取法术水晶与即时宝藏
    if (tile.kind === SpecialType.CRYSTAL || tile.kind === SpecialType.TREASURE) {
      const collected = this.collectTileItem(tile, nx * TILE_SIZE + TILE_SIZE / 2, ny * TILE_SIZE);
      if (collected) {
        this.engine.clearTile(nx, ny);
        this.moveTo(nx, ny);
        return true;
      }
      return false;
    }

    // 3. 通关奖励宝箱（位于关卡最底层）
    if (tile.kind === SpecialType.GOAL) {
      this.collectGoalChest(nx, ny);
      return true;
    }

    return false;
  }

  // 判定指定格子是否可通过（空气、可拾取宝藏或水晶、目标终点宝箱）
  public isPassable(c: number, r: number): boolean {
    if (c < 0 || c >= COLS || r < 0 || r >= this.engine.rows) return false;
    const tile = this.engine.grid[r]?.[c];
    if (!tile) return false;
    return (
      tile.kind === SpecialType.EMPTY ||
      tile.kind === SpecialType.CRYSTAL ||
      tile.kind === SpecialType.TREASURE ||
      tile.kind === SpecialType.GOAL
    );
  }

  // ── 方向移动与台阶攀爬逻辑（对标原版 u(), D(), f()）──
  public tryMove(dirX: number, dirY: number): boolean {
    if (this.state.isDigging || this.state.dead || this.state.won || this.state.isCrushed) return false;

    if (dirX > 0) this.state.facing = 'right';
    else if (dirX < 0) this.state.facing = 'left';
    else if (dirY > 0) this.state.facing = 'down';
    else if (dirY < 0) this.state.facing = 'up';

    // 1. 横向移动与 1 格台阶自动攀爬翻越（原版 b.java:2906 D() 与 2930 f()）
    if (dirX !== 0 && dirY === 0) {
      const nx = this.state.gridX + dirX;
      const ny = this.state.gridY;

      if (nx < 0 || nx >= COLS) return false;

      const targetTile = this.engine.grid[ny]?.[nx];

      // 前方是纯空气空格
      if (targetTile?.kind === SpecialType.EMPTY) {
        // 原版 b.java:2914：若目标格下方也是纯空格，玩家前移并顺势下落 1 格台阶
        const belowTile = ny + 1 < this.engine.rows ? this.engine.grid[ny + 1]?.[nx] : null;
        if (belowTile && belowTile.kind === SpecialType.EMPTY) {
          this.moveTo(nx, ny + 1);
          return true;
        }
        this.moveTo(nx, ny);
        return true;
      }

      // 前方是宝藏、水晶或通关宝箱：走入开箱拾取！
      if (
        targetTile?.kind === SpecialType.TREASURE ||
        targetTile?.kind === SpecialType.CRYSTAL ||
        targetTile?.kind === SpecialType.GOAL
      ) {
        return this.handleTileInteraction(nx, ny);
      }

      // 前方是实心方块（原版 b.java:2921 & 2945：判定是否能翻越 1 格高的障碍台阶）
      // 判定条件：玩家头顶空气畅通 (gridX, ny - 1)，且前方方块头顶空气畅通 (nx, ny - 1)
      if (ny > 0 && this.isPassable(this.state.gridX, ny - 1) && this.isPassable(nx, ny - 1)) {
        // 成功攀爬上 1 格高的台阶！
        return this.handleTileInteraction(nx, ny - 1);
      }

      return false;
    }

    // 2. 垂直移动
    const nx = this.state.gridX + dirX;
    const ny = this.state.gridY + dirY;
    if (nx < 0 || nx >= COLS || ny < 0 || ny >= this.engine.rows) return false;

    if (dirY > 0) {
      // 向下移动：进入空格或拾取宝藏/通关宝箱
      if (this.isPassable(nx, ny)) {
        return this.handleTileInteraction(nx, ny);
      }
      return false;
    }

    // 向上移动：原版中不能凭空向上飞，但可转向朝上。若需要开路，只需按挖掘键即可挖掘上方同色方块！
    return false;
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

    if (tx < 0 || tx >= COLS || ty < 0 || ty >= this.engine.rows) return false;

    const targetTile = this.engine.grid[ty]?.[tx];
    if (!targetTile || targetTile.kind === SpecialType.EMPTY) return false;

    // 先检查是否是宝藏、水晶或通关宝箱
    if (
      targetTile.kind === SpecialType.CRYSTAL ||
      targetTile.kind === SpecialType.TREASURE ||
      targetTile.kind === SpecialType.GOAL
    ) {
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

  // ── 原版 b.java:2354 & 332：被坠落方块砸中惩罚与受创状态机 ──
  public onCrush(): void {
    if (this.state.dead || this.state.won || this.state.isInvincible || this.state.isCrushed) return;

    this.state.isCrushed = true;
    this.state.crushTimer = 0.45; // 0.45 秒受砸硬直
    this.consumeHp(20); // 扣除生命惩罚
    this.engine.camera?.triggerShake(14, 0.4);
    this.engine.audio.playCrushHit();
    this.engine.addFloatingText(
      this.state.x + TILE_SIZE / 2,
      this.state.y - 12,
      '-20 💔 被砸伤!',
      '#ff1744',
      22
    );
  }

  private moveTo(nx: number, ny: number): void {
    this.state.gridX = nx;
    this.state.gridY = ny;
    this.state.targetX = nx * TILE_SIZE;
    this.state.targetY = ny * TILE_SIZE;

    // 深度更新（宽屏现代化标准换算：1 行 = 1 米，第 2 行地面为 0m）
    const absoluteRow = ny + this.engine.scrolledRows;
    this.state.depth = Math.max(0, absoluteRow - 2);

    // 通关判断：到达目标行如果碰到宝箱
    if (this.targetRow > 0 && absoluteRow >= this.targetRow && !this.state.won && !this.state.dead) {
      const tile = this.engine.grid[ny]?.[nx];
      if (tile?.kind === SpecialType.GOAL) {
        this.collectGoalChest(nx, ny);
        return;
      }
    }

    // 无限深度模式动态追加新行并拓展摄像机视界
    if (this.targetRow <= 0 && ny >= this.engine.rows - 20) {
      this.engine.appendEndlessRows(30, this.stage);
    }
  }

  // 主动安全撤离回地面（保留收集到的所有 sessionCoins）
  public evacuate(): void {
    if (this.state.dead || this.state.won) return;
    this.state.won = true;
    this.onWin?.();
  }

  // ── 每帧更新（平滑插值 + 重力坠落 + 被砸硬直与脱困）──
  public update(dt: number): void {
    if (this.state.isDigging) {
      this.state.digAnimTimer -= dt;
      if (this.state.digAnimTimer <= 0) {
        this.state.isDigging = false;
      }
    }

    // 被砸受创与无敌复原状态更新
    if (this.state.isCrushed) {
      this.state.crushTimer -= dt;
      if (this.state.crushTimer <= 0) {
        this.state.isCrushed = false;
        this.state.isInvincible = true;
        this.state.invincibleTimer = 0.6; // 0.6 秒闪烁无敌保护期
        // 原版 aa() 机制：砸碎并清除玩家正上方直至头顶的整列方块，解救玩家脱困！
        this.engine.clearColumnAbovePlayer(this.state.gridX, this.state.gridY);
      }
    }

    if (this.state.isInvincible) {
      this.state.invincibleTimer -= dt;
      if (this.state.invincibleTimer <= 0) {
        this.state.isInvincible = false;
      }
    }

    // 平滑插值渲染坐标
    const t = 1 - Math.pow(this.moveSpeed, dt * 60);
    this.state.x += (this.state.targetX - this.state.x) * t;
    this.state.y += (this.state.targetY - this.state.y) * t;

    // 原版重力检查：脚下为空时自然坠落（受砸硬直期间由原版逻辑锁死位置）
    if (!this.state.isCrushed && !this.state.dead && !this.state.won) {
      this.fallCooldown -= dt;
      if (this.fallCooldown <= 0) {
        const belowY = this.state.gridY + 1;
        if (belowY < this.engine.rows) {
          const belowTile = this.engine.grid[belowY]?.[this.state.gridX];
          if (belowTile) {
            if (belowTile.kind === SpecialType.EMPTY) {
              this.moveTo(this.state.gridX, belowY);
              this.fallCooldown = 0.08;
            } else if (belowTile.kind === SpecialType.TREASURE || belowTile.kind === SpecialType.CRYSTAL) {
              // 原版 b.java:356：悬空坠落时，若脚下是宝藏或水晶，直接落入并拾取！
              this.collectTileItem(belowTile, this.state.gridX * TILE_SIZE + TILE_SIZE / 2, belowY * TILE_SIZE);
              this.engine.clearTile(this.state.gridX, belowY);
              this.moveTo(this.state.gridX, belowY);
              this.fallCooldown = 0.08;
            } else if (belowTile.kind === SpecialType.GOAL) {
              // 悬空直接落入最底部的通关宝箱！
              this.collectGoalChest(this.state.gridX, belowY);
              this.fallCooldown = 0.08;
            }
          }
        }
      }
    }
  }
}
