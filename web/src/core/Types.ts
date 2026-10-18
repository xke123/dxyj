export const COLS = 18;
export const ROWS = 80;
export const TILE_SIZE = 44;

// 现代宽屏高清网格下落二次自动消除的严格判定参数
export const CASCADE_MIN_CLUSTER = 8;
export const CASCADE_MIN_FALLING_TILES = 5;

export const TileType = {
  EMPTY: 0,
  // 基础地质矿块
  ICE_AZURE: 1,         // 极地纯冰（青蓝）
  FROST_JADE: 2,        // 霜玉冻土（翡翠绿）
  PERMAFROST_PURPLE: 3, // 紫幽晶岩（深紫）
  GEOTHERMAL_RUBY: 4,   // 地热赤矿（赤红）
  SOLAR_AMBER: 5,       // 日光金珀（金黄）

  // 障碍与耐久型方块
  HARD_ROCK: 6,         // 数字岩石（3段耐久，表面显示数字 3..2..1）
  ANCIENT_ALLOY: 7,     // 古代防爆合金壁（5段耐久，表面显示数字 5..4..1）

  // 宝藏与线索方块
  RELIC_CRATE: 8,       // 封冻遗物箱
  KEY_CHEST: 9,         // 机关密藏钥匣
} as const;

export type TileType = typeof TileType[keyof typeof TileType];

export interface RelicInfo {
  id: string;
  name: string;
  category: 'clue' | 'key' | 'treasure';
  description: string;
  icon: string;
  strata: string;
}

export interface Tile {
  type: TileType;
  durability: number;
  maxDurability: number;
  falling: boolean;
  justLanded: boolean;    // 是否刚刚下落着陆
  shakeWarning: boolean;  // 原版 h: 是否处于失稳即将下落的预警颤动状态
  shakeTimer: number;     // 原版 e: 预警计时器 (约 0.65s)
  shakeVisualX: number;   // 原版 a(fVar): 左右预警颤动像素偏移 (-3.5px ~ +3.5px)
  shakeVisualY: number;   // 纵向微弱拉伸与颤抖
  fallYOffset: number;    // 像素级平滑下落插值偏移 (-44px ~ 0px)
  fallY: number;          // 像素级下坠视觉插值
  fallVelocity: number;
  shakeTime: number;      // 受到探铲敲击时的单次震颤
  relic?: RelicInfo;
}

export interface Player {
  gridX: number;
  gridY: number;
  x: number;              // 平滑渲染像素坐标
  y: number;
  targetX: number;
  targetY: number;
  facing: 'left' | 'right' | 'up' | 'down';
  stamina: number;        // 体能/体温 (0-100)
  maxStamina: number;
  depth: number;          // 挖掘深度（米）
  isDigging: boolean;
  digAnimTimer: number;
  comboCount: number;     // 当前连锁连击数
  inventory: Array<{
    relic: RelicInfo;
    count: number;
    discoveredAtDepth: number;
  }>;
}

export interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  size: number;
  alpha: number;
  life: number;
}
