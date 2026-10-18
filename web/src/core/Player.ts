import {
  COLS,
  ROWS,
  TILE_SIZE,
  TileType,
  type Player,
  type RelicInfo,
} from './Types';
import { GridEngine } from './GridEngine';

export class PlayerController {
  public player: Player;
  private gridEngine: GridEngine;
  private moveSpeed: number = 0.28; // 平滑移动插值速度
  private fallCooldown: number = 0;

  constructor(gridEngine: GridEngine) {
    this.gridEngine = gridEngine;

    // 初始降落在第 3 行入口空洞上方
    const startCol = 8;
    const startRow = 2;

    this.player = {
      gridX: startCol,
      gridY: startRow,
      x: startCol * TILE_SIZE,
      y: startRow * TILE_SIZE,
      targetX: startCol * TILE_SIZE,
      targetY: startRow * TILE_SIZE,
      facing: 'down',
      stamina: 100,
      maxStamina: 100,
      depth: 0,
      isDigging: false,
      digAnimTimer: 0,
      comboCount: 0,
      inventory: [],
    };
  }

  // 移动与攀爬单格方块物理
  public tryMove(dirX: number, dirY: number): boolean {
    if (this.player.isDigging) return false;

    // 更新主角朝向
    if (dirX > 0) this.player.facing = 'right';
    else if (dirX < 0) this.player.facing = 'left';
    else if (dirY > 0) this.player.facing = 'down';
    else if (dirY < 0) this.player.facing = 'up';

    const targetGridX = this.player.gridX + dirX;
    const targetGridY = this.player.gridY + dirY;

    if (targetGridX < 0 || targetGridX >= COLS || targetGridY < 0 || targetGridY >= ROWS) {
      return false;
    }

    const targetTile = this.gridEngine.grid[targetGridY][targetGridX];

    // 情况 A：水平方向移动
    if (dirX !== 0 && dirY === 0) {
      // 1. 如果前方是平地（空位），直接走过去
      if (targetTile.type === TileType.EMPTY) {
        this.player.gridX = targetGridX;
        this.player.targetX = targetGridX * TILE_SIZE;
        this.updateDepth();
        return true;
      }

      // 2. 如果前方有 1 个方块阻挡，但该方块上方为空位，允许角色直接“跨步登顶”
      const aboveTargetY = targetGridY - 1;
      const aboveCurrentY = this.player.gridY - 1;
      if (aboveTargetY >= 0 && aboveCurrentY >= 0) {
        const aboveTargetTile = this.gridEngine.grid[aboveTargetY][targetGridX];
        const aboveCurrentTile = this.gridEngine.grid[aboveCurrentY][this.player.gridX];

        if (aboveTargetTile.type === TileType.EMPTY && aboveCurrentTile.type === TileType.EMPTY) {
          this.player.gridX = targetGridX;
          this.player.gridY = aboveTargetY;
          this.player.targetX = targetGridX * TILE_SIZE;
          this.player.targetY = aboveTargetY * TILE_SIZE;
          this.updateDepth();
          return true;
        }
      }

      // 3. 面对多层高墙时顺势横向挖掘
      return this.dig(targetGridX, targetGridY);
    }

    // 情况 B：向下移动
    if (dirY > 0) {
      if (targetTile.type === TileType.EMPTY) {
        this.player.gridY = targetGridY;
        this.player.targetY = targetGridY * TILE_SIZE;
        this.updateDepth();
        return true;
      }
      return this.dig(targetGridX, targetGridY);
    }

    // 情况 C：向上移动
    if (dirY < 0) {
      if (targetTile.type === TileType.EMPTY) {
        this.player.gridY = targetGridY;
        this.player.targetY = targetGridY * TILE_SIZE;
        this.updateDepth();
        return true;
      }
      return this.dig(targetGridX, targetGridY);
    }

    return false;
  }

