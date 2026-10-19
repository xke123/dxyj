// ===================================================================
// 原版《地心游记》核心数值与全关卡体系 —— 现代宽屏完整版
// 原版: 8列×27行; 本版: 18列×80行（保留高清宽屏视野）
// ===================================================================

export const COLS = 18;
export const ROWS = 80;
export const TILE_SIZE = 44;

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
  GOAL:     12,  // 目标深度层通关宝箱（放置在最底层）
  BEDROCK:  13,  // 坚不可摧的底部基岩
} as const;

export type SpecialType = typeof SpecialType[keyof typeof SpecialType];

// Tile 联合类型
export type TileKind = TileColor | -1 | 9 | 10 | 11 | 12 | 13;

/**
 * 根据关卡目标深度 (m) 计算通关宝箱所在的行号
 * 玩家初始位置为 row = 2 (depth = 0m)
 * 每深入 1 行深度增加 2m：depth = (row - 2) * 2m
 */
export function getStageTargetRow(depthM: number): number {
  if (depthM <= 0) return 52;
  return 2 + Math.max(10, Math.round(depthM / 2));
}

export interface Tile {
  kind: TileKind;
  durability: number;
  maxDurability: number;

  shakeWarning: boolean;
  shakeTimer: number;
  shakeVisualX: number;
  shakeVisualY: number;
  falling: boolean;
  fallYOffset: number;

  crystalType?: CrystalType;
  treasureKind?: TreasureKind;
  coins?: number;
  landed?: boolean;
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
  x: number;
  y: number;
  targetX: number;
  targetY: number;

  hp: number;
  maxHp: number;
  power: number;
  coins: number;
  sessionCoins: number;

  crystals: number[];
  maxBackpack: number;

  facing: 'left' | 'right' | 'up' | 'down';
  isDigging: boolean;
  digAnimTimer: number;

  // 原版被砸受创与无敌复原状态（对标 b.java:332 bL.G 与 bL.l）
  isCrushed: boolean;
  crushTimer: number;
  isInvincible: boolean;
  invincibleTimer: number;

  depth: number;
  targetDepth: number;
  won: boolean;
  dead: boolean;
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
  '#455a64',
  '#546e7a',
  '#607d8b',
  '#78909c',
  '#90a4ae',
];

// ===================================================================
// 全球探险地图与 24 大关卡体系（对标原版 d.java:181-182 Q, o）
// ===================================================================

export type StageCategory = 'cup' | 'ruin' | 'special' | 'base';

export interface StageInfo {
  id: string;
  index: number;
  name: string;
  category: StageCategory;
  depthM: number;       // 目标深度（米，-1 为无限深度，0 为基地）
  prize: number;        // 通关奖金（金币）
  bonusItem?: number;   // 额外物品/加成
  desc: string;
  icon: string;
  isUnlockedDefault: boolean;
}

