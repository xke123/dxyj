// ===================================================================
// 原版《地心游记》核心数值 —— 现代宽屏适配版
// 原版: 8列×27行; 本版: 18列×80行（保留高清宽屏）
// ===================================================================

export const COLS = 18;
export const ROWS = 80;
export const TILE_SIZE = 44;

// 目标深度：挖到第多少行算通关（原版 bn）
// 标准关: 50行 ≈ 100M（每行约2M）
export const TARGET_ROW = 60;

// ── 砖块类型（严格对应原版 b.java f.f 字段）──
// 0~3: 四色基础矿块（红/黄/蓝/绿）
// 4~8: 数字岩石（耐久度 1~5，显示数字）
// -1 : 空格（EMPTY）
export const TileColor = {
  RED:    0,  // 红色方块
  YELLOW: 1,  // 黄色方块
  BLUE:   2,  // 蓝色方块
  GREEN:  3,  // 绿色方块
} as const;

export type TileColor = typeof TileColor[keyof typeof TileColor];

// 特殊类型（不参与 Flood Fill）
export const SpecialType = {
  EMPTY:     -1,
  ROCK:       9,  // 数字岩石（耐久 1~5，原版 c 字段）
  TREASURE:  10,  // 宝藏（出土得金币）
  GOAL:      11,  // 目标深度层（终点）
} as const;

export type SpecialType = typeof SpecialType[keyof typeof SpecialType];

// Tile 联合类型（颜色 0-3 或特殊 9/10/11/-1）
export type TileKind = TileColor | -1 | 9 | 10 | 11;

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

  // 宝藏信息
  coins?: number;        // 宝藏价值（金币）
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

  facing: 'left' | 'right' | 'up' | 'down';
  isDigging: boolean;
  digAnimTimer: number;

  // 游戏状态
  depth: number;       // 当前挖掘深度（米）
  targetDepth: number; // 本次目标深度（米）
  won: boolean;        // 是否通关
  dead: boolean;       // HP耗尽，正在传送回地面
}

// 浮动文字（得分提示）
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