  // 主动挖掘（面向的方向）
  public digFacing(): boolean {
    let targetX = this.player.gridX;
    let targetY = this.player.gridY;

    if (this.player.facing === 'left') targetX--;
    else if (this.player.facing === 'right') targetX++;
    else if (this.player.facing === 'down') targetY++;
    else if (this.player.facing === 'up') targetY--;

    return this.dig(targetX, targetY);
  }

  public dig(gridX: number, gridY: number): boolean {
    if (gridX < 0 || gridX >= COLS || gridY < 0 || gridY >= ROWS) return false;
    if (this.player.stamina <= 0) {
      this.gridEngine.addFloatingText(this.player.x, this.player.y, '体温过低，体力耗尽!', '#ff4444', 16);
      return false;
    }

    const targetTile = this.gridEngine.grid[gridY][gridX];
    if (targetTile.type === TileType.EMPTY) return false;

    // 触发挖掘动作
    this.player.isDigging = true;
    this.player.digAnimTimer = 0.16;
    this.player.stamina = Math.max(0, this.player.stamina - 1);

    const result = this.gridEngine.excavate(gridX, gridY, (relic: RelicInfo) => {
      this.collectRelic(relic);
    });

    if (result.success && result.combo > 1) {
      this.player.comboCount += result.combo;
      this.player.stamina = Math.min(
        this.player.maxStamina,
        this.player.stamina + Math.floor(result.combo * 0.5)
      );
    }

    return result.success;
  }

  public collectRelic(relic: RelicInfo): void {
    const existing = this.player.inventory.find(i => i.relic.id === relic.id);
    if (existing) {
      existing.count++;
    } else {
      this.player.inventory.push({
        relic,
        count: 1,
        discoveredAtDepth: Math.floor(this.player.depth),
      });
    }
  }

  /**
   * 对应原版 b.java:2354 落石砸伤机制（Crush Hazard）：
   * 对应原版 b.java:2354、b.java:332-355 与 b.java:812-840 aa() 落石砸伤自救机制：
   * 1. 扣减 10 点体能/体温 (对应原版 bL.a(7) + 3 次 bL.a(1))；
   * 2. 执行 aa() 解困爆破：以角色为中心的 3 列宽（col-1, col, col+1）并覆盖角色所在格及正上方 3x2 范围的落石瞬间震碎；
   * 3. 伴随碎石爆炸粒子、重响与镜头强震，彻底防止角色被活埋！
   */
  public onCrushedByRock(): void {
    this.player.stamina = Math.max(0, this.player.stamina - 10);
    this.gridEngine.triggerCrushBlast(this.player.gridX, this.player.gridY);
    this.gridEngine.addFloatingText(
      this.player.x + TILE_SIZE / 2,
      this.player.y - 12,
      '💥 遭落石砸伤! -10 体能 (震爆上方落石)',
      '#ff1744',
      17
    );
    this.updateDepth();
  }

  public update(dt: number): void {
    this.player.x += (this.player.targetX - this.player.x) * this.moveSpeed;
    this.player.y += (this.player.targetY - this.player.y) * this.moveSpeed;

    if (this.player.digAnimTimer > 0) {
      this.player.digAnimTimer -= dt;
      if (this.player.digAnimTimer <= 0) {
        this.player.isDigging = false;
      }
    }

    // 重力检测：主角稳稳站在脚下方块上
    this.fallCooldown -= dt;
    const belowY = this.player.gridY + 1;
    if (belowY < ROWS) {
      const belowTile = this.gridEngine.grid[belowY][this.player.gridX];
      if (belowTile.type === TileType.EMPTY && this.fallCooldown <= 0) {
        this.player.gridY = belowY;
        this.player.targetY = belowY * TILE_SIZE;
        this.fallCooldown = 0.08;
        this.updateDepth();
      }
    }
  }

  private updateDepth(): void {
    this.player.depth = Math.max(0, (this.player.gridY - 3) * 1.2);
  }
}