export const STAGE_LIST: StageInfo[] = [
  // ── 研发母港与常规训练 ──
  {
    id: 'stage_02', index: 2, name: '机器人研发基地', category: 'base',
    depthM: 0, prize: 0, desc: '商业母港：升级机体属性，买卖水晶道具',
    icon: '🏢', isUnlockedDefault: true
  },
  {
    id: 'stage_00', index: 0, name: '普通海域', category: 'special',
    depthM: 60, prize: 5000, desc: '浅海大陆架试验潜航区',
    icon: '🌊', isUnlockedDefault: true
  },
  {
    id: 'stage_01', index: 1, name: '普通陆地', category: 'special',
    depthM: 80, prize: 8000, desc: '近地表土壤层初级发掘训练',
    icon: '🏜️', isUnlockedDefault: true
  },

  // ── 10大深潜锦标赛（挑战金杯） ──
  {
    id: 'cup_03', index: 3, name: '新手杯挑战赛', category: 'cup',
    depthM: 100, prize: 15000, desc: '入坑基础关卡，夺取首座新手金杯',
    icon: '🥉', isUnlockedDefault: true
  },
  {
    id: 'cup_06', index: 6, name: '太平洋杯挑战赛', category: 'cup',
    depthM: 200, prize: 40000, desc: '太平洋底深层沉积地质挑战',
    icon: '🥈', isUnlockedDefault: true
  },
  {
    id: 'cup_04', index: 4, name: '勇者杯挑战赛', category: 'cup',
    depthM: 300, prize: 30000, desc: '进阶坚硬岩层考验，锤炼破岩技巧',
    icon: '⚔️', isUnlockedDefault: false
  },
  {
    id: 'cup_09', index: 9, name: '大西洋杯挑战赛', category: 'cup',
    depthM: 400, prize: 80000, desc: '大西洋深海裂谷岩层潜入',
    icon: '🌊', isUnlockedDefault: false
  },
  {
    id: 'cup_05', index: 5, name: '澳洲杯挑战赛', category: 'cup',
    depthM: 500, prize: 50000, desc: '澳洲古老坚硬地盾突破',
    icon: '🦘', isUnlockedDefault: false
  },
  {
    id: 'cup_11', index: 11, name: '海王杯挑战赛', category: 'cup',
    depthM: 600, prize: 120000, desc: '超深洋壳极限下潜，获取海王勋章',
    icon: '🔱', isUnlockedDefault: false
  },
  {
    id: 'cup_07', index: 7, name: '自由女神杯挑战赛', category: 'cup',
    depthM: 700, prize: 75000, desc: '北美大陆板块深潜探索',
    icon: '🗽', isUnlockedDefault: false
  },
  {
    id: 'cup_08', index: 8, name: '南美杯挑战赛', category: 'cup',
    depthM: 1000, prize: 100000, desc: '突破一公里地质深渊大关',
    icon: '🏔️', isUnlockedDefault: false
  },
  {
    id: 'cup_10', index: 10, name: '超级杯挑战赛', category: 'cup',
    depthM: 1200, prize: 125000, desc: '高温高压高密深地严苛考验',
    icon: '🔥', isUnlockedDefault: false
  },
  {
    id: 'cup_12', index: 12, name: '地心杯挑战赛', category: 'cup',
    depthM: 1500, prize: 150000, desc: '锦标挑战巅峰！争夺最高荣誉地心金杯',
    icon: '🏆', isUnlockedDefault: false
  },

  // ── 9大世界古代遗迹与世界秘境（单次发掘，重奖） ──
  {
    id: 'ruin_18', index: 18, name: '亚特兰蒂斯古城', category: 'ruin',
    depthM: 400, prize: 150000, bonusItem: 400, desc: '沉睡于深海的史前超文明古都',
    icon: '🏛️', isUnlockedDefault: false
  },
  {
    id: 'ruin_20', index: 20, name: '加勒比海海盗宝藏', category: 'ruin',
    depthM: 400, prize: 50000, bonusItem: 300, desc: '17世纪黄金舰队埋藏于珊瑚礁地底的秘密宝藏',
    icon: '🏴‍☠️', isUnlockedDefault: false
  },
  {
    id: 'ruin_21', index: 21, name: '红衣主教的宝藏', category: 'ruin',
    depthM: 400, prize: 50000, bonusItem: 300, desc: '欧洲中世纪教会秘藏的钻石黄金宝箱',
    icon: '👑', isUnlockedDefault: false
  },
  {
    id: 'ruin_23', index: 23, name: '所罗门的宝藏', category: 'ruin',
    depthM: 400, prize: 50000, bonusItem: 300, desc: '古所罗门王神殿深埋的黄金与智者水晶',
    icon: '🏺', isUnlockedDefault: false
  },
  {
    id: 'ruin_17', index: 17, name: '亚历山大大帝墓', category: 'ruin',
    depthM: 500, prize: 50000, bonusItem: 300, desc: '古代欧亚征服者的奢华石棺密室',
    icon: '🗡️', isUnlockedDefault: false
  },
  {
    id: 'ruin_19', index: 19, name: '成吉思汗墓', category: 'ruin',
    depthM: 500, prize: 50000, bonusItem: 300, desc: '大草原地下深处不见天日的黄金圣陵',
    icon: '🏹', isUnlockedDefault: false
  },
  {
    id: 'ruin_22', index: 22, name: '希特勒的宝藏', category: 'ruin',
    depthM: 500, prize: 60000, bonusItem: 400, desc: '二战阿尔卑斯山地下秘密掩体藏宝室',
    icon: '🗝️', isUnlockedDefault: false
  },
  {
    id: 'ruin_15', index: 15, name: '秦始皇陵', category: 'ruin',
    depthM: 600, prize: 100000, bonusItem: 500, desc: '水银江河与青铜地宫，中华千古一帝陵寝',
    icon: '🏮', isUnlockedDefault: false
  },
  {
    id: 'ruin_16', index: 16, name: '埃及地下古墓', category: 'ruin',
    depthM: 600, prize: 80000, bonusItem: 400, desc: '尼罗河西岸神秘金字塔下方地底暗室',
    icon: '⚱️', isUnlockedDefault: false
  },

  // ── 终极关卡与无限深度 ──
  {
    id: 'stage_14', index: 14, name: '地下大陆入口', category: 'special',
    depthM: 2500, prize: 200000, desc: '真正的凡尔纳地心世界大门！超深地质奇观',
    icon: '🌋', isUnlockedDefault: false
  },
  {
    id: 'stage_13', index: 13, name: '极限挑战, 无限深度', category: 'special',
    depthM: -1, prize: 0, desc: '无尽深渊潜航，考验机体极致续航与钻探记录',
    icon: '♾️', isUnlockedDefault: true
  },
];

