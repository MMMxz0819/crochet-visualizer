/**
 * 钩针类型系统
 * 定义项目中使用的所有核心数据类型
 */

// ============ 基础针法类型 ============

/** 基础针法类型枚举 */
export type StitchType =
  | "ch"     // 锁针 (Chain)
  | "sl"     // 引拔针 (Slip Stitch)
  | "sc"     // 短针 (Single Crochet)
  | "hdc"    // 中长针 (Half Double Crochet)
  | "dc"     // 长针 (Double Crochet)
  | "tr"     // 长长针 (Treble Crochet)
  | "dtr"    // 三卷长针 (Double Treble)
  | "inc-sc" // 短针加针
  | "inc-dc" // 长针加针
  | "dec-sc" // 短针减针
  | "dec-dc" // 长针减针
  | "skip"   // 空针
  | "space"  // 镂空
  | "shell"  // 贝壳针
  | "cluster"// 枣形针
  | "popcorn"// 爆米花针
  | "bobble" // 豆豆针
  | "puff"   // 泡芙针
  | "fp"     // 外钩针 (Front Post)
  | "bp";    // 内钩针 (Back Post)

/** 针法中文名称映射 */
export const STITCH_NAMES: Record<StitchType, string> = {
  ch: "锁针",
  sl: "引拔针",
  sc: "短针",
  hdc: "中长针",
  dc: "长针",
  tr: "长长针",
  dtr: "三卷长针",
  "inc-sc": "短针加针",
  "inc-dc": "长针加针",
  "dec-sc": "短针减针",
  "dec-dc": "长针减针",
  skip: "空针",
  space: "镂空",
  shell: "贝壳针",
  cluster: "枣形针",
  popcorn: "爆米花针",
  bobble: "豆豆针",
  puff: "泡芙针",
  fp: "外钩针",
  bp: "内钩针",
};

/** 针法符号映射 (用于显示) */
export const STITCH_SYMBOLS: Record<StitchType, string> = {
  ch: "○",
  sl: "•",
  sc: "×",
  hdc: "T",
  dc: "⅃",
  tr: "ト",
  dtr: "こ",
  "inc-sc": "V",
  "inc-dc": "V",
  "dec-sc": "∧",
  "dec-dc": "∧",
  skip: "□",
  space: "　",
  shell: "※",
  cluster: "☆",
  popcorn: "●",
  bobble: "○",
  puff: "◎",
  fp: "⊕",
  bp: "⊗",
};

/** 基础针法尺寸 (单位: mm) */
export const STITCH_DIMENSIONS: Record<StitchType, { width: number; height: number; depth: number }> = {
  ch: { width: 4, height: 2, depth: 2 },
  sl: { width: 4, height: 3, depth: 2 },
  sc: { width: 6, height: 6, depth: 3 },
  hdc: { width: 6, height: 8, depth: 3 },
  dc: { width: 6, height: 12, depth: 3 },
  tr: { width: 6, height: 16, depth: 3 },
  dtr: { width: 6, height: 20, depth: 3 },
  "inc-sc": { width: 8, height: 6, depth: 3 },
  "inc-dc": { width: 8, height: 12, depth: 3 },
  "dec-sc": { width: 4, height: 6, depth: 3 },
  "dec-dc": { width: 4, height: 12, depth: 3 },
  skip: { width: 6, height: 6, depth: 0 },
  space: { width: 6, height: 6, depth: 0 },
  shell: { width: 12, height: 6, depth: 3 },
  cluster: { width: 8, height: 6, depth: 3 },
  popcorn: { width: 8, height: 8, depth: 4 },
  bobble: { width: 6, height: 6, depth: 3 },
  puff: { width: 8, height: 8, depth: 4 },
  fp: { width: 6, height: 6, depth: 4 },
  bp: { width: 6, height: 6, depth: 4 },
};

// ============ 图解数据结构 ============

/** 图解单元格 */
export interface StitchCell {
  row: number;
  col: number;
  stitch: StitchType;
  color?: string;       // 毛线颜色 (hex)
  repeat?: number;       // 重复次数
  annotations?: string[];// 注释
  direction?: "left" | "right"; // 编织方向
}

/** 图解网格 */
export type StitchGrid = StitchCell[][];

/** 图解类型 */
export type PatternType = "SYMBOL" | "TEXT" | "MIXED";

/** 难度等级 */
export type Difficulty = "beginner" | "intermediate" | "advanced";

/** 图解元数据 */
export interface PatternMetadata {
  difficulty: Difficulty;
  category?: string;
  tags?: string[];
  estimatedTime?: number; // 分钟
  yarnAmount?: number;    // 克
  hookSize?: number;      // mm
  createdAt?: string;
  updatedAt?: string;
}

/** 线材信息 */
export interface YarnMaterial {
  color: string;
  brand?: string;
  weight?: string; // 型号如 DK, Worsted 等
  amount?: number; // 克
}

/** 图解数据 */
export interface Pattern {
  id: string;
  name: string;
  description?: string;
  type: PatternType;
  grid: StitchGrid;
  metadata: PatternMetadata;
  materials?: YarnMaterial[];
  authorId: string;
  isPublic: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

// ============ 3D 模型相关类型 ============

/** 3D 场景配置 */
export interface SceneConfig {
  backgroundColor: string;
  ambientLight: number;
  directionalLight: number;
  enableShadows: boolean;
  cameraPosition: [number, number, number];
}

/** 材质配置 */
export interface MaterialConfig {
  type: "cotton" | "wool" | "acrylic" | "silk" | "custom";
  color: string;
  roughness: number;
  metalness: number;
}

/** 3D 渲染选项 */
export interface RenderOptions {
  detailLevel: "low" | "medium" | "high";
  showGrid: boolean;
  autoRotate: boolean;
  material: MaterialConfig;
}

/** 3D 模型数据 */
export interface CrochetModelData {
  vertices: number;
  faces: number;
  geometry: any; // THREE.BufferGeometry
  materials: MaterialConfig[];
}

/** 针法 3D 模型 */
export interface Stitch3DModel {
  type: StitchType;
  geometry: any; // THREE.BufferGeometry
  defaultMaterial: MaterialConfig;
  connectionPoints: {
    top: [number, number, number];
    bottom: [number, number, number];
    left?: [number, number, number];
    right?: [number, number, number];
  };
  boundingBox: {
    min: [number, number, number];
    max: [number, number, number];
  };
}

// ============ 转换相关类型 ============

/** 转换状态 */
export type ConversionStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

/** 转换结果 */
export interface ConversionResult {
  pattern: Pattern;
  confidence: number;
  warnings: string[];
}

/** 转换任务 */
export interface ConversionTask {
  id: string;
  sourceImage: string;
  status: ConversionStatus;
  result?: ConversionResult;
  errorMessage?: string;
  userId: string;
  patternId?: string;
  createdAt: string;
  updatedAt: string;
}
