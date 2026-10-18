import {
  COLS,
  ROWS,
  CASCADE_MIN_CLUSTER,
  CASCADE_MIN_FALLING_TILES,
  TileType,
  type Tile,
  type RelicInfo,
  type FloatingText,
} from './Types';
import { ParticleSystem } from '../render/ParticleSystem';
import { SoundEffects } from '../audio/SoundEffects';
import { Camera } from '../render/Camera';

export class GridEngine {
  public grid: Tile[][] = [];
  public particles: ParticleSystem;
  public audio: SoundEffects;
  public camera?: Camera;
  public floatingTexts: FloatingText[] = [];

  // 下落状态机管理
  private hasFallingBlocks: boolean = false;
  private fallCooldown: number = 0;
  private cascadeChain: number = 1;
  private newlyLandedCoords: Array<{ c: number; r: number }> = [];

  constructor(particles: ParticleSystem, audio: SoundEffects) {
    this.particles = particles;
    this.audio = audio;
    this.generateAuthenticWorld();
  }

  public setCamera(camera: Camera): void {
    this.camera = camera;
  }

  // 预设的出土线索物证库与钥匙
  private cluesDatabase: RelicInfo[] = [
    {
      id: 'clue_tile',
      name: '龙纹琉璃瓦残片',
      category: 'clue',
      description: '烧结精良的孔雀蓝琉璃碎瓦，带有残缺的五爪龙纹，证实此处地下深埋着旧时代最高规格的皇家宫殿！',
      icon: '🏛️',
      strata: '浅表冻土层',
    },
    {
      id: 'clue_coin',
      name: '开元通宝古铜钱',
      category: 'clue',
      description: '带有厚重铜绿的方孔圆钱，字迹端庄，见证了千万年前此地的盛世繁华与贸易枢纽地位。',
      icon: '🪙',
      strata: '古都废墟层',
    },
    {
      id: 'clue_stone',
      name: '御道汉白玉螭首残件',
      category: 'clue',
      description: '皇家大殿御道两侧的排水螭首，雕工鬼斧神工，推测地宫主墓道就在正下方！',
      icon: '🗿',
      strata: '中层地宫夯土',
    },
    {
      id: 'key_1',
      name: '青铜错金虎符【钥匙 Ⅰ】',
      category: 'key',
      description: '第一道地下青铜断龙闸的身份信物，可解开 25 米深度的密封防线。',
      icon: '🗝️',
      strata: '25米青铜门',
    },
    {
      id: 'key_2',
      name: '墨家精钢机括【钥匙 Ⅱ】',
      category: 'key',
      description: '补全 50 米深度千斤闸核心链条的精巧机关盒，可重启重力配重滑轨。',
      icon: '⚙️',
      strata: '50米千斤闸',
    },
    {
      id: 'key_3',
      name: '玄光和氏璧环【钥匙 Ⅲ】',
      category: 'key',
      description: '解开地心终极秘宝室防护光罩的古老玉璧，其温润光晕可破除万年坚冰。',
      icon: '💠',
      strata: '75米秘宝殿',
    },
    {
      id: 'grand_treasure',
      name: '【始源传国玉玺】大秘宝',
      category: 'treasure',
      description: '华夏文明传承的核心重器，受命于天，既寿永昌！起出可点燃第一道【传承之光】！',
      icon: '👑',
      strata: '80米地核祭坛',
    },
  ];

  public isMultiHit(type: TileType): boolean {
    return type === TileType.HARD_ROCK || type === TileType.ANCIENT_ALLOY;
  }

