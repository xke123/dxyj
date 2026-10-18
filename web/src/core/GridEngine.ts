/**
 * GridEngine.ts — 原版《地心游记》核心网格引擎（现代宽屏版）
 *
 * 严格对标 b.java 的以下方法：
 *  - generateWorld()   ← F() 地图卷轴生成
 *  - floodFill()       ← s(i,j) 四向递归连通消除
 *  - hitRock()         ← c(i,j) 岩石耐久步进
 *  - updatePhysics()   ← ax() 预警+下落状态机
 *  - scrollDown()      ← F() 地图向上卷动（玩家下潜一行）
 */

import {
  COLS, ROWS, TILE_SIZE,
  TileColor, SpecialType,
  TILE_COLORS,
  type Tile, type TileKind, type FloatingText,
} from './Types';
import { ParticleSystem } from '../render/ParticleSystem';
import { SoundEffects } from '../audio/SoundEffects';
import { Camera } from '../render/Camera';

// 生成一行新地质内容（原版 F() 在 cl 增加时向 cc[26] 填充新行）
function generateRow(depth: number): Tile[] {
  const row: Tile[] = [];
  const colors = [TileColor.RED, TileColor.YELLOW, TileColor.BLUE, TileColor.GREEN];

  // 岩石出现率随深度增加
  const rockChance = 0.04 + depth * 0.0006;
  const rockMaxDur = Math.min(5, 1 + Math.floor(depth * 0.05));

  for (let c = 0; c < COLS; c++) {
    const prev = c > 0 ? row[c - 1] : null;

    // 8邻域互斥：避免岩石紧贴
    const hasAdjacentRock = prev && prev.kind === SpecialType.ROCK;

    if (!hasAdjacentRock && Math.random() < rockChance) {
      // 数字岩石
      const dur = Math.ceil(Math.random() * rockMaxDur);
      row.push(makeRock(dur));
    } else {
      // 彩色矿块，带邻接继承概率（左22%，上38%近似）
      let color: TileColor;
      const r = Math.random();
      if (prev && isColor(prev.kind) && r < 0.22) {
        color = prev.kind as TileColor;
      } else {
        color = colors[Math.floor(Math.random() * 4)];
      }
      row.push(makeColorTile(color));
    }
  }
  return row;
}

function isColor(k: TileKind): boolean {
  return k >= 0 && k <= 3;
}

function makeColorTile(kind: TileColor): Tile {
  return {
    kind, durability: 1, maxDurability: 1,
    shakeWarning: false, shakeTimer: 0,
    shakeVisualX: 0, shakeVisualY: 0,
    falling: false, fallYOffset: 0,
  };
}

function makeRock(dur: number): Tile {
  return {
    kind: SpecialType.ROCK, durability: dur, maxDurability: dur,
    shakeWarning: false, shakeTimer: 0,
    shakeVisualX: 0, shakeVisualY: 0,
    falling: false, fallYOffset: 0,
  };
}

function makeEmpty(): Tile {
  return {
    kind: SpecialType.EMPTY, durability: 0, maxDurability: 0,
    shakeWarning: false, shakeTimer: 0,
    shakeVisualX: 0, shakeVisualY: 0,
    falling: false, fallYOffset: 0,
  };
}

function makeTreasure(coins: number): Tile {
  return {
    kind: SpecialType.TREASURE, durability: 1, maxDurability: 1,
    shakeWarning: false, shakeTimer: 0,
    shakeVisualX: 0, shakeVisualY: 0,
    falling: false, fallYOffset: 0,
    coins,
  };
}

// ============================================================

export class GridEngine {
  public grid: Tile[][] = [];
  public floatingTexts: FloatingText[] = [];
  public particles: ParticleSystem;
  public audio: SoundEffects;
  public camera?: Camera;

  // 已挖掘的绝对行深度（用于计算真实深度）
  public scrolledRows: number = 0;

  private fallCooldown: number = 0;

  constructor(particles: ParticleSystem, audio: SoundEffects) {
    this.particles = particles;
    this.audio = audio;
    this.buildInitialWorld();
  }

  public setCamera(c: Camera) { this.camera = c; }

  // ── 初始地图构建 ──
  public buildInitialWorld(): void {
    this.grid = [];
    this.scrolledRows = 0;

    // 顶部4行空白（起始区域）
    for (let r = 0; r < 4; r++) {
      this.grid.push(Array.from({ length: COLS }, () => makeEmpty()));
    }

    // 地下内容（第4行起填充矿石）
    for (let r = 4; r < ROWS; r++) {
      const row = generateRow(r - 4);
      // 随机植入宝藏
      if (Math.random() < 0.08) {
        const col = Math.floor(Math.random() * COLS);
        const coins = [1000, 1000, 2000, 5000][Math.floor(Math.random() * 4)];
        row[col] = makeTreasure(coins);
      }
      this.grid.push(row);
    }
  }

