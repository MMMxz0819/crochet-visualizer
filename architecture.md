# 钩针图解可视化网站 - 架构文档

## 目录
1. [系统概述](#系统概述)
2. [技术架构](#技术架构)
3. [数据模型](#数据模型)
4. [核心模块设计](#核心模块设计)
5. [API设计](#api设计)
6. [前端架构](#前端架构)
7. [AI服务架构](#ai服务架构)
8. [部署架构](#部署架构)

---

## 系统概述

### 产品定位
一个专业的钩针图解可视化平台，帮助用户：
- 将抽象的文字/符号图解转换为直观的3D成品预览
- 通过照片反向生成可执行的图解
- 管理和分享自己的图解收藏

### 核心功能
| 功能模块 | 描述 | 目标用户 |
|---------|------|---------|
| 3D可视化 | 图解 → 3D模型 | 新手、熟手 |
| 图解识别 | 图片 → 图解 | 熟手 |
| 图解管理 | 上传、编辑、收藏 | 所有用户 |
| 针法字典 | 学习基础针法 | 新手 |

---

## 技术架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         客户端层                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Web App   │  │  移动端Web   │  │    桌面端(可选)      │  │
│  │  (Next.js)  │  │  (响应式)    │  │   (Electron)        │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
└─────────┼────────────────┼────────────────────┼─────────────┘
          │                │                    │
          └────────────────┴────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      API网关层                               │
│              Next.js App Router API                          │
│         (Rate Limiting, Auth, Validation)                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
┌─────────▼─────────┐ ┌────▼─────┐ ┌────────▼─────────┐
│   核心业务服务     │ │  文件存储 │ │   AI推理服务      │
│   (Next.js API)   │ │          │ │  (Python FastAPI) │
│                   │ │          │ │                   │
│ • Pattern CRUD    │ │ • 图解图片 │ │ • 符号识别       │
│ • 3D数据生成      │ │ • 用户上传 │ │ • 图像分割       │
│ • 用户管理        │ │ • 导出文件 │ │ • 图解重建       │
└─────────┬─────────┘ └────┬─────┘ └────────┬────────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                       数据层                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  PostgreSQL │  │    Redis    │  │    对象存储          │  │
│  │  (主数据库)  │  │  (缓存/队列) │  │  (AWS S3/MinIO)    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 技术栈选型

#### 前端
| 技术 | 用途 | 版本 |
|-----|------|-----|
| Next.js | React框架 | 14.x |
| React | UI库 | 18.x |
| TypeScript | 类型安全 | 5.x |
| Tailwind CSS | 样式系统 | 3.x |
| shadcn/ui | 组件库 | latest |
| Three.js | 3D渲染 | 0.160+ |
| React Three Fiber | React 3D绑定 | 8.x |
| Zustand | 状态管理 | 4.x |
| React Query | 服务端状态 | 5.x |

#### 后端
| 技术 | 用途 | 版本 |
|-----|------|-----|
| Next.js API | API路由 | 14.x |
| Prisma | ORM | 5.x |
| PostgreSQL | 主数据库 | 15+ |
| Redis | 缓存/队列 | 7.x |
| NextAuth.js | 认证 | 4.x |

#### AI服务
| 技术 | 用途 | 版本 |
|-----|------|-----|
| Python | 开发语言 | 3.11+ |
| FastAPI | Web框架 | 0.104+ |
| OpenCV | 图像处理 | 4.8+ |
| PyTorch | 深度学习 | 2.1+ |
| ONNX Runtime | 模型推理 | 1.16+ |

---

## 数据模型

### ERD 实体关系图

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │   Pattern   │       │   Category  │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │──┐    │ id (PK)     │   ┌───│ id (PK)     │
│ email       │  │    │ name        │   │   │ name        │
│ name        │  │    │ description │   │   │ description │
│ avatar      │  │    │ type        │   │   └─────────────┘
│ createdAt   │  │    │ grid        │   │
└─────────────┘  │    │ metadata    │   │
                 │    │ materials   │   │
                 │    │ categoryId  │───┘
                 │    │ authorId    │───┐
                 │    │ createdAt   │   │
                 │    │ updatedAt   │   │
                 │    └─────────────┘   │
                 │                        │
                 │    ┌─────────────┐     │
                 └───>│ PatternLike │<────┘
                      ├─────────────┤
                      │ id (PK)     │
                      │ userId (FK) │
                      │ patternId   │
                      │ createdAt   │
                      └─────────────┘

┌─────────────┐       ┌─────────────┐
│  StitchType │       │   Comment   │
├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │
│ code        │       │ content     │
│ name        │       │ patternId   │───┐
│ nameCn      │       │ authorId    │───┤
│ symbol      │       │ createdAt   │   │
│ description │       └─────────────┘   │
│ model3D     │                         │
└─────────────┘                         │
                                        │
┌─────────────┐                         │
│  Conversion │<────────────────────────┘
├─────────────┤
│ id (PK)     │
│ patternId   │
│ sourceImage │
│ status      │
│ result      │
│ confidence  │
│ createdAt   │
└─────────────┘
```

### Prisma Schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  patterns      Pattern[]
  likes         PatternLike[]
  comments      Comment[]
  conversions   Conversion[]
}

model Category {
  id          String   @id @default(cuid())
  name        String
  description String?
  icon        String?

  patterns    Pattern[]
}

model Pattern {
  id          String      @id @default(cuid())
  name        String
  description String?
  type        PatternType
  grid        Json        // StitchCell[][]
  metadata    Json        // PatternMetadata
  materials   Json?       // Materials

  categoryId  String?
  category    Category?   @relation(fields: [categoryId], references: [id])

  authorId    String
  author      User        @relation(fields: [authorId], references: [id])

  likes       PatternLike[]
  comments    Comment[]
  conversions Conversion[]

  isPublic    Boolean     @default(true)
  viewCount   Int         @default(0)

  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([authorId])
  @@index([categoryId])
}

model PatternLike {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  patternId String
  pattern   Pattern  @relation(fields: [patternId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, patternId])
  @@index([patternId])
}

model Comment {
  id        String   @id @default(cuid())
  content   String

  patternId String
  pattern   Pattern  @relation(fields: [patternId], references: [id], onDelete: Cascade)

  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([patternId])
}

model Conversion {
  id           String            @id @default(cuid())
  sourceImage  String
  status       ConversionStatus  @default(PENDING)
  result       Json?             // 识别结果
  confidence   Float?
  errorMessage String?

  userId       String
  user         User              @relation(fields: [userId], references: [id])

  patternId    String?
  pattern      Pattern?          @relation(fields: [patternId], references: [id])

  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt

  @@index([userId])
  @@index([status])
}

enum PatternType {
  SYMBOL    // 符号图解
  TEXT      // 文字图解
  MIXED     // 混合图解
}

enum ConversionStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}
```

---

## 核心模块设计

### 1. 3D可视化模块

#### 模块架构

```
┌────────────────────────────────────────────────────────────┐
│                    Crochet3DModule                         │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌─────────────────┐      ┌─────────────────────────────┐ │
│  │ PatternParser   │─────>│     StitchSequence          │ │
│  │                 │      │   (解析后的针法序列)           │ │
│  │ - 解析图解JSON   │      └──────────────┬──────────────┘ │
│  │ - 验证数据格式   │                     │                │
│  │ - 展开重复标记   │                     ▼                │
│  └─────────────────┘      ┌─────────────────────────────┐ │
│                           │   GeometryGenerator         │ │
│                           │                             │ │
│                           │  ┌───────────────────────┐  │ │
│                           │  │  StitchGeometryBuilder│  │ │
│                           │  │  - 生成针法几何体      │  │ │
│                           │  │  - 计算位置坐标        │  │ │
│                           │  │  - 处理针法连接        │  │ │
│                           │  └───────────────────────┘  │ │
│                           │                             │ │
│                           │  ┌───────────────────────┐  │ │
│                           │  │  MeshAssembler        │  │ │
│                           │  │  - 合并几何体         │  │ │
│                           │  │  - 优化顶点数据       │  │ │
│                           │  └───────────────────────┘  │ │
│                           └──────────────┬──────────────┘ │
│                                          │                │
│                                          ▼                │
│                           ┌─────────────────────────────┐ │
│                           │    MaterialApplier          │ │
│                           │    - 应用线材材质           │ │
│                           │    - 设置颜色              │ │
│                           │    - 调整纹理              │ │
│                           └──────────────┬──────────────┘ │
│                                          │                │
│                                          ▼                │
│                           ┌─────────────────────────────┐ │
│                           │    Crochet3DModel           │ │
│                           │    (最终3D模型数据)          │ │
│                           └─────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

#### 针法3D模型定义

```typescript
// types/crochet.ts

interface Stitch3DModel {
  type: StitchType;
  geometry: THREE.BufferGeometry;
  defaultMaterial: THREE.Material;
  connectionPoints: {
    top: THREE.Vector3;
    bottom: THREE.Vector3;
    left?: THREE.Vector3;
    right?: THREE.Vector3;
  };
  boundingBox: THREE.Box3;
}

// 基础针法尺寸定义 (单位: mm)
const STITCH_DIMENSIONS = {
  ch: { width: 4, height: 2, depth: 2 },   // 锁针
  sc: { width: 6, height: 6, depth: 3 },   // 短针
  hdc: { width: 6, height: 8, depth: 3 },  // 中长针
  dc: { width: 6, height: 12, depth: 3 },  // 长针
  tr: { width: 6, height: 16, depth: 3 },  // 长长针
} as const;
```

#### 渲染优化策略

| 优化技术 | 应用场景 | 实现方式 |
|---------|---------|---------|
| InstancedMesh | 重复针法渲染 | 相同几何体使用实例化渲染 |
| LOD | 复杂模型 | 根据距离切换模型精度 |
| Frustum Culling | 大图解 | 只渲染视锥体内的对象 |
| Geometry Merging | 静态部分 | 合并相邻的相同材质网格 |
| Texture Atlas | 材质贴图 | 合并纹理减少Draw Call |

### 2. 图解编辑器模块

#### 组件架构

```
┌─────────────────────────────────────────────────────────────┐
│                   PatternEditor                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌─────────────────────────────────────┐  │
│  │  Toolbar     │  │         EditorCanvas                │  │
│  │              │  │                                     │  │
│  │ - Undo/Redo  │  │  ┌───────────────────────────────┐  │  │
│  │ - Zoom       │  │  │      PatternGrid              │  │  │
│  │ - Grid toggle│  │  │                               │  │  │
│  │ - Export     │  │  │  ┌─────┬─────┬─────┬─────┐   │  │  │
│  └──────────────┘  │  │  │  sc │  dc │ inc │ sc  │   │  │  │
│                    │  │  ├─────┼─────┼─────┼─────┤   │  │  │
│  ┌──────────────┐  │  │  │  ch │  ch │  ch │  ch │   │  │  │
│  │  SymbolPanel │  │  │  ├─────┼─────┼─────┼─────┤   │  │  │
│  │              │  │  │  │     │     │     │     │   │  │  │
│  │ ┌────────┐   │  │  │  └─────┴─────┴─────┴─────┘   │  │  │
│  │ │  sc    │   │  │  │                               │  │  │
│  │ │ 图标   │   │  │  └───────────────────────────────┘  │  │
│  │ └────────┘   │  │                                     │  │
│  │ ┌────────┐   │  │  - 支持拖拽放置                      │  │
│  │ │  dc    │   │  │  - 右键菜单                          │  │
│  │ │ 图标   │   │  │  - 多选操作                          │  │
│  │ └────────┘   │  │  - 键盘快捷键                        │  │
│  │     ...      │  │                                     │  │
│  └──────────────┘  └─────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  PropertiesPanel                                        ││
│  │  - 当前单元格属性                                        ││
│  │  - 颜色选择器                                           ││
│  │  - 重复次数设置                                          ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### 3. 图解识别模块

#### AI Pipeline架构

```
┌─────────────────────────────────────────────────────────────┐
│              Pattern Recognition Pipeline                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Input: 图解图片 (JPG/PNG/PDF)                               │
│                            │                                │
│                            ▼                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Stage 1: Preprocessing                             │   │
│  │  - Image loading                                     │   │
│  │  - Grayscale conversion                              │   │
│  │  - Noise reduction (Gaussian blur)                   │   │
│  │  - Binarization (Adaptive threshold)                 │   │
│  │  - Deskew correction                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                │
│                            ▼                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Stage 2: Grid Detection                            │   │
│  │  - Line detection (Hough Transform)                  │   │
│  │  - Grid intersection finding                         │   │
│  │  - Cell segmentation                                 │   │
│  │  - Grid structure validation                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                │
│                            ▼                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Stage 3: Symbol Extraction                         │   │
│  │  - Cell image cropping                               │   │
│  │  - Symbol isolation                                  │   │
│  │  - Size normalization                                │   │
│  │  - Augmentation (rotation, scaling)                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                │
│                            ▼                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Stage 4: Symbol Classification                     │   │
│  │  - CNN Model Inference                               │   │
│  │    Input: 64x64 grayscale                            │   │
│  │    Model: ResNet18/Custom CNN                        │   │
│  │    Output: Symbol class + confidence                 │   │
│  │  - Post-processing (NMS, voting)                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                │
│                            ▼                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Stage 5: Pattern Reconstruction                    │   │
│  │  - Grid data structure building                      │   │
│  │  - Text annotation extraction (OCR)                  │   │
│  │  - Pattern validation                                │   │
│  │  - Metadata inference                                │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                │
│                            ▼                                │
│  Output: Structured Pattern JSON                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 符号分类模型

```python
# python-service/models/symbol_classifier.py

import torch
import torch.nn as nn

class StitchSymbolCNN(nn.Module):
    """钩针符号分类CNN模型"""

    def __init__(self, num_classes: int = 20):
        super().__init__()

        # 卷积层
        self.features = nn.Sequential(
            # Block 1
            nn.Conv2d(1, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.Conv2d(32, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),
            nn.Dropout2d(0.25),

            # Block 2
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.Conv2d(64, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),
            nn.Dropout2d(0.25),

            # Block 3
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.Conv2d(128, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),
            nn.Dropout2d(0.25),
        )

        # 全连接层
        self.classifier = nn.Sequential(
            nn.Linear(128 * 8 * 8, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5),
            nn.Linear(512, num_classes)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.features(x)
        x = x.view(x.size(0), -1)
        x = self.classifier(x)
        return x

# 符号类别定义
STITCH_CLASSES = [
    'ch',      # 锁针
    'sl',      # 引拔针
    'sc',      # 短针
    'hdc',     # 中长针
    'dc',      # 长针
    'tr',      # 长长针
    'dtr',     # 三卷长针
    'inc-sc',  # 短针加针
    'inc-dc',  # 长针加针
    'dec-sc',  # 短针减针
    'dec-dc',  # 长针减针
    'skip',    # 空针
    'space',   # 镂空
    'shell',   # 贝壳针
    'cluster', # 枣形针
    'popcorn', # 爆米花针
    'bobble',  # 豆豆针
    'puff',    # 泡芙针
    'fp',      # 外钩针
    'bp',      # 内钩针
]
```

---

## API设计

### RESTful API规范

#### 1. 图解管理API

```yaml
# 图解CRUD
GET    /api/patterns              # 获取图解列表
POST   /api/patterns              # 创建图解
GET    /api/patterns/:id          # 获取图解详情
PUT    /api/patterns/:id          # 更新图解
DELETE /api/patterns/:id          # 删除图解

# 搜索和筛选
GET    /api/patterns/search?q=keyword&difficulty=beginner&category=scarf

# 收藏
POST   /api/patterns/:id/like
DELETE /api/patterns/:id/like

# 导出
GET    /api/patterns/:id/export?format=pdf|png|json
```

#### 2. 3D可视化API

```yaml
# 生成3D数据
POST   /api/visualize/3d-data
Body: {
  "patternId": "string",
  "options": {
    "material": "cotton|wool|acrylic",
    "colors": ["#FF0000", "#00FF00"],
    "detailLevel": "low|medium|high"
  }
}
Response: {
  "modelUrl": "/api/models/xxx.glb",
  "metadata": {
    "vertices": 10000,
    "faces": 5000,
    "estimatedTime": 30
  }
}

# 获取针法模型
GET    /api/visualize/stitches/:type
```

#### 3. 图片转换API

```yaml
# 提交转换任务
POST   /api/convert
Content-Type: multipart/form-data
Body: {
  "image": File,
  "options": {
    "gridSize": "auto|manual",
    "enhance": true
  }
}
Response: {
  "conversionId": "conv_xxx",
  "status": "pending",
  "estimatedTime": 10
}

# 查询转换状态
GET    /api/convert/:id
Response: {
  "id": "conv_xxx",
  "status": "processing|completed|failed",
  "progress": 75,
  "result": {
    "pattern": {...},
    "confidence": 0.92,
    "warnings": []
  },
  "errorMessage": null
}

# 获取转换结果
GET    /api/convert/:id/result
```

### GraphQL Schema (可选)

```graphql
type Pattern {
  id: ID!
  name: String!
  description: String
  type: PatternType!
  grid: [[StitchCell!]!]!
  metadata: PatternMetadata!
  author: User!
  category: Category
  likes: Int!
  isLiked: Boolean!
  viewCount: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type StitchCell {
  row: Int!
  col: Int!
  stitch: StitchType!
  color: String
  repeat: Int
  annotations: [String!]
}

type Query {
  patterns(
    filter: PatternFilter
    orderBy: PatternOrderBy
    first: Int
    after: String
  ): PatternConnection!

  pattern(id: ID!): Pattern

  conversion(id: ID!): Conversion
}

type Mutation {
  createPattern(input: CreatePatternInput!): Pattern!
  updatePattern(id: ID!, input: UpdatePatternInput!): Pattern!
  deletePattern(id: ID!): Boolean!

  startConversion(input: ConversionInput!): Conversion!
  cancelConversion(id: ID!): Boolean!

  likePattern(id: ID!): Boolean!
  unlikePattern(id: ID!): Boolean!
}

subscription {
  conversionProgress(id: ID!): ConversionUpdate!
}
```

---

## 前端架构

### 目录结构

```
app/
├── (main)/                          # 主页面组
│   ├── page.tsx                     # 首页
│   ├── layout.tsx                   # 主布局
│   ├── visualize/
│   │   ├── page.tsx                 # 3D可视化页面
│   │   ├── layout.tsx
│   │   └── [id]/
│   │       └── page.tsx             # 具体图解的3D视图
│   ├── convert/
│   │   ├── page.tsx                 # 图片转换页面
│   │   └── layout.tsx
│   ├── library/
│   │   ├── page.tsx                 # 图解库页面
│   │   ├── layout.tsx
│   │   └── [id]/
│   │       └── page.tsx             # 图解详情页
│   ├── editor/
│   │   ├── page.tsx                 # 图解编辑器
│   │   └── layout.tsx
│   └── dictionary/
│       ├── page.tsx                 # 针法字典
│       └── [stitch]/
│           └── page.tsx             # 针法详情
├── api/                             # API路由
│   ├── patterns/
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── route.ts
│   ├── visualize/
│   │   └── route.ts
│   └── convert/
│       └── route.ts
├── layout.tsx                       # 根布局
└── globals.css                      # 全局样式

components/
├── ui/                              # shadcn/ui组件
├── crochet/                         # 钩针相关组件
│   ├── PatternViewer/               # 图解查看器
│   ├── PatternEditor/               # 图解编辑器
│   ├── SymbolLibrary/               # 符号库
│   └── StitchCard/                  # 针法卡片
├── three/                           # 3D相关组件
│   ├── CrochetModel/                # 3D模型组件
│   ├── StitchRenderer/              # 针法渲染器
│   ├── Scene/                       # 3D场景
│   └── Controls/                    # 3D控制组件
├── convert/                         # 转换相关组件
│   ├── ImageUploader/               # 图片上传
│   ├── ConversionProgress/          # 转换进度
│   └── PatternPreview/              # 图解预览
└── layout/                          # 布局组件
    ├── Header/
    ├── Sidebar/
    └── Footer/

lib/
├── crochet/                         # 钩针核心逻辑
│   ├── parser.ts                    # 图解解析器
│   ├── symbols.ts                   # 符号定义
│   ├── generator.ts                 # 3D生成器
│   └── validator.ts                 # 数据验证
├── three/                           # Three.js工具
│   ├── geometry.ts                  # 几何体创建
│   ├── material.ts                  # 材质管理
│   └── scene.ts                     # 场景配置
├── utils.ts                         # 通用工具
└── api.ts                           # API客户端

hooks/
├── usePattern.ts                    # 图解数据管理
├── useConversion.ts                 # 转换任务管理
├── use3DScene.ts                    # 3D场景控制
└── useAuth.ts                       # 认证状态

stores/
├── patternStore.ts                  # 图解状态
├── editorStore.ts                   # 编辑器状态
└── uiStore.ts                       # UI状态

types/
├── crochet.ts                       # 钩针类型定义
├── api.ts                           # API类型定义
└── index.ts                         # 类型导出
```

### 状态管理

#### Zustand Store设计

```typescript
// stores/patternStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface PatternState {
  patterns: Pattern[];
  currentPattern: Pattern | null;
  loading: boolean;
  error: string | null;

  // Actions
  setPatterns: (patterns: Pattern[]) => void;
  setCurrentPattern: (pattern: Pattern | null) => void;
  addPattern: (pattern: Pattern) => void;
  updatePattern: (id: string, updates: Partial<Pattern>) => void;
  deletePattern: (id: string) => void;

  // Async actions
  fetchPatterns: (filters?: PatternFilters) => Promise<void>;
  fetchPattern: (id: string) => Promise<void>;
  savePattern: (pattern: CreatePatternInput) => Promise<void>;
}

export const usePatternStore = create<PatternState>()(
  immer((set, get) => ({
    patterns: [],
    currentPattern: null,
    loading: false,
    error: null,

    setPatterns: (patterns) => set({ patterns }),
    setCurrentPattern: (pattern) => set({ currentPattern: pattern }),

    addPattern: (pattern) =>
      set((state) => {
        state.patterns.push(pattern);
      }),

    updatePattern: (id, updates) =>
      set((state) => {
        const index = state.patterns.findIndex((p) => p.id === id);
        if (index !== -1) {
          Object.assign(state.patterns[index], updates);
        }
      }),

    deletePattern: (id) =>
      set((state) => {
        state.patterns = state.patterns.filter((p) => p.id !== id);
      }),

    fetchPatterns: async (filters) => {
      set({ loading: true, error: null });
      try {
        const patterns = await api.getPatterns(filters);
        set({ patterns, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    },

    // ...其他异步方法
  }))
);
```

---

## AI服务架构

### Python服务结构

```
python-service/
├── app/
│   ├── __init__.py
│   ├── main.py                     # FastAPI入口
│   ├── config.py                   # 配置管理
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── convert.py          # 转换API
│   │   │   └── health.py           # 健康检查
│   │   └── dependencies.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── pipeline.py             # 处理Pipeline
│   │   └── exceptions.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── classifier.py           # 符号分类器
│   │   └── segmentation.py         # 分割模型
│   ├── services/
│   │   ├── __init__.py
│   │   ├── preprocessor.py         # 图像预处理
│   │   ├── grid_detector.py        # 网格检测
│   │   ├── symbol_extractor.py     # 符号提取
│   │   ├── pattern_builder.py      # 图解重建
│   │   └── ocr.py                  # 文字识别
│   └── schemas/
│       ├── __init__.py
│       └── convert.py              # Pydantic模型
├── models/                          # 预训练模型
│   ├── symbol_classifier.pth
│   ├── grid_detector.onnx
│   └── char_recognition.onnx
├── training/                        # 训练代码
│   ├── data/
│   │   └── prepare.py              # 数据准备
│   ├── train_classifier.py         # 训练分类器
│   └── evaluate.py                 # 模型评估
├── tests/                           # 测试
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```

### 核心Pipeline代码

```python
# app/core/pipeline.py

from dataclasses import dataclass
from typing import List, Optional, Tuple
import numpy as np
from PIL import Image

from ..services.preprocessor import ImagePreprocessor
from ..services.grid_detector import GridDetector
from ..services.symbol_extractor import SymbolExtractor
from ..models.classifier import SymbolClassifier
from ..services.pattern_builder import PatternBuilder

@dataclass
class ConversionResult:
    """转换结果"""
    success: bool
    pattern: Optional[dict]
    confidence: float
    warnings: List[str]
    error_message: Optional[str] = None

class PatternConversionPipeline:
    """图解转换Pipeline"""

    def __init__(self):
        self.preprocessor = ImagePreprocessor()
        self.grid_detector = GridDetector()
        self.symbol_extractor = SymbolExtractor()
        self.classifier = SymbolClassifier()
        self.pattern_builder = PatternBuilder()

    async def process(
        self,
        image: Image.Image,
        options: dict = None
    ) -> ConversionResult:
        """处理图解图片"""
        try:
            warnings = []

            # Stage 1: 预处理
            processed = await self.preprocessor.process(image)
            if processed.quality_score < 0.5:
                warnings.append("图像质量较低，可能影响识别准确率")

            # Stage 2: 网格检测
            grid = await self.grid_detector.detect(processed.image)
            if not grid.is_valid:
                return ConversionResult(
                    success=False,
                    pattern=None,
                    confidence=0,
                    warnings=warnings,
                    error_message="无法检测图解网格，请确保图片包含清晰的网格线"
                )

            # Stage 3: 符号提取
            symbols = await self.symbol_extractor.extract(
                processed.image,
                grid
            )

            # Stage 4: 符号分类
            classified = []
            total_confidence = 0
            for symbol in symbols:
                result = await self.classifier.classify(symbol.image)
                classified.append({
                    **symbol.to_dict(),
                    'stitch_type': result.class_name,
                    'confidence': result.confidence
                })
                total_confidence += result.confidence

            avg_confidence = total_confidence / len(classified) if classified else 0

            # Stage 5: 图解重建
            pattern = await self.pattern_builder.build(
                classified,
                grid,
                options
            )

            return ConversionResult(
                success=True,
                pattern=pattern,
                confidence=avg_confidence,
                warnings=warnings
            )

        except Exception as e:
            return ConversionResult(
                success=False,
                pattern=None,
                confidence=0,
                warnings=[],
                error_message=str(e)
            )
```

---

## 部署架构

### Docker配置

```dockerfile
# Dockerfile (Frontend)
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

```dockerfile
# Dockerfile.python (AI Service)
FROM python:3.11-slim AS base

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY app/ ./app/
COPY models/ ./models/

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/crochet
      - REDIS_URL=redis://redis:6379
      - PYTHON_SERVICE_URL=http://python-service:8000
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - db
      - redis
      - python-service

  python-service:
    build:
      context: ./python-service
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - MODEL_PATH=/app/models
      - DEVICE=cpu
    volumes:
      - ./models:/app/models:ro

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=crochet
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

volumes:
  postgres_data:
  redis_data:
```

### 生产环境部署

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '1'
          memory: 1G
    environment:
      - NODE_ENV=production
    networks:
      - crochet-network

  python-service:
    build:
      context: ./python-service
      dockerfile: Dockerfile
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '2'
          memory: 4G
    environment:
      - DEVICE=cuda  # 使用GPU
    runtime: nvidia
    networks:
      - crochet-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - python-service
    networks:
      - crochet-network

networks:
  crochet-network:
    driver: bridge
```

---

## 性能指标

### 目标性能

| 指标 | 目标值 | 测量方式 |
|-----|-------|---------|
| 3D模型生成时间 | < 3秒 (100x100网格) | 从解析到渲染 |
| 页面首屏加载 | < 2秒 | Lighthouse |
| 图解识别准确率 | > 90% | 测试集评估 |
| 图解识别速度 | < 10秒 | 标准图解(50x50) |
| API响应时间 | < 200ms (P95) | 服务端监控 |
| 3D场景FPS | > 30fps | 浏览器性能面板 |

### 性能优化清单

- [ ] 启用Next.js图片优化
- [ ] 配置CDN静态资源缓存
- [ ] 3D模型使用Draco压缩
- [ ] 实现3D模型的渐进式加载
- [ ] 数据库查询优化和索引
- [ ] Redis缓存热点数据
- [ ] 使用Service Worker离线缓存
- [ ] 代码分割和懒加载

---

## 安全考虑

1. **文件上传安全**
   - 限制文件类型(只允许图片)
   - 限制文件大小(< 10MB)
   - 使用病毒扫描
   - 存储隔离

2. **API安全**
   - Rate Limiting (100 req/min)
   - JWT认证
   - CORS配置
   - SQL注入防护 (使用Prisma ORM)

3. **3D渲染安全**
   - WebGL上下文限制
   - 防止恶意模型导致GPU占用过高

4. **AI服务安全**
   - 输入验证
   - 超时控制
   - 资源配额限制

---

## 监控和日志

### 监控指标

- 应用性能指标 (APM)
- 3D渲染性能
- AI服务调用成功率
- 数据库查询性能
- 错误率和异常追踪

### 日志规范

```typescript
// 结构化日志
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "info",
  "service": "frontend",
  "traceId": "abc-123",
  "message": "3D visualization completed",
  "metadata": {
    "patternId": "pat_xxx",
    "renderTime": 1500,
    "vertices": 10000
  }
}
```

---

## 附录

### 针法符号参考

| 符号 | 名称(中文) | 名称(英文) | 缩写 |
|-----|-----------|-----------|-----|
| ○ | 锁针/辫子针 | Chain | ch |
| • | 短针 | Single Crochet | sc |
| T | 中长针 | Half Double Crochet | hdc |
| ⅃ | 长针 | Double Crochet | dc |
| ト | 长长针 | Treble Crochet | tr |
| V | 加针 | Increase | inc |
| ∧ | 减针 | Decrease | dec |

### 参考资料

- [Crochet Chart Symbols](https://www.craftyarncouncil.com/standards/crochet-chart-symbols)
- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmndrs.react-three-fiber.org/)
- [Next.js App Router](https://nextjs.org/docs/app)