  public hasAdjacentMultiHit(r: number, c: number): boolean {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
          if (this.isMultiHit(this.grid[nr][nc].type)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  public generateAuthenticWorld(): void {
    this.grid = [];

    for (let r = 0; r < ROWS; r++) {
      this.grid[r] = [];
      for (let c = 0; c < COLS; c++) {
        this.grid[r][c] = this.createEmptyTile();
      }
    }

    // 地表第 3 行平整地面
    for (let c = 0; c < COLS; c++) {
      if (c === 8 || c === 9) {
        this.grid[3][c] = this.createEmptyTile();
      } else {
        this.grid[3][c] = this.createTile(TileType.ICE_AZURE);
      }
    }

    const colors = [
      TileType.ICE_AZURE,
      TileType.FROST_JADE,
      TileType.GEOTHERMAL_RUBY,
      TileType.SOLAR_AMBER,
    ];

    // 第一遍：4 种基础彩色矿石自然生成
    for (let r = 4; r < 75; r++) {
      for (let c = 0; c < COLS; c++) {
        let selectedColor: TileType;
        const leftTile = c > 0 ? this.grid[r][c - 1] : null;
        const topTile = r > 4 ? this.grid[r - 1][c] : null;

        const rand = Math.random();
        if (leftTile && leftTile.type >= TileType.ICE_AZURE && leftTile.type <= TileType.SOLAR_AMBER && rand < 0.22) {
          selectedColor = leftTile.type;
        } else if (topTile && topTile.type >= TileType.ICE_AZURE && topTile.type <= TileType.SOLAR_AMBER && rand < 0.38) {
          selectedColor = topTile.type;
        } else {
          selectedColor = colors[Math.floor(Math.random() * colors.length)];
        }

        this.grid[r][c] = this.createTile(selectedColor);
      }
    }

    // 第二遍：稀疏点缀【数字岩石】（3下），严格 8 邻域互斥
    for (let r = 5; r < 74; r++) {
      for (let c = 0; c < COLS; c++) {
        if (Math.random() < 0.04 && !this.hasAdjacentMultiHit(r, c)) {
          this.grid[r][c] = this.createTile(TileType.HARD_ROCK);
        }
      }
    }

    // 第三遍：深层点缀【古代合金壁】（5下），严格 8 邻域互斥
    for (let r = 35; r < 74; r++) {
      for (let c = 0; c < COLS; c++) {
        if (Math.random() < 0.018 && !this.hasAdjacentMultiHit(r, c)) {
          this.grid[r][c] = this.createTile(TileType.ANCIENT_ALLOY);
        }
      }
    }

    // 地核祭坛（75~79行）
    for (let r = 75; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (r === 77 && c === Math.floor(COLS / 2)) {
          const t = this.createTile(TileType.KEY_CHEST);
          t.relic = this.cluesDatabase.find(x => x.id === 'grand_treasure');
          this.grid[r][c] = t;
        } else if (r === 75 && (c === 5 || c === 8 || c === 12)) {
          this.grid[r][c] = this.createTile(TileType.ANCIENT_ALLOY);
        } else {
          this.grid[r][c] = this.createTile(TileType.GEOTHERMAL_RUBY);
        }
      }
    }

    // 埋设物证与钥匙
    this.plantRelic(10, 5, 'clue_tile', TileType.RELIC_CRATE);
    this.plantRelic(18, 12, 'clue_coin', TileType.RELIC_CRATE);
    this.plantRelic(26, 8, 'key_1', TileType.KEY_CHEST);
    this.plantRelic(36, 14, 'clue_stone', TileType.RELIC_CRATE);
    this.plantRelic(52, 9, 'key_2', TileType.KEY_CHEST);
    this.plantRelic(68, 6, 'key_3', TileType.KEY_CHEST);
  }

  private plantRelic(row: number, col: number, relicId: string, type: TileType): void {
    if (row < ROWS && col < COLS) {
      const relic = this.cluesDatabase.find(r => r.id === relicId);
      const tile = this.createTile(type);
      tile.relic = relic;
      this.grid[row][col] = tile;
    }
  }

  public createEmptyTile(): Tile {
    return {
      type: TileType.EMPTY,
      durability: 0,
      maxDurability: 0,
      falling: false,
      justLanded: false,
      shakeWarning: false,
      shakeTimer: 0,
      shakeVisualX: 0,
      shakeVisualY: 0,
      fallYOffset: 0,
      fallY: 0,
      fallVelocity: 0,
      shakeTime: 0,
    };
  }

  public createTile(type: TileType): Tile {
    let dur = 1;
    if (type === TileType.HARD_ROCK) dur = 3;
    if (type === TileType.ANCIENT_ALLOY) dur = 5;
    if (type === TileType.RELIC_CRATE || type === TileType.KEY_CHEST) dur = 2;

    return {
      type,
      durability: dur,
      maxDurability: dur,
      falling: false,
      justLanded: false,
      shakeWarning: false,
      shakeTimer: 0,
      shakeVisualX: 0,
      shakeVisualY: 0,
      fallYOffset: 0,
      fallY: 0,
      fallVelocity: 0,
      shakeTime: 0,
    };
  }

  public findConnected(startCol: number, startRow: number): Array<{ c: number; r: number }> {
    const targetTile = this.grid[startRow]?.[startCol];
    if (!targetTile || targetTile.type === TileType.EMPTY) return [];

    if (targetTile.type < TileType.ICE_AZURE || targetTile.type > TileType.SOLAR_AMBER) {
      return [{ c: startCol, r: startRow }];
    }

    const matchType = targetTile.type;
    const visited: boolean[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
    const queue: Array<{ c: number; r: number }> = [{ c: startCol, r: startRow }];
    const connected: Array<{ c: number; r: number }> = [];

    visited[startRow][startCol] = true;

    while (queue.length > 0) {
      const { c, r } = queue.shift()!;
      connected.push({ c, r });

      const neighbors = [
        { c: c + 1, r: r },
        { c: c - 1, r: r },
        { c: c, r: r + 1 },
        { c: c, r: r - 1 },
      ];

      for (const n of neighbors) {
        if (
          n.c >= 0 &&
          n.c < COLS &&
          n.r >= 0 &&
          n.r < ROWS &&
          !visited[n.r][n.c]
        ) {
          const neighborTile = this.grid[n.r][n.c];
          if (neighborTile && neighborTile.type === matchType) {
            visited[n.r][n.c] = true;
            queue.push(n);
          }
        }
      }
    }

    return connected;
  }

  public excavate(
    c: number,
    r: number,
    onRelicFound?: (relic: RelicInfo) => void
  ): { success: boolean; combo: number; hitRelic?: RelicInfo } {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return { success: false, combo: 0 };

    const tile = this.grid[r][c];
    if (tile.type === TileType.EMPTY) return { success: false, combo: 0 };

    // 敲击耐久型障碍
    if (
      tile.type === TileType.HARD_ROCK ||
      tile.type === TileType.ANCIENT_ALLOY ||
      tile.type === TileType.RELIC_CRATE ||
      tile.type === TileType.KEY_CHEST
    ) {
      tile.durability--;
      tile.shakeTime = 0.25;

      this.audio.playDig();
      this.camera?.triggerShake(3, 0.15);

      this.particles.emitBlockShatter(
        c * 44 + 22,
        r * 44 + 22,
        tile.type === TileType.HARD_ROCK ? '#78909c' : '#263238',
        8
      );

      if (tile.durability <= 0) {
        this.camera?.triggerShake(7, 0.2);
        const foundRelic = tile.relic;
        if (foundRelic) {
          this.audio.playRelicFound();
          this.particles.emitSparkle(c * 44 + 22, r * 44 + 22, '#ffcc00', 35);
          this.addFloatingText(c * 44 + 22, r * 44, `获得【${foundRelic.name}】!`, '#ffea70', 17);
          if (onRelicFound) onRelicFound(foundRelic);
        }
        this.grid[r][c] = this.createEmptyTile();
        return { success: true, combo: 1, hitRelic: foundRelic };
      }

      this.addFloatingText(
        c * 44 + 22,
        r * 44 + 10,
        `剩余耐久 ${tile.durability}/${tile.maxDurability}`,
        '#e0e0e0',
        13
      );
      return { success: true, combo: 0 };
    }

    // 基础矿石主动敲击消除
    const cluster = this.findConnected(c, r);
    const colorHex = this.getTileColor(tile.type);

    this.cascadeChain = 1;
    this.audio.playShatter(cluster.length);

    const shakePower = Math.min(12, 2 + cluster.length * 0.7);
    this.camera?.triggerShake(shakePower, 0.20);

    for (const pos of cluster) {
      this.particles.emitBlockShatter(
        pos.c * 44 + 22,
        pos.r * 44 + 22,
        colorHex,
        cluster.length > 5 ? 10 : 6
      );
      this.grid[pos.r][pos.c] = this.createEmptyTile();
    }

    if (cluster.length >= 4) {
      const isHuge = cluster.length >= 8;
      const text = isHuge ? `💥 巨石崩解 x${cluster.length}!` : `✨ 连通爆破 x${cluster.length}!`;
      this.addFloatingText(
        c * 44 + 22,
        r * 44,
        text,
        isHuge ? '#ff3d00' : '#ffd700',
        isHuge ? 20 : 15
      );
    }

    return { success: true, combo: cluster.length };
  }

  private canAdsorb(typeA: TileType, typeB: TileType): boolean {
    if (typeA === typeB) {
      return typeA >= TileType.ICE_AZURE && typeA <= TileType.SOLAR_AMBER;
    }
    if (typeA === TileType.HARD_ROCK && typeB === TileType.HARD_ROCK) {
      return true;
    }
    return false;
  }

  public computeAnchoredMatrix(): boolean[][] {
    const anchored: boolean[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
    const queue: Array<{ c: number; r: number }> = [];

    // 对齐原版 b.java:700，只有最底层（第 79 行地核基岩）是天然固定接地
    for (let c = 0; c < COLS; c++) {
      if (this.grid[ROWS - 1][c].type !== TileType.EMPTY) {
        anchored[ROWS - 1][c] = true;
        queue.push({ c, r: ROWS - 1 });
      }
    }

    while (queue.length > 0) {
      const { c, r } = queue.shift()!;
      const curTile = this.grid[r][c];

      // 垂直承重
      if (r > 0) {
        const topTile = this.grid[r - 1][c];
        if (topTile.type !== TileType.EMPTY && !anchored[r - 1][c]) {
          anchored[r - 1][c] = true;
          queue.push({ c, r: r - 1 });
        }
      }

      // 同色四向吸附
      const neighbors = [
        { c: c - 1, r },
        { c: c + 1, r },
        { c, r: r - 1 },
        { c, r: r + 1 },
      ];

      for (const n of neighbors) {
        if (n.c >= 0 && n.c < COLS && n.r >= 0 && n.r < ROWS) {
          const nTile = this.grid[n.r][n.c];
          if (
            nTile.type !== TileType.EMPTY &&
            !anchored[n.r][n.c] &&
            this.canAdsorb(curTile.type, nTile.type)
          ) {
            anchored[n.r][n.c] = true;
            queue.push(n);
          }
        }
      }
    }

    return anchored;
  }

  /**
   * 原版全套物理状态机更新：
   * 1. 结构吸附判定；
   * 2. 失稳同色集团统一进入 0.38s 的预警颤抖阶段（Telegraphing Shake，左右高频振动）；
   * 3. 预警结束后进入同步重力下落；
  /**
   * 寻找由所有相邻未固定（失稳）方块组成的整体刚体岛（包含纵向压在上面的不同色方块）
   * 确保整列悬空的岩层同步进入 0.65s 预警颤抖，避免下方先掉、上方无预警砸落的问题！
   */
  public findUnanchoredIsland(startCol: number, startRow: number, anchored: boolean[][]): Array<{ c: number; r: number }> {
    const visited: boolean[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
    const queue: Array<{ c: number; r: number }> = [{ c: startCol, r: startRow }];
    const island: Array<{ c: number; r: number }> = [];

    visited[startRow][startCol] = true;

    while (queue.length > 0) {
      const { c, r } = queue.shift()!;
      island.push({ c, r });

      const neighbors = [
        { c: c + 1, r },
        { c: c - 1, r },
        { c, r: r + 1 },
        { c, r: r - 1 },
      ];

      for (const n of neighbors) {
        if (
          n.c >= 0 &&
          n.c < COLS &&
          n.r >= 0 &&
          n.r < ROWS &&
          !visited[n.r][n.c]
        ) {
          const nTile = this.grid[n.r][n.c];
          // 只要是未接地的非空方块，都属于同一个连带失稳刚体！
          if (nTile.type !== TileType.EMPTY && !anchored[n.r][n.c]) {
            visited[n.r][n.c] = true;
            queue.push(n);
          }
        }
      }
    }

    return island;
  }

  /**
   * 原版全套物理状态机更新：
   * 1. 结构吸附判定；
   * 2. 整个失稳刚体群（包含整列上方叠放方块）同步启动 0.65s 预警震颤与碎屑粉尘；
   * 3. 预警结束后进入平滑重力自由落体；
   * 4. 落地冲击与二次消除严格判定；
   * 5. 落石砸中玩家（Crush Hazard）判定。
   */
  public updatePhysics(
    dt: number,
    playerX?: number,
    playerY?: number,
    onPlayerCrush?: (c: number, r: number) => void
  ): void {
    const anchored = this.computeAnchoredMatrix();
    const timeNow = performance.now();

    // 阶段 1：扫描所有失稳方块，整个失稳刚体群（包含整列上方叠放方块）同步启动 0.65s 预警震颤
    const visitedUnanchored: boolean[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(false));

    for (let r = 0; r < ROWS - 1; r++) {
      for (let c = 0; c < COLS; c++) {
        const tile = this.grid[r][c];
        if (tile.type !== TileType.EMPTY && !anchored[r][c] && !visitedUnanchored[r][c]) {
          // 找到整个失稳刚体岛（跨颜色连带失稳方块）
          const unanchoredIsland = this.findUnanchoredIsland(c, r, anchored);
          for (const pos of unanchoredIsland) {
            visitedUnanchored[pos.r][pos.c] = true;
          }

          // 如果该刚体群中尚无方块在下落或预警，统一步调启动 0.65s 强力预警颤抖！
          const anyFalling = unanchoredIsland.some(p => this.grid[p.r][p.c].falling);
          const anyWarning = unanchoredIsland.some(p => this.grid[p.r][p.c].shakeWarning);

          if (!anyFalling && !anyWarning) {
            for (const pos of unanchoredIsland) {
              const t = this.grid[pos.r][pos.c];
              t.shakeWarning = true;
              t.shakeTimer = 0.65; // 0.65s 充裕醒目的预警时间，留出充足闪避窗口
            }
          }
        }
      }
    }

    // 阶段 2：更新所有预警方块的剧烈高频颤动位移、碎屑粉尘与计时
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const tile = this.grid[r][c];
        if (tile.type !== TileType.EMPTY) {
          if (tile.shakeWarning) {
            tile.shakeTimer -= dt;
            // 显著加大幅度：左右 ±3.5px 高频振颤 + 纵向 ±1px 微抖
            tile.shakeVisualX = (Math.sin(timeNow * 0.06 + c * 3 + r * 7) > 0 ? 3.5 : -3.5);
            tile.shakeVisualY = (Math.cos(timeNow * 0.08 + c + r) > 0 ? 1.0 : -1.0);

            // 预警期间间歇性从方块底沿掉落石屑粉尘，极具沉浸感与危险提示
            if (Math.random() < 0.06) {
              const colorHex = this.getTileColor(tile.type);
              this.particles.emitDust(c * 44 + 22, (r + 1) * 44, colorHex);
            }

            if (tile.shakeTimer <= 0) {
              // 预警结束，正式转入自由落体状态！
              tile.shakeWarning = false;
              tile.shakeVisualX = 0;
              tile.shakeVisualY = 0;
              tile.falling = true;
              this.hasFallingBlocks = true;
            }
          } else {
            tile.shakeVisualX = 0;
            tile.shakeVisualY = 0;
          }

          // 平滑插值恢复下坠偏移 fallYOffset
          if (tile.fallYOffset && tile.fallYOffset < 0) {
            tile.fallYOffset = Math.min(0, tile.fallYOffset + 320 * dt);
          }
        }
      }
    }

    // 阶段 3：平滑节奏下落推进（下落间隔调整为 0.12s，配合平滑插值）
    this.fallCooldown -= dt;

    if (this.fallCooldown <= 0) {
      let anyMoved = false;

      for (let c = 0; c < COLS; c++) {
        for (let r = ROWS - 2; r >= 0; r--) {
          const tile = this.grid[r][c];
          if (tile.type !== TileType.EMPTY && !anchored[r][c] && tile.falling) {
            const belowTile = this.grid[r + 1][c];
            // 下方为空，平滑下落一格
            if (belowTile.type === TileType.EMPTY) {
              tile.fallYOffset = -44; // 从上一格位置平滑滑动下来
              this.grid[r + 1][c] = tile;
              this.grid[r][c] = this.createEmptyTile();
              anyMoved = true;

              // 阶段 4：落石砸中探险者检测 (Crush Hazard)
              if (
                playerX !== undefined &&
                playerY !== undefined &&
                c === playerX &&
                (r + 1) === playerY
              ) {
                if (onPlayerCrush) {
                  onPlayerCrush(c, r + 1);
                }
              }
            } else {
              // 碰到底部障碍停住，着陆完成！
              tile.falling = false;
              tile.justLanded = true;
              tile.fallYOffset = 0;
              this.newlyLandedCoords.push({ c, r });
            }
          }
        }
      }

      if (anyMoved) {
        this.hasFallingBlocks = true;
        this.fallCooldown = 0.12; // 0.12s 匀速平滑下坠步长
      } else {
        if (this.hasFallingBlocks) {
          this.hasFallingBlocks = false;
          this.checkNewlyLandedCascades();
        }
      }
    }

    // 更新受击方块敲击震颤计时
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (this.grid[r][c].shakeTime > 0) {
          this.grid[r][c].shakeTime = Math.max(0, this.grid[r][c].shakeTime - dt);
        }
      }
    }

    // 更新浮动文字
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y -= 25 * dt;
      ft.life -= dt;
      ft.alpha = Math.max(0, ft.life / 1.5);
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  private checkNewlyLandedCascades(): void {
    if (this.newlyLandedCoords.length === 0) return;

    const coordsToCheck = [...this.newlyLandedCoords];
    this.newlyLandedCoords = [];

    const visited: boolean[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
    let triggeredAnyCascade = false;

    const landedLookup = new Set(coordsToCheck.map(p => `${p.c},${p.r}`));

    for (const pos of coordsToCheck) {
      const tile = this.grid[pos.r]?.[pos.c];
      if (
        tile &&
        tile.type >= TileType.ICE_AZURE &&
        tile.type <= TileType.SOLAR_AMBER &&
        !visited[pos.r][pos.c]
      ) {
        const cluster = this.findConnected(pos.c, pos.r);
        for (const p of cluster) {
          visited[p.r][p.c] = true;
        }

        const landedInClusterCount = cluster.filter(p => landedLookup.has(`${p.c},${p.r}`)).length;

        if (cluster.length >= CASCADE_MIN_CLUSTER && landedInClusterCount >= CASCADE_MIN_FALLING_TILES) {
          triggeredAnyCascade = true;
          this.cascadeChain++;

          this.audio.playCascadeRumble();
          this.audio.playShatter(cluster.length + this.cascadeChain * 4);
          this.camera?.triggerShake(9 + Math.min(10, this.cascadeChain * 2), 0.25);

          const colorHex = this.getTileColor(tile.type);
          for (const p of cluster) {
            this.particles.emitBlockShatter(p.c * 44 + 22, p.r * 44 + 22, colorHex, 9);
            this.grid[p.r][p.c] = this.createEmptyTile();
          }

          this.addFloatingText(
            pos.c * 44 + 22,
            pos.r * 44,
            `⚡ 史诗级撞击 Combo x${this.cascadeChain} (${cluster.length}块)!`,
            '#ff9100',
            20
          );
        }
      }
    }

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        this.grid[r][c].justLanded = false;
      }
    }

    if (!triggeredAnyCascade) {
      this.cascadeChain = 1;
    }
  }