  // ── 原版 F()：地图向上卷动一行（玩家下潜）──
  // 在原版中，cc[0..25] = cc[1..26]，然后 cc[26] 填新行
  // 在本版中，我们保持玩家在网格固定位置，视口跟随
  // 此方法在 Camera 更新后由外部调用
  public scrollWorldDown(): void {
    this.scrolledRows++;
    // 移除顶行，底部追加新行
    this.grid.shift();
    const depth = this.scrolledRows + ROWS;
    const newRow = generateRow(depth);
    // 随机植入宝藏
    if (Math.random() < 0.08) {
      const col = Math.floor(Math.random() * COLS);
      const coins = [1000, 1000, 2000, 5000][Math.floor(Math.random() * 4)];
      newRow[col] = makeTreasure(coins);
    }
    this.grid.push(newRow);
  }

  // ── 原版 s(i, j)：四向递归 Flood Fill 同色消除 ──
  // 任意规模触发，无最小集群门槛
  public floodFill(startC: number, startR: number): Array<{ c: number; r: number }> {
    const tile = this.grid[startR]?.[startC];
    if (!tile || !isColor(tile.kind)) return [];

    const targetKind = tile.kind;
    const visited: boolean[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
    const stack: Array<{ c: number; r: number }> = [{ c: startC, r: startR }];
    const cluster: Array<{ c: number; r: number }> = [];

    visited[startR][startC] = true;

    while (stack.length > 0) {
      const { c, r } = stack.pop()!;
      cluster.push({ c, r });

      const neighbors = [
        { c: c - 1, r }, { c: c + 1, r },
        { c, r: r - 1 }, { c, r: r + 1 },
      ];

      for (const n of neighbors) {
        if (n.c < 0 || n.c >= COLS || n.r < 0 || n.r >= ROWS) continue;
        if (visited[n.r][n.c]) continue;
        const nt = this.grid[n.r][n.c];
        if (nt && nt.kind === targetKind) {
          visited[n.r][n.c] = true;
          stack.push(n);
        }
      }
    }

    return cluster;
  }

  // ── 原版 c(i, j)：岩石耐久步进 ──
  // 返回是否被彻底击碎
  public hitRock(c: number, r: number): boolean {
    const tile = this.grid[r]?.[c];
    if (!tile || tile.kind !== SpecialType.ROCK) return false;

    tile.durability--;
    tile.shakeTimer = 0.18; // 受击颤动

    if (tile.durability <= 0) {
      // 岩石碎裂
      this.emitShatter(c, r, '#78909c', 10);
      this.grid[r][c] = makeEmpty();
      this.camera?.triggerShake(6, 0.18);
      this.audio.playDig();
      return true;
    }

    // 还没碎
    this.emitShatter(c, r, '#b0bec5', 4);
    this.camera?.triggerShake(3, 0.12);
    this.audio.playDig();
    this.addFloatingText(c * TILE_SIZE + TILE_SIZE / 2, r * TILE_SIZE, `${tile.durability}`, '#e0e0e0', 16);
    return false;
  }

  // ── 挖掘彩色方块（触发 Flood Fill）──
  public excavateColor(c: number, r: number): { coins: number; cluster: number } {
    const cluster = this.floodFill(c, r);
    if (cluster.length === 0) return { coins: 0, cluster: 0 };

    const tile = this.grid[r][c];
    const colorInfo = TILE_COLORS[tile.kind as number];

    // 消除所有连通方块
    for (const pos of cluster) {
      this.emitShatter(pos.c, pos.r, colorInfo.main, cluster.length > 4 ? 8 : 5);
      this.grid[pos.r][pos.c] = makeEmpty();
    }

    // 视觉反馈
    const shakePower = Math.min(10, 2 + cluster.length * 0.6);
    this.camera?.triggerShake(shakePower, 0.18);
    this.audio.playShatter(cluster.length);

    if (cluster.length >= 3) {
      this.addFloatingText(
        c * TILE_SIZE + TILE_SIZE / 2,
        r * TILE_SIZE - 10,
        cluster.length >= 8 ? `💥 ×${cluster.length}` : `×${cluster.length}`,
        cluster.length >= 8 ? '#ff6d00' : colorInfo.light,
        cluster.length >= 8 ? 22 : 16
      );
    }

    return { coins: 0, cluster: cluster.length };
  }

  // ── 宝藏拾取 ──
  public excavateTreasure(c: number, r: number): number {
    const tile = this.grid[r]?.[c];
    if (!tile || tile.kind !== SpecialType.TREASURE) return 0;

    const coins = tile.coins ?? 1000;
    this.grid[r][c] = makeEmpty();
    this.emitShatter(c, r, '#ffd700', 12);
    this.camera?.triggerShake(4, 0.15);
    this.audio.playRelicFound();
    this.addFloatingText(c * TILE_SIZE + TILE_SIZE / 2, r * TILE_SIZE - 10, `+${coins}`, '#ffd700', 20);
    return coins;
  }

  // ── 原版 ax()：物理状态机（重力下落） ──
  public updatePhysics(dt: number, playerX?: number, playerY?: number, onCrush?: () => void): void {
    const timeNow = performance.now();

    // ── 阶段1：扫描悬空方块，启动预警 ──
    // 简化版承重：只要下方是空的非最底行，就是悬空
    for (let r = ROWS - 2; r >= 0; r--) {
      for (let c = 0; c < COLS; c++) {
        const tile = this.grid[r][c];
        if (tile.kind === SpecialType.EMPTY) continue;
        if (tile.falling || tile.shakeWarning) continue;

        const below = this.grid[r + 1][c];
        if (below.kind === SpecialType.EMPTY) {
          // 启动预警（对应原版 ax() h 字段）
          tile.shakeWarning = true;
          tile.shakeTimer = 0.42;
        }
      }
    }

    // ── 阶段2：更新预警颤动 ──
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const tile = this.grid[r][c];
        if (tile.kind === SpecialType.EMPTY) continue;

        if (tile.shakeWarning) {
          tile.shakeTimer -= dt;
          // 左右高频颤动（对应原版 ax() 中的视觉偏移）
          tile.shakeVisualX = Math.sin(timeNow * 0.05 + c + r) > 0 ? 2.5 : -2.5;
          tile.shakeVisualY = Math.cos(timeNow * 0.07 + c) > 0 ? 0.8 : -0.8;

          if (tile.shakeTimer <= 0) {
            tile.shakeWarning = false;
            tile.shakeVisualX = 0;
            tile.shakeVisualY = 0;
            tile.falling = true;
          }
        } else {
          tile.shakeVisualX = 0;
          tile.shakeVisualY = 0;
        }

        // 平滑插值恢复 fallYOffset
        if (tile.fallYOffset < 0) {
          tile.fallYOffset = Math.min(0, tile.fallYOffset + 280 * dt);
        }
      }
    }

