/**
 * GridEngine.ts — 原版《地心游记》核心网格引擎（宝藏与水晶道具全功能版）
 *
 * 严格对标 b.java 的以下方法：
 *  - generateWorld()   ← F() 地图卷轴生成 + 宝藏水晶二阶投掷漏斗算法
 *  - floodFill()       ← s(i,j) 四向递归连通消除
 *  - hitRock()         ← c(i,j) 岩石耐久步进
 *  - updatePhysics()   ← ax() 预警+下落状态机
 *  - 8大功能水晶法术   ← s(color), R(), j(), at(), b(20)
 */

import {
  COLS, TILE_SIZE,
  TileColor, SpecialType, CrystalType, TreasureKind,
  TILE_COLORS, getStageTargetRow,
  type Tile, type TileKind, type FloatingText,
  type ActiveLaser, type ActiveShockwave,
  type StageInfo,
} from './Types';
import { ParticleSystem } from '../render/ParticleSystem';
import { SoundEffects } from '../audio/SoundEffects';
import { Camera } from '../render/Camera';

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

function makeCrystalTile(crystalType: CrystalType): Tile {
  return {
    kind: SpecialType.CRYSTAL, durability: 1, maxDurability: 1,
    shakeWarning: false, shakeTimer: 0,
    shakeVisualX: 0, shakeVisualY: 0,
    falling: false, fallYOffset: 0,
    crystalType,
  };
}

function makeTreasureTile(treasureKind: TreasureKind, coins: number): Tile {
  return {
    kind: SpecialType.TREASURE, durability: 1, maxDurability: 1,
    shakeWarning: false, shakeTimer: 0,
    shakeVisualX: 0, shakeVisualY: 0,
    falling: false, fallYOffset: 0,
    treasureKind,
    coins,
  };
}

function makeGoalChestTile(coins: number): Tile {
  return {
    kind: SpecialType.GOAL, durability: 9999, maxDurability: 9999,
    shakeWarning: false, shakeTimer: 0,
    shakeVisualX: 0, shakeVisualY: 0,
    falling: false, fallYOffset: 0,
    coins,
  };
}

function makeBedrockTile(): Tile {
  return {
    kind: SpecialType.BEDROCK, durability: 99999, maxDurability: 99999,
    shakeWarning: false, shakeTimer: 0,
    shakeVisualX: 0, shakeVisualY: 0,
    falling: false, fallYOffset: 0,
  };
}

