// ===================================================================
// 原版《地心游记》核心数值 —— 现代宽屏适配版
// 原版: 8列×27行; 本版: 18列×80行（保留高清宽屏）
// ===================================================================

export const COLS = 18;
export const ROWS = 80;
export const TILE_SIZE = 44;

// 目标深度：挖到第多少行算通关（原版 bn）
export const TARGET_ROW = 60;

// ── 砖块类型（严格对应原版 b.java f.f 字段）──
export const TileColor = {
  RED:    0,  // 红色方块
  YELLOW: 1,  // 黄色方块
  BLUE:   2,  // 蓝色方块
  GREEN:  3,  // 绿色方块
} as const;

export type TileColor = typeof TileColor[keyof typeof TileColor];

// ── 8大核心主动功能水晶（对应原版 d.java p[0..7] 与 b.java i()）──
export const CrystalType = {
  RED:         0,  // 红色水晶: 击碎全屏红色方块
  YELLOW:      1,  // 黄色水晶: 击碎全屏黄色方块
  BLUE:        2,  // 蓝色水晶: 击碎全屏蓝色方块
  GREEN:       3,  // 绿色水晶: 击碎全屏绿色方块
  BLACK:       4,  // 黑色水晶: 击碎全屏数字岩石
  FLASH:       5,  // 闪亮水晶: 垂直向下发射强力激光贯穿开路
  EARTHQUAKE:  6,  // 震荡水晶: 周围大范围全向地震爆破
  ENERGY_BLUE: 7,  // 能量蓝水晶: 主动使用立即恢复 20 点生命
} as const;

export type CrystalType = typeof CrystalType[keyof typeof CrystalType];

export interface CrystalMeta {
  id: CrystalType;
  name: string;
  shortName: string;
  icon: string;
  desc: string;
  color: string;
  key: string;
  buyPrice: number;
  sellPrice: number;
}

export const CRYSTAL_METAS: Record<CrystalType, CrystalMeta> = {
  [CrystalType.RED]: {
    id: CrystalType.RED,
    name: '红色水晶',
    shortName: '红晶',
    icon: '🔴',
    desc: '粉碎全屏所有红色矿块',
    color: '#e53935',
    key: '1',
    buyPrice: 5000,
    sellPrice: 2000,
  },
  [CrystalType.YELLOW]: {
    id: CrystalType.YELLOW,
    name: '黄色水晶',
    shortName: '黄晶',
    icon: '🟡',
    desc: '粉碎全屏所有黄色矿块',
    color: '#fbc02d',
    key: '2',
    buyPrice: 5000,
    sellPrice: 2000,
  },
  [CrystalType.BLUE]: {
    id: CrystalType.BLUE,
    name: '蓝色水晶',
    shortName: '蓝晶',
    icon: '🔵',
    desc: '粉碎全屏所有蓝色矿块',
    color: '#1976d2',
    key: '3',
    buyPrice: 5000,
    sellPrice: 2000,
  },
  [CrystalType.GREEN]: {
    id: CrystalType.GREEN,
    name: '绿色水晶',
    shortName: '绿晶',
    icon: '🟢',
    desc: '粉碎全屏所有绿色矿块',
    color: '#388e3c',
    key: '4',
    buyPrice: 5000,
    sellPrice: 2000,
  },
  [CrystalType.BLACK]: {
    id: CrystalType.BLACK,
    name: '黑色水晶',
    shortName: '黑晶',
    icon: '⚫',
    desc: '粉碎全屏所有数字岩石',
    color: '#424242',
    key: '5',
    buyPrice: 6000,
    sellPrice: 3000,
  },
  [CrystalType.FLASH]: {
    id: CrystalType.FLASH,
    name: '闪亮水晶',
    shortName: '激光',
    icon: '⚡',
    desc: '正下方发射垂直贯穿激光开路',
    color: '#00e5ff',
    key: '6',
    buyPrice: 8000,
    sellPrice: 4000,
  },
  [CrystalType.EARTHQUAKE]: {
    id: CrystalType.EARTHQUAKE,
    name: '震荡水晶',
    shortName: '地震',
    icon: '💥',
    desc: '周围大范围全向地震爆破',
    color: '#ff9100',
    key: '7',
    buyPrice: 8000,
    sellPrice: 4000,
  },
  [CrystalType.ENERGY_BLUE]: {
    id: CrystalType.ENERGY_BLUE,
    name: '能量蓝晶',
    shortName: '能量',
    icon: '💙',
    desc: '立即恢复 20 点生命体力',
    color: '#00b0ff',
    key: '8',
    buyPrice: 15000,
    sellPrice: 8000,
  },
};