  /**
   * 对应原版 b.java:812-840 aa() 砸伤自救爆破机制：
   * 角色被落石砸中时，触发以角色为中心的 3 列宽（col-1, col, col+1）解困冲击波，
   * 炸碎角色所在格及正上方 3x2 / 3x3 范围的落石，并附带碎石粒子特效与强震！
   */
  public triggerCrushBlast(playerCol: number, playerRow: number): void {
    const minCol = Math.max(0, playerCol - 1);
    const maxCol = Math.min(COLS - 1, playerCol + 1);
    const minRow = Math.max(0, playerRow - 2);
    const maxRow = playerRow;

    this.audio.playCascadeRumble();
    this.audio.playShatter(6);
    this.camera?.triggerShake(12, 0.35);

    for (let c = minCol; c <= maxCol; c++) {
      for (let r = minRow; r <= maxRow; r++) {
        const tile = this.grid[r][c];
        // 炸碎落石与常规彩色矿石（避开未解锁的关键宝箱）
        if (
          tile.type !== TileType.EMPTY &&
          tile.type !== TileType.KEY_CHEST &&
          tile.type !== TileType.RELIC_CRATE
        ) {
          const colorHex = this.getTileColor(tile.type);
          this.particles.emitBlockShatter(c * 44 + 22, r * 44 + 22, colorHex, 8);
          this.grid[r][c] = this.createEmptyTile();
        }
      }
    }
  }

  public addFloatingText(x: number, y: number, text: string, color: string = '#ffffff', size: number = 14): void {
    this.floatingTexts.push({
      x,
      y,
      text,
      color,
      size,
      alpha: 1.0,
      life: 1.5,
    });
  }

  public getTileColor(type: TileType): string {
    switch (type) {
      case TileType.ICE_AZURE: return '#4fc3f7';
      case TileType.FROST_JADE: return '#26a69a';
      case TileType.PERMAFROST_PURPLE: return '#ab47bc';
      case TileType.GEOTHERMAL_RUBY: return '#ef5350';
      case TileType.SOLAR_AMBER: return '#ffa726';
      case TileType.HARD_ROCK: return '#78909c';
      case TileType.ANCIENT_ALLOY: return '#263238';
      case TileType.RELIC_CRATE: return '#ffd54f';
      case TileType.KEY_CHEST: return '#ff4081';
      default: return '#111111';
    }
  }
}