// ===================================================================
// 机器人 20 阶升级矩阵数据（对标原版 d.java:183 F）
// 格式：[MaxHP, 背包容量, 升级花费]
// ===================================================================

export interface RobotUpgrade {
  level: number;
  maxHp: number;
  backpack: number;
  power: number;
  cost: number;
}

export const UPGRADE_MATRIX: RobotUpgrade[] = [
  { level: 1,  maxHp: 100, backpack: 10, power: 10, cost: 0 },
  { level: 2,  maxHp: 105, backpack: 11, power: 11, cost: 20000 },
  { level: 3,  maxHp: 110, backpack: 12, power: 12, cost: 30000 },
  { level: 4,  maxHp: 115, backpack: 13, power: 13, cost: 50000 },
  { level: 5,  maxHp: 120, backpack: 14, power: 14, cost: 50000 },
  { level: 6,  maxHp: 125, backpack: 15, power: 15, cost: 50000 },
  { level: 7,  maxHp: 130, backpack: 16, power: 16, cost: 100000 },
  { level: 8,  maxHp: 135, backpack: 17, power: 17, cost: 100000 },
  { level: 9,  maxHp: 140, backpack: 18, power: 18, cost: 100000 },
  { level: 10, maxHp: 145, backpack: 19, power: 19, cost: 150000 },
  { level: 11, maxHp: 150, backpack: 20, power: 20, cost: 150000 },
  { level: 12, maxHp: 155, backpack: 21, power: 21, cost: 150000 },
  { level: 13, maxHp: 160, backpack: 22, power: 22, cost: 200000 },
  { level: 14, maxHp: 165, backpack: 23, power: 23, cost: 200000 },
  { level: 15, maxHp: 170, backpack: 24, power: 24, cost: 200000 },
  { level: 16, maxHp: 175, backpack: 25, power: 25, cost: 300000 },
  { level: 17, maxHp: 180, backpack: 26, power: 26, cost: 300000 },
  { level: 18, maxHp: 185, backpack: 27, power: 27, cost: 500000 },
  { level: 19, maxHp: 190, backpack: 28, power: 28, cost: 700000 },
  { level: 20, maxHp: 200, backpack: 30, power: 30, cost: 1000000 },
];

// ===================================================================
// 本地存储存档结构（对标原版 RMS 记录系统）
// ===================================================================

export interface SaveData {
  coins: number;
  level: number;
  crystals: number[]; // 8种水晶
  completedStages: string[];
  endlessRecord: number;
}