// ── 生成一行新地质内容，并按照原版两阶段漏斗概率嵌入宝物 ──
function generateRow(depth: number): Tile[] {
  const row: Tile[] = [];
  const colors = [TileColor.RED, TileColor.YELLOW, TileColor.BLUE, TileColor.GREEN];

  // 岩石出现率随深度增加
  const rockChance = 0.04 + depth * 0.0006;
  const rockMaxDur = Math.min(5, 1 + Math.floor(depth * 0.05));

  for (let c = 0; c < COLS; c++) {
    const prev = c > 0 ? row[c - 1] : null;
    const hasAdjacentRock = prev && prev.kind === SpecialType.ROCK;

    if (!hasAdjacentRock && Math.random() < rockChance) {
      const dur = Math.ceil(Math.random() * rockMaxDur);
      row.push(makeRock(dur));
    } else {
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

  // ── 对标原版 b.java:2807-2828 宝藏与水晶嵌入算法 ──
  // 在 18 列宽屏中，每行投掷 2 次候选嵌入
  for (let roll = 0; roll < 2; roll++) {
    const bG = Math.floor(Math.random() * 8); // 0~7
    if ((bG & 1) === 0) { // 50% 基础概率进入掉落轮
      const iNextInt = Math.floor(Math.random() * 32) + 1; // 1 ~ 32
      const targetCol = Math.floor(Math.random() * COLS);

      if (iNextInt <= 3) {
        // 法术水晶 (9~16)
        let crystalId = Math.floor(Math.random() * 8); // 0~7 (CrystalType)
        // 原版抑制机制：能量蓝水晶二次投掷
        if (crystalId === CrystalType.ENERGY_BLUE) {
          crystalId = Math.floor(Math.random() * 8);
        }
        row[targetCol] = makeCrystalTile(crystalId as CrystalType);
      } else if (iNextInt === 5 || iNextInt === 6) {
        // 即时金币宝藏 (化石、古董、金块、钻石)
        const treasureRoll = Math.floor(Math.random() * 4);
        let kind: TreasureKind;
        let coins: number;
        switch (treasureRoll) {
          case 0: kind = TreasureKind.FOSSIL; coins = 1000; break;
          case 1: kind = TreasureKind.ANTIQUE; coins = 2000; break;
          case 2: kind = TreasureKind.GOLD_BAR; coins = 1000; break;
          default: kind = TreasureKind.DIAMOND; coins = 5000; break;
        }
        row[targetCol] = makeTreasureTile(kind, coins);
      } else if (iNextInt === 7) {
        // 即时能量水晶 (HP+20) 或能量蓝晶
        if (Math.random() < 0.6) {
          row[targetCol] = makeTreasureTile(TreasureKind.ENERGY_ORB, 0);
        } else {
          row[targetCol] = makeCrystalTile(CrystalType.ENERGY_BLUE);
        }
      }
    }
  }

  return row;
}

// ============================================================

export class GridEngine {
  public grid: Tile[][] = [];
  public floatingTexts: FloatingText[] = [];
  public particles: ParticleSystem;
  public audio: SoundEffects;
  public camera?: Camera;

  // 激光与地震特效
  public activeLasers: ActiveLaser[] = [];
  public activeShockwaves: ActiveShockwave[] = [];

  // 已挖掘的绝对行深度
  public scrolledRows: number = 0;

  constructor(particles: ParticleSystem, audio: SoundEffects) {
    this.particles = particles;
    this.audio = audio;
    this.buildInitialWorld();
  }

  public setCamera(c: Camera) { this.camera = c; }

  public get rows(): number {
    return this.grid.length;
  }

  // ── 初始地图构建（默认代理给 buildStageWorld）──
  public buildInitialWorld(): void {
    this.buildStageWorld();
  }

  // ── 按照关卡要求生成固定深度的地图与最底层的通关宝箱 ──
  public buildStageWorld(stage?: StageInfo): void {
    this.grid = [];
    this.scrolledRows = 0;
    this.activeLasers = [];
    this.activeShockwaves = [];

    const depthM = stage ? stage.depthM : 60;
    const prize = stage ? stage.prize : 5000;
    const targetRow = getStageTargetRow(depthM);

    // 1. 顶部 3 行空气（地表与起始安全区，机器人站在第 2 行 (COLS/2, 2)，深度为 0m）
    for (let r = 0; r < 3; r++) {
      this.grid.push(Array.from({ length: COLS }, () => makeEmpty()));
    }

    // 2. 地下开采层：从第 3 行一直生成到 targetRow - 1 行
    for (let r = 3; r < targetRow; r++) {
      this.grid.push(generateRow(r - 2));
    }

    // 3. 通关奖励宝箱层（放置在最底部的 targetRow 行，全列均为金碧辉煌的终关通关秘宝箱）
    const chestRow: Tile[] = [];
    for (let c = 0; c < COLS; c++) {
      chestRow.push(makeGoalChestTile(prize));
    }
    this.grid.push(chestRow);

    // 4. 底部坚不可摧的远古基岩层（支撑最底层宝箱与上方所有物理方块，界定地心极限）
    const bedrockRow: Tile[] = [];
    for (let c = 0; c < COLS; c++) {
      bedrockRow.push(makeBedrockTile());
    }
    this.grid.push(bedrockRow);
  }

  // ── 原版 F()：地图向上卷动一行（玩家下潜）──
  public scrollWorldDown(): void {
    this.scrolledRows++;
    this.grid.shift();
    const depth = this.scrolledRows + this.rows;
    this.grid.push(generateRow(depth));
  }

  // ── 原版 s(i, j)：四向递归 Flood Fill 同色消除 ──
  public floodFill(startC: number, startR: number): Array<{ c: number; r: number }> {
    const tile = this.grid[startR]?.[startC];
    if (!tile || !isColor(tile.kind)) return [];

    const targetKind = tile.kind;
    const visited: boolean[][] = Array.from({ length: this.rows }, () => Array(COLS).fill(false));
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
        if (n.c < 0 || n.c >= COLS || n.r < 0 || n.r >= this.rows) continue;
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
  public hitRock(c: number, r: number): boolean {
    const tile = this.grid[r]?.[c];
    if (!tile) return false;

    // 坚不可摧的远古基岩
    if (tile.kind === SpecialType.BEDROCK) {
      this.emitShatter(c, r, '#37474f', 4);
      this.camera?.triggerShake(3, 0.1);
      this.audio.playDig();
      this.addFloatingText(c * TILE_SIZE + TILE_SIZE / 2, r * TILE_SIZE, '⛔ 远古基岩', '#90a4ae', 16);
      return false;
    }

    if (tile.kind !== SpecialType.ROCK) return false;

    tile.durability--;
    tile.shakeTimer = 0.18;

    if (tile.durability <= 0) {
      this.emitShatter(c, r, '#78909c', 10);
      this.grid[r][c] = makeEmpty();
      this.camera?.triggerShake(6, 0.18);
      this.audio.playDig();
      return true;
    }

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

    for (const pos of cluster) {
      this.emitShatter(pos.c, pos.r, colorInfo.main, cluster.length > 4 ? 8 : 5);
      this.grid[pos.r][pos.c] = makeEmpty();
    }

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

  // ── 收集宝藏或水晶 ──
  public clearTile(c: number, r: number): void {
    if (this.grid[r]?.[c]) {
      this.grid[r][c] = makeEmpty();
    }
  }

  // ============================================================
  // 八大水晶法术技能实现（对标 b.java:528-595, 4353-4374）
  // ============================================================

  /**
   * 1~4. 红/黄/蓝/绿水晶：清屏指定颜色的所有矿块（对标原版 s(i2)）
   */
  public clearColorTiles(color: TileColor, centerR: number): number {
    let clearedCount = 0;
    const startR = Math.max(0, centerR - 6);
    const endR = Math.min(this.rows - 1, centerR + 12);
    const colorInfo = TILE_COLORS[color];

    for (let r = startR; r <= endR; r++) {
      for (let c = 0; c < COLS; c++) {
        if (this.grid[r][c].kind === color) {
          this.emitShatter(c, r, colorInfo.main, 6);
          this.grid[r][c] = makeEmpty();
          clearedCount++;
        }
      }
    }

    if (clearedCount > 0) {
      this.camera?.triggerShake(8, 0.25);
      this.audio.playShatter(clearedCount);
    }
    return clearedCount;
  }

  /**
   * 5. 黑色水晶：清屏当前视野内的所有数字岩石（对标原版 R()）
   */
  public clearRockTiles(centerR: number): number {
    let clearedCount = 0;
    const startR = Math.max(0, centerR - 6);
    const endR = Math.min(this.rows - 1, centerR + 12);

    for (let r = startR; r <= endR; r++) {
      for (let c = 0; c < COLS; c++) {
        if (this.grid[r][c].kind === SpecialType.ROCK) {
          this.emitShatter(c, r, '#78909c', 8);
          this.grid[r][c] = makeEmpty();
          clearedCount++;
        }
      }
    }

    if (clearedCount > 0) {
      this.camera?.triggerShake(12, 0.3);
      this.audio.playShatter(clearedCount);
    }
    return clearedCount;
  }

  /**
   * 6. 闪亮水晶：垂直向下强力激光贯穿14格深度（对标原版 j()）
   */
  public castLaser(col: number, playerR: number, range: number = 14): { col: number; startR: number; endR: number } {
    const startR = playerR + 1;
    const endR = Math.min(this.rows - 1, playerR + range);

    for (let r = startR; r <= endR; r++) {
      const tile = this.grid[r][col];
      if (tile.kind === SpecialType.GOAL || tile.kind === SpecialType.BEDROCK) break;

      if (tile.kind !== SpecialType.EMPTY) {
        this.emitShatter(col, r, '#00e5ff', 8);
        this.grid[r][col] = makeEmpty();
      }
    }

    // 记录激光视觉特效
    this.activeLasers.push({
      col,
      startR,
      endR,
      timer: 0.35,
      maxTimer: 0.35,
    });

    this.camera?.triggerShake(10, 0.25);
    this.audio.playLaser();
    return { col, startR, endR };
  }

  /**
   * 7. 震荡水晶：以玩家为中心触发全向大地震爆破（对标原版 at()）
   */
  public castEarthquake(playerC: number, playerR: number, radius: number = 3): number {
    let cleared = 0;
    const minR = Math.max(0, playerR - radius);
    const maxR = Math.min(this.rows - 1, playerR + radius);
    const minC = Math.max(0, playerC - radius);
    const maxC = Math.min(COLS - 1, playerC + radius);

    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        const tile = this.grid[r][c];
        if (tile.kind === SpecialType.EMPTY || tile.kind === SpecialType.GOAL || tile.kind === SpecialType.BEDROCK) continue;

        this.emitShatter(c, r, '#ff9100', 6);
        this.grid[r][c] = makeEmpty();
        cleared++;
      }
    }

    // 记录地震波特效
    this.activeShockwaves.push({
      x: playerC * TILE_SIZE + TILE_SIZE / 2,
      y: playerR * TILE_SIZE + TILE_SIZE / 2,
      radius: TILE_SIZE,
      maxRadius: (radius + 0.5) * TILE_SIZE,
      timer: 0.45,
      maxTimer: 0.45,
    });

    this.camera?.triggerShake(14, 0.35);
    this.audio.playExplosion();
    return cleared;
  }

  // ── 原版 aa()：受砸脱困保护机制（清除玩家所在列以及左右相邻列从顶部直至头顶的所有方块，解救脱困）──
  public clearColumnAbovePlayer(playerCol: number, playerRow: number): void {
    let cleared = false;
    const startC = Math.max(0, playerCol - 1);
    const endC = Math.min(COLS - 1, playerCol + 1);

    for (let c = startC; c <= endC; c++) {
      for (let r = 0; r <= playerRow; r++) {
        const tile = this.grid[r]?.[c];
        if (tile && tile.kind !== SpecialType.EMPTY && tile.kind !== SpecialType.GOAL && tile.kind !== SpecialType.BEDROCK) {
          const color = isColor(tile.kind)
            ? TILE_COLORS[tile.kind as number].main
            : (tile.kind === SpecialType.ROCK ? '#90a4ae' : '#ffd700');
          this.emitShatter(c, r, color, 8);
          this.grid[r][c] = makeEmpty();
          cleared = true;
        }
      }
    }
    if (cleared) {
      this.camera?.triggerShake(8, 0.2);
      this.audio.playCascadeRumble();
    }
  }

  // ── 原版 ax() + as()：物理状态机（结构支撑吸附、下落、接住宝藏与被砸惩罚脱困）──
  public updatePhysics(
    dt: number,
    playerX?: number,
    playerY?: number,
    onCrush?: () => void,
    onCollectItem?: (tile: Tile) => void
  ): void {
    const timeNow = performance.now();

    // 更新激光特效计时
    for (let i = this.activeLasers.length - 1; i >= 0; i--) {
      this.activeLasers[i].timer -= dt;
      if (this.activeLasers[i].timer <= 0) {
        this.activeLasers.splice(i, 1);
      }
    }

    // 更新地震冲击波特效
    for (let i = this.activeShockwaves.length - 1; i >= 0; i--) {
      const sw = this.activeShockwaves[i];
      sw.timer -= dt;
      const progress = 1 - (sw.timer / sw.maxTimer);
      sw.radius = TILE_SIZE + progress * (sw.maxRadius - TILE_SIZE);
      if (sw.timer <= 0) {
        this.activeShockwaves.splice(i, 1);
      }
    }

    // 阶段1：原版 as() 基底支撑与同色互锁吸附（Support & Adsorption Propagation）
    const supported: boolean[][] = Array.from({ length: this.rows }, () => Array(COLS).fill(false));
    const supportQueue: Array<{ c: number; r: number }> = [];

    // 最底行（基底层/终点层）默认具有不可撼动的地脉支撑
    for (let c = 0; c < COLS; c++) {
      const bTile = this.grid[this.rows - 1][c];
      if (bTile.kind !== SpecialType.EMPTY) {
        supported[this.rows - 1][c] = true;
        supportQueue.push({ c, r: this.rows - 1 });
      }
    }

    // 广度优先传播支撑：同色方块四向吸附连通，且坐在受支撑方块上方的任意方块均获支撑
    let qHead = 0;
    while (qHead < supportQueue.length) {
      const cur = supportQueue[qHead++];
      const curTile = this.grid[cur.r][cur.c];

      // 1. 同色方块四向吸附连通（原版 d(i2, i3) 中的同色互锁判定）
      if (isColor(curTile.kind)) {
        const neighbors = [
          { c: cur.c - 1, r: cur.r },
          { c: cur.c + 1, r: cur.r },
          { c: cur.c, r: cur.r - 1 },
          { c: cur.c, r: cur.r + 1 },
        ];
        for (const nb of neighbors) {
          if (nb.c >= 0 && nb.c < COLS && nb.r >= 0 && nb.r < this.rows) {
            if (!supported[nb.r][nb.c] && this.grid[nb.r][nb.c].kind === curTile.kind) {
              supported[nb.r][nb.c] = true;
              supportQueue.push(nb);
            }
          }
        }
      }

      // 2. 位于受支撑方块正上方的坚固方块，获得重力支撑（原版 as() 中的 cc[q[i5]-1] 判定）
      if (cur.r > 0) {
        const aboveR = cur.r - 1;
        const aboveTile = this.grid[aboveR][cur.c];
        if (aboveTile.kind !== SpecialType.EMPTY && !supported[aboveR][cur.c]) {
          supported[aboveR][cur.c] = true;
          supportQueue.push({ c: cur.c, r: aboveR });
        }
      }
    }

    // 阶段2：扫描失去支撑的悬空方块，启动/同步预警颤动
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < COLS; c++) {
        const tile = this.grid[r][c];
        if (tile.kind === SpecialType.EMPTY || tile.kind === SpecialType.GOAL || tile.kind === SpecialType.BEDROCK) continue;

        if (!supported[r][c]) {
          // 失去支撑：进入颤动预警
          if (!tile.falling && !tile.shakeWarning) {
            tile.shakeWarning = true;
            tile.shakeTimer = 0.38; // 预警抖动时长
          }
        } else {
          // 重新获得支撑（例如下方落稳），取消抖动
          if (tile.shakeWarning) {
            tile.shakeWarning = false;
            tile.shakeVisualX = 0;
            tile.shakeVisualY = 0;
          }
        }
      }
    }

    // 阶段3：更新预警颤动计时与插值
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < COLS; c++) {
        const tile = this.grid[r][c];
        if (tile.kind === SpecialType.EMPTY) continue;

        if (tile.shakeWarning) {
          tile.shakeTimer -= dt;
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

        if (tile.fallYOffset < 0) {
          tile.fallYOffset = Math.min(0, tile.fallYOffset + 320 * dt);
        }
      }
    }

    // 阶段4：原版 ax() 下落推进与砸击判定
    for (let r = this.rows - 2; r >= 0; r--) {
      for (let c = 0; c < COLS; c++) {
        const tile = this.grid[r][c];
        if (!tile.falling) continue;

        const belowR = r + 1;
        const belowTile = this.grid[belowR][c];

        // 1. 掉落物到达玩家所在格判定（原版 b.java:2309 与 2354）
        if (playerX !== undefined && playerY !== undefined && belowR === playerY && c === playerX) {
          // 原版 b.java:2309: 9 <= f < 23 为宝藏与水晶（绝对不砸伤玩家，而是被玩家直接“接住”拾取！）
          if (tile.kind === SpecialType.TREASURE || tile.kind === SpecialType.CRYSTAL) {
            onCollectItem?.(tile);
            this.grid[r][c] = makeEmpty();
            continue;
          }

          // 原版 b.java:2354: 0 <= f <= 8 为色块与岩石，坠落砸伤玩家！
          if (isColor(tile.kind) || tile.kind === SpecialType.ROCK) {
            onCrush?.();
            // 实体方块落地进入玩家身处的物理格（停止坠落并占据该格，清空上方旧格，绝不产生无限循环反复砸击）
            this.grid[belowR][c] = {
              ...tile,
              falling: false,
              shakeWarning: false,
              landed: true,
              fallYOffset: 0,
            };
            this.grid[r][c] = makeEmpty();
            continue;
          }
        }

        // 2. 下方为空白：继续下落 1 格
        if (belowTile.kind === SpecialType.EMPTY) {
          this.grid[belowR][c] = {
            ...tile,
            falling: true,
            shakeWarning: false,
            landed: false,
            fallYOffset: -TILE_SIZE,
          };
          this.grid[r][c] = makeEmpty();
        } else {
          // 3. 触底/落稳：停止下落，打上 landed 标记以触发同色消除判定
          tile.falling = false;
          tile.landed = true;
          tile.fallYOffset = 0;
          this.camera?.triggerShake(2.0, 0.08);
        }
      }
    }

    // 阶段5：原版 as() & l() 落地判定与连击同色消除 (Landing Chain Elimination)
    for (let r = this.rows - 1; r >= 0; r--) {
      for (let c = 0; c < COLS; c++) {
        const tile = this.grid[r][c];
        if (tile.landed && isColor(tile.kind)) {
          tile.landed = false;
          // 原版 b.java:763: if (this.bS > 3) 落地后若同色连通数 >= 4，则自动爆破消除！
          const cluster = this.floodFill(c, r);
          if (cluster.length >= 4) {
            const colorInfo = TILE_COLORS[tile.kind as number];
            for (const pos of cluster) {
              this.emitShatter(pos.c, pos.r, colorInfo.main, 7);
              this.grid[pos.r][pos.c] = makeEmpty();
            }
            this.camera?.triggerShake(Math.min(14, 4 + cluster.length * 0.8), 0.22);
            this.audio.playShatter(cluster.length);
            this.addFloatingText(
              c * TILE_SIZE + TILE_SIZE / 2,
              r * TILE_SIZE - 10,
              `⚡ 连击消除 ×${cluster.length}`,
              '#ffd700',
              22
            );
          }
        } else if (tile.landed) {
          tile.landed = false;
        }
      }
    }
  }

  public emitShatter(col: number, row: number, color: string, count = 8): void {
    const wx = col * TILE_SIZE + TILE_SIZE / 2;
    const wy = row * TILE_SIZE + TILE_SIZE / 2;
    this.particles.emitBlockShatter(wx, wy, color, count);
  }

  public addFloatingText(x: number, y: number, text: string, color: string, size = 18): void {
    this.floatingTexts.push({
      x, y, text, color, size,
      alpha: 1.0,
      life: 0.85,
    });
  }

  public updateFloatingTexts(dt: number): void {
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life -= dt;
      ft.y -= 38 * dt;
      ft.alpha = Math.max(0, ft.life / 0.85);
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }
}
