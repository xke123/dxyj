/**
 * Player.ts — 原版钻地机器人控制器
 *
 * 对标 e.java (机器人实体) + b.java W()/u() (按键挖掘逻辑):
 *  - HP (e.I) + MaxHP (e.J=100) + Power (e.j=10) + Coins (e.C)
 *  - 每次挖掘扣1点HP（原版每步扣能量）
 *  - HP=0 → 触发失败（传送回地面）
 *  - 移动只能到空格，挖掘才能穿过矿块
 *  - 重力：脚下空了自动下落
 */

import {
  COLS, ROWS, TILE_SIZE, SpecialType,
  type PlayerState,
} from './Types';
import { GridEngine } from './GridEngine';

export class PlayerController {
  public state: PlayerState;
  private engine: GridEngine;
  private moveSpeed = 0.25;   // 平滑插值速度
  private fallCooldown = 0;
  private onCoinCollect?: (coins: number) => void;
  private onDead?: () => void;
  private onWin?: () => void;

  // 目标行（到达此行通关，对应原版 bn）
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
    onWin: () => void
  ): void {
    this.onCoinCollect = onCoinCollect;
    this.onDead = onDead;
    this.onWin = onWin;
  }

  // ── 原版 u() 方向移动逻辑 ──
  public tryMove(dirX: number, dirY: number): boolean {
    if (this.state.isDigging || this.state.dead || this.state.won) return false;

    // 更新朝向（原版 y 字段）
    if (dirX > 0) this.state.facing = 'right';
    else if (dirX < 0) this.state.facing = 'left';
    else if (dirY > 0) this.state.facing = 'down';
    else if (dirY < 0) this.state.facing = 'up';

    const nx = this.state.gridX + dirX;
    const ny = this.state.gridY + dirY;

    if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) return false;

    const targetTile = this.engine.grid[ny]?.[nx];
    if (!targetTile) return false;

    if (targetTile.kind === SpecialType.EMPTY) {
      // 空格直接走过去
      this.moveTo(nx, ny);
      return true;
    }

    if (targetTile.kind === SpecialType.TREASURE) {
      // 拾取宝藏
      const coins = this.engine.excavateTreasure(nx, ny);
      this.state.sessionCoins += coins;
      this.state.coins += coins;
      this.onCoinCollect?.(coins);
      this.moveTo(nx, ny);
      return true;
    }

    // 有矿块，触发挖掘（不移动）
    return this.dig(nx, ny);
  }

  // ── 主动挖掘面向方向（5键/空格） ──
  public digFacing(): boolean {
    if (this.state.dead || this.state.won) return false;
    let tx = this.state.gridX;
    let ty = this.state.gridY;
    if (this.state.facing === 'left') tx--;
    else if (this.state.facing === 'right') tx++;
    else if (this.state.facing === 'down') ty++;
    else if (this.state.facing === 'up') ty--;
    return this.dig(tx, ty);
  }

  // ── 挖掘核心（对应原版 W() 按键处理 + s()/c()） ──
  public dig(gx: number, gy: number): boolean {
    if (gx < 0 || gx >= COLS || gy < 0 || gy >= ROWS) return false;

    const tile = this.engine.grid[gy]?.[gx];
    if (!tile || tile.kind === SpecialType.EMPTY) return false;

    // 扣HP（原版每次挖掘 bL.I--）
    this.consumeHp(1);

    // 挖掘动作动画
    this.state.isDigging = true;
    this.state.digAnimTimer = 0.14;

    if (tile.kind === SpecialType.ROCK) {
      // 数字岩石：步进耐久（原版 c(i,j)）
      this.engine.hitRock(gx, gy);
    } else if (tile.kind >= 0 && tile.kind <= 3) {
      // 彩色方块：Flood Fill 消除（原版 s(i,j)）
      this.engine.excavateColor(gx, gy);
    } else if (tile.kind === SpecialType.TREASURE) {
      const coins = this.engine.excavateTreasure(gx, gy);
      this.state.sessionCoins += coins;
      this.state.coins += coins;
      this.onCoinCollect?.(coins);
    }

    return true;
  }

  // ── 落石砸伤（对应原版 bL.G = true + aa() 自救） ──
  public onCrush(): void {
    this.consumeHp(10);  // 对应原版 bL.a(7) + 3×bL.a(1)
    this.engine.addFloatingText(
      this.state.x + TILE_SIZE / 2,
      this.state.y - 12,
      '💥 -10',
      '#ff1744',
      18
    );
    this.engine.camera?.triggerShake(8, 0.22);
  }

  // ── 移动到目标格 ──
  private moveTo(gx: number, gy: number): void {
    this.state.gridX = gx;
    this.state.gridY = gy;
    this.state.targetX = gx * TILE_SIZE;
    this.state.targetY = gy * TILE_SIZE;
    this.state.depth = Math.max(0, (gy + this.engine.scrolledRows - 4) * 2);
  }

  // ── HP 消耗，归零触发失败 ──
  private consumeHp(amount: number): void {
    this.state.hp = Math.max(0, this.state.hp - amount);
    if (this.state.hp <= 0 && !this.state.dead && !this.state.won) {
      this.state.dead = true;
      this.onDead?.();
    }
  }

  // ── 每帧更新 ──
  public update(dt: number): void {
    if (this.state.dead || this.state.won) return;

    // 平滑移动插值
    this.state.x += (this.state.targetX - this.state.x) * this.moveSpeed;
    this.state.y += (this.state.targetY - this.state.y) * this.moveSpeed;

    // 挖掘动画计时
    if (this.state.digAnimTimer > 0) {
      this.state.digAnimTimer -= dt;
      if (this.state.digAnimTimer <= 0) {
        this.state.isDigging = false;
      }
    }

    // 重力：脚下空了就下落（对应原版 bL.x++ 重力下落逻辑）
    this.fallCooldown -= dt;
    if (this.fallCooldown <= 0) {
      const belowY = this.state.gridY + 1;
      if (belowY < ROWS) {
        const below = this.engine.grid[belowY]?.[this.state.gridX];
        if (below && below.kind === SpecialType.EMPTY) {
          this.moveTo(this.state.gridX, belowY);
          this.fallCooldown = 0.06;
        }
      }
    }

    // 深度更新
    this.state.depth = Math.max(0, (this.state.gridY + this.engine.scrolledRows - 4) * 2);

    // 胜利判定：到达目标行
    if (this.state.gridY + this.engine.scrolledRows >= this.targetRow && !this.state.won) {
      this.state.won = true;
      this.onWin?.();
    }
  }
}