    // ── 阶段3：下落推进（每0.1s步进一格，对应原版 ax() 中4帧一格）──
    this.fallCooldown -= dt;
    if (this.fallCooldown <= 0) {
      this.fallCooldown = 0.1;

      for (let c = 0; c < COLS; c++) {
        for (let r = ROWS - 2; r >= 0; r--) {
          const tile = this.grid[r][c];
          if (tile.kind === SpecialType.EMPTY || !tile.falling) continue;

          const below = this.grid[r + 1][c];
          if (below.kind === SpecialType.EMPTY) {
            // 下落一格（对应原版 cc[i2+1][i3].a(cc[i2][i3])）
            tile.fallYOffset = -TILE_SIZE;
            this.grid[r + 1][c] = tile;
            this.grid[r][c] = makeEmpty();

            // 砸到玩家判定（对应原版 bL.x==r+1 && bL.c==c）
            if (playerX !== undefined && playerY !== undefined) {
              if (c === playerX && r + 1 === playerY) {
                onCrush?.();
              }
            }
          } else {
            // 落地停止（对应原版 a=false, d=true）
            tile.falling = false;
            tile.fallYOffset = 0;
          }
        }
      }
    }
  }

  // ── getTileColor（渲染用） ──
  public getTileColor(kind: TileKind): string {
    if (isColor(kind)) return TILE_COLORS[kind as number]?.main ?? '#888';
    if (kind === SpecialType.ROCK) return '#607d8b';
    if (kind === SpecialType.TREASURE) return '#ffd700';
    return 'transparent';
  }

  // ── 粒子与浮动文字辅助 ──
  private emitShatter(c: number, r: number, color: string, count: number): void {
    this.particles.emitBlockShatter(c * TILE_SIZE + TILE_SIZE / 2, r * TILE_SIZE + TILE_SIZE / 2, color, count);
  }

  public addFloatingText(x: number, y: number, text: string, color: string, size: number): void {
    this.floatingTexts.push({ x, y, text, color, size, alpha: 1, life: 1.2 });
  }

  public updateFloatingTexts(dt: number): void {
    for (const ft of this.floatingTexts) {
      ft.life -= dt;
      ft.y -= 28 * dt;
      ft.alpha = Math.max(0, ft.life / 1.2);
    }
    this.floatingTexts = this.floatingTexts.filter(ft => ft.life > 0);
  }
}