// ── 地底即时宝藏类型（对应原版 b.java:2449-2464 ID 17~21）──
export const TreasureKind = {
  ENERGY_ORB: 17, // 即时能量水晶 (触碰直接 HP+20)
  FOSSIL:     18, // 化石 (+1000 金币)
  ANTIQUE:    19, // 古董 (+2000 金币)
  GOLD_BAR:   20, // 金块 (+1000 金币)
  DIAMOND:    21, // 钻石 (+5000 金币)
} as const;

export type TreasureKind = typeof TreasureKind[keyof typeof TreasureKind];

// 特殊方块类型
export const SpecialType = {
  EMPTY:    -1,
  ROCK:      9,  // 数字岩石（耐久 1~5，原版 c 字段）
  CRYSTAL:  10,  // 可拾取法术水晶道具（存放 crystalType）
  TREASURE: 11,  // 即时宝藏（存放 treasureKind 与 coins）
  GOAL:     12,  // 目标深度层（终点）
} as const;

export type SpecialType = typeof SpecialType[keyof typeof SpecialType];

// Tile 联合类型
export type TileKind = TileColor | -1 | 9 | 10 | 11 | 12;

export interface Tile {
  kind: TileKind;        // 方块类型（对应原版 f.f）
  durability: number;    // 剩余耐久（原版 f.c，岩石专用）
  maxDurability: number;

  // 物理状态（对应原版 ax() 状态机）
  shakeWarning: boolean; // 预警颤抖阶段（原版 f.h）
  shakeTimer: number;    // 颤抖计时
  shakeVisualX: number;  // 渲染偏移
  shakeVisualY: number;
  falling: boolean;      // 正在下落（原版 f.a）
  fallYOffset: number;   // 像素级平滑下坠偏移

  // 水晶道具与宝藏扩展
  crystalType?: CrystalType;
  treasureKind?: TreasureKind;
  coins?: number;        // 宝藏价值（金币）
}

// ── 激光与地震视觉特效结构 ──
export interface ActiveLaser {
  col: number;
  startR: number;
  endR: number;
  timer: number;
  maxTimer: number;
}

export interface ActiveShockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  timer: number;
  maxTimer: number;
}

// ── 玩家状态（对应原版 e.java）──
export interface PlayerState {
  gridX: number;
  gridY: number;
  x: number;          // 渲染像素 X（平滑插值）
  y: number;          // 渲染像素 Y
  targetX: number;
  targetY: number;

  hp: number;         // 当前生命力（对应原版 e.I）
  maxHp: number;      // 最大生命力（对应原版 e.J，初始100）
  power: number;      // 钻头动力（对应原版 e.j，初始10）
  coins: number;      // 当前持有金币（对应原版 e.C）
  sessionCoins: number; // 本次下潜收集的金币（HP归零时清空）

  // 道具背包（对应原版 bL.M[8] 与 bL.j 背包上限）
  crystals: number[]; // 8种水晶的数量
  maxBackpack: number; // 背包最大容量（初始10）

  facing: 'left' | 'right' | 'up' | 'down';
  isDigging: boolean;
  digAnimTimer: number;

  // 游戏状态
  depth: number;       // 当前挖掘深度（米）
  targetDepth: number; // 本次目标深度（米）
  won: boolean;        // 是否通关
  dead: boolean;       // HP耗尽，正在传送回地面
}

// 浮动文字（得分/拾取提示）
export interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  size: number;
  alpha: number;
  life: number;
}

// ── 原版四色的真实颜色值 ──
export const TILE_COLORS: Record<number, { main: string; light: string; dark: string }> = {
  [TileColor.RED]:    { main: '#e53935', light: '#ff8a80', dark: '#b71c1c' },
  [TileColor.YELLOW]: { main: '#f9a825', light: '#ffdd57', dark: '#e65100' },
  [TileColor.BLUE]:   { main: '#1565c0', light: '#82b1ff', dark: '#0d47a1' },
  [TileColor.GREEN]:  { main: '#2e7d32', light: '#69f0ae', dark: '#1b5e20' },
};

// 岩石颜色（根据剩余耐久变化）
export const ROCK_COLORS: string[] = [
  '#455a64', // dur=1 快裂了（偏浅）
  '#546e7a', // dur=2
  '#607d8b', // dur=3（默认）
  '#78909c', // dur=4
  '#90a4ae', // dur=5（最硬）
];
