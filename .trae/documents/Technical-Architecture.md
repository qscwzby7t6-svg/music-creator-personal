# 仿写歌曲软件 - 技术架构文档

## 1. 系统架构概述

### 1.1 架构模式
**采用前后端分离架构 (Frontend-Backend Separation)**

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Client        │────▶│   Backend       │────▶│   AI Services   │
│   (React)       │◀────│   (Express)     │◀────│   (DeepSeek,    │
│   Browser       │     │   Node.js       │     │    MiniMax)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 1.2 技术栈总览
- **前端框架：** React 18 + TypeScript
- **后端框架：** Express.js 4.x
- **构建工具：** Vite 5.x
- **包管理器：** npm
- **编程语言：** TypeScript (前后端统一)
- **数据库：** MongoDB 6.x
- **缓存层：** Redis 7.x
- **音频处理：** FFmpeg

---

## 2. 项目目录结构

```
song-generator/
├── client/                     # 前端项目
│   ├── src/
│   │   ├── components/         # React组件
│   │   │   ├── AudioPlayer/   # 音频播放器
│   │   │   ├── SongSearch/    # 歌曲搜索
│   │   │   ├── StyleAnalyzer/ # 风格分析
│   │   │   ├── MelodyAnalyzer/# 旋律分析
│   │   │   ├── LyricEditor/   # 歌词编辑
│   │   │   ├── SongGenerator/ # 歌曲生成
│   │   │   └── DownloadPanel/ # 下载面板
│   │   ├── pages/             # 页面组件
│   │   │   ├── Home/         # 首页
│   │   │   ├── Studio/       # 创作工作室
│   │   │   ├── Library/      # 歌曲库
│   │   │   └── Settings/     # 设置页
│   │   ├── services/         # API服务
│   │   │   ├── api.ts        # API基础配置
│   │   │   ├── deepseek.ts   # DeepSeek服务
│   │   │   ├── minimax.ts    # MiniMax服务
│   │   │   └── song.ts       # 歌曲服务
│   │   ├── store/            # 状态管理
│   │   ├── hooks/            # 自定义Hook
│   │   ├── utils/            # 工具函数
│   │   ├── types/            # TypeScript类型定义
│   │   └── styles/           # 全局样式
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── server/                    # 后端项目
│   ├── src/
│   │   ├── routes/           # 路由定义
│   │   │   ├── song.routes.ts
│   │   │   ├── analyze.routes.ts
│   │   │   └── generate.routes.ts
│   │   ├── controllers/      # 控制器
│   │   │   ├── song.controller.ts
│   │   │   ├── analyze.controller.ts
│   │   │   └── generate.controller.ts
│   │   ├── services/         # 业务逻辑
│   │   │   ├── deepseek.service.ts
│   │   │   ├── minimax.service.ts
│   │   │   ├── audio.service.ts
│   │   │   └── plagiarism.service.ts
│   │   ├── middleware/       # 中间件
│   │   │   ├── auth.middleware.ts
│   │   │   ├── upload.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── models/           # 数据模型
│   │   ├── utils/           # 工具函数
│   │   ├── config/          # 配置文件
│   │   └── app.ts           # 应用入口
│   ├── uploads/             # 上传文件目录
│   ├── outputs/            # 生成歌曲目录
│   ├── package.json
│   └── tsconfig.json
│
├── .env                      # 环境变量
├── docker-compose.yml       # Docker编排
└── README.md
```

---

## 3. 前端架构设计

### 3.1 组件架构

#### 3.1.1 核心组件列表
```
Components Hierarchy:
├── App
│   ├── Layout
│   │   ├── Header
│   │   ├── Sidebar
│   │   └── Footer
│   ├── Router
│   │   ├── / (Home)
│   │   ├── /studio (Studio)
│   │   ├── /library (Library)
│   │   └── /settings (Settings)
│   └── AudioPlayer (全局)
```

#### 3.1.2 创作工作室组件
```
StudioPage
├── StepWizard
│   ├── Step1: SourceSelection
│   │   ├── HotSongsList
│   │   ├── CategorySelector
│   │   └── FileUploader
│   ├── Step2: StyleAnalysis
│   │   ├── WaveformDisplay
│   │   ├── StyleResultCard
│   │   └── PromptPreview
│   ├── Step3: MelodyAnalysis
│   │   ├── PianoRollDisplay
│   │   └── MelodyResultCard
│   ├── Step4: LyricGeneration
│   │   ├── LyricEditor
│   │   ├── SensitiveWordAlert
│   │   └── WordCountDisplay
│   ├── Step5: SongGeneration
│   │   ├── GenerationProgress
│   │   ├── PreviewPlayer
│   │   └── PlagiarismReport
│   └── Step6: DownloadExport
│       ├── FormatSelector
│       └── DownloadButtons
```

### 3.2 状态管理 (Redux Toolkit)

```typescript
// Store Structure
interface RootState {
  song: {
    sourceSong: Song | null;
    hotSongs: Song[];
    selectedCategory: string;
    uploadProgress: number;
  };
  analysis: {
    stylePrompt: string;
    melodyPrompt: string;
    analysisProgress: number;
    isAnalyzing: boolean;
  };
  generation: {
    lyrics: string;
    generatedSong: GeneratedSong | null;
    generationProgress: number;
    plagiarismReport: PlagiarismReport | null;
  };
  settings: {
    deepseekApiKey: string;
    minimaxApiKey: string;
    defaultDuration: [number, number];
  };
}
```

### 3.3 API服务层

```typescript
// services/api.ts
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 180000, // 3分钟超时
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use((config) => {
  // 添加认证Token
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权
    }
    return Promise.reject(error);
  }
);
```

---

## 4. 后端架构设计

### 4.1 Express应用结构

```typescript
// server/src/app.ts
import express from 'express';
import cors from 'cors';
import { songRoutes } from './routes/song.routes';
import { analyzeRoutes } from './routes/analyze.routes';
import { generateRoutes } from './routes/generate.routes';
import { errorHandler } from './middleware/error.middleware';
import { uploadMiddleware } from './middleware/upload.middleware';

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/outputs', express.static('outputs'));

// 路由
app.use('/api/songs', songRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/generate', generateRoutes);

// 错误处理
app.use(errorHandler);

export default app;
```

### 4.2 API路由设计

#### 4.2.1 歌曲路由
```typescript
// GET /api/songs/hot?platform=qq&category=pop&limit=20
// 获取热门歌曲列表

// GET /api/songs/search?q=告白气球
// 搜索歌曲

// POST /api/songs/upload
// 上传歌曲文件 (multipart/form-data)

// GET /api/songs/:id
// 获取歌曲详情
```

#### 4.2.2 分析路由
```typescript
// POST /api/analyze/style
// 分析歌曲风格
// Request: { songId: string, audioFile?: File }
// Response: { stylePrompt: string, confidence: number }

// POST /api/analyze/melody
// 分析歌曲旋律
// Request: { songId: string, audioFile?: File }
// Response: { melodyPrompt: string, features: MelodyFeatures }

// POST /api/analyze/lyrics
// 生成歌词
// Request: { stylePrompt: string, melodyPrompt: string, theme?: string }
// Response: { lyrics: string, sensitiveWords: string[] }
```

#### 4.2.3 生成路由
```typescript
// POST /api/generate/song
// 生成歌曲
// Request: {
//   stylePrompt: string,
//   melodyPrompt: string,
//   lyrics: string,
//   duration: [number, number]
// }
// Response: { taskId: string, status: 'pending' }

// GET /api/generate/status/:taskId
// 查询生成状态
// Response: { status: 'pending'|'processing'|'completed'|'failed', progress: number }

// GET /api/generate/download/:taskId?format=mp3|wav
// 下载生成的歌曲
// Response: audio file stream
```

### 4.3 服务层设计

#### 4.3.1 DeepSeek服务
```typescript
// services/deepseek.service.ts
import OpenAI from 'openai';

class DeepSeekService {
  private client: OpenAI;
  
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com',
    });
  }
  
  async analyzeStyle(audioData: Buffer): Promise<StyleAnalysis> {
    // 调用DeepSeek V4Pro进行风格分析
    const response = await this.client.chat.completions.create({
      model: 'deepseek-chat-v4-pro',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的音乐风格分析师...',
        },
        {
          role: 'user',
          content: `请分析这段音乐的风格特征：${audioData.toString('base64')}`,
        },
      ],
    });
    
    return this.parseStyleResponse(response);
  }
  
  async analyzeMelody(audioData: Buffer): Promise<MelodyAnalysis> {
    // 调用DeepSeek V4Pro进行旋律分析
  }
  
  async generateLyrics(
    stylePrompt: string,
    melodyPrompt: string,
    theme?: string
  ): Promise<LyricGeneration> {
    // 调用DeepSeek V4Pro生成歌词
  }
}
```

#### 4.3.2 MiniMax服务
```typescript
// services/minimax.service.ts
class MiniMaxService {
  private apiKey: string;
  private baseUrl = 'https://api.minimax.chat/v1';
  
  async generateSong(
    stylePrompt: string,
    melodyPrompt: string,
    lyrics: string,
    duration: [number, number]
  ): Promise<GenerateResponse> {
    const response = await fetch(`${this.baseUrl}/music_generation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'music-2.6',
        style_prompt: stylePrompt,
        melody_prompt: melodyPrompt,
        lyrics: lyrics,
        duration_seconds: {
          min: duration[0],
          max: duration[1],
        },
        output_format: ['mp3', 'wav'],
      }),
    });
    
    return response.json();
  }
}
```

#### 4.3.3 侵权检测服务
```typescript
// services/plagiarism.service.ts
class PlagiarismService {
  async checkPlagiarism(
    generatedSong: Buffer,
    originalSong?: Buffer
  ): Promise<PlagiarismReport> {
    // 1. 音频指纹比对
    const audioFingerprint = await this.extractFingerprint(generatedSong);
    
    // 2. 与版权库比对
    const similarity = await this.compareWithDatabase(audioFingerprint);
    
    // 3. 旋律相似度分析
    const melodySimilarity = await this.analyzeMelodySimilarity(
      generatedSong,
      originalSong
    );
    
    // 4. 生成风险评估
    return {
      riskLevel: this.calculateRiskLevel(similarity, melodySimilarity),
      audioSimilarity: similarity,
      melodySimilarity: melodySimilarity,
      similarSegments: this.findSimilarSegments(generatedSong),
      suggestions: this.generateSuggestions(similarity, melodySimilarity),
    };
  }
}
```

---

## 5. 数据库设计

### 5.1 MongoDB数据模型

#### 5.1.1 Song模型
```typescript
// models/Song.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ISong extends Document {
  title: string;
  artist: string;
  album?: string;
  duration: number;
  category: string;
  playCount: number;
  coverUrl: string;
  audioUrl: string;
  platform: string;
 热度: number;
  createdAt: Date;
  updatedAt: Date;
}

const SongSchema = new Schema({
  title: { type: String, required: true, index: true },
  artist: { type: String, required: true, index: true },
  album: { type: String },
  duration: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['pop', 'rock', 'hiphop', 'edm', 'folk', 'love', 'tiktok', 'western', 'jpop', 'chinese'],
    index: true 
  },
  playCount: { type: Number, default: 0 },
  coverUrl: { type: String },
  audioUrl: { type: String },
  platform: { type: String, enum: ['qq', 'netease', 'kugou', 'local'] },
  heat: { type: Number, default: 0 },
}, {
  timestamps: true,
});
```

#### 5.1.2 Project模型
```typescript
// models/Project.ts
export interface IProject extends Document {
  userId: string;
  sourceSongId?: string;
  stylePrompt: string;
  melodyPrompt: string;
  lyrics: string;
  generatedSongUrl?: string;
  status: 'pending' | 'analyzing' | 'generating' | 'completed' | 'failed';
  plagiarismReport?: PlagiarismReport;
  duration: [number, number];
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 6. 部署架构

### 6.1 Docker编排

```yaml
# docker-compose.yml
version: '3.8'

services:
  client:
    build:
      context: ./client
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:5000/api
    depends_on:
      - server
    volumes:
      - ./client:/app
      - /app/node_modules

  server:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/song-generator
      - REDIS_URL=redis://redis:6379
      - DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
      - MINIMAX_API_KEY=${MINIMAX_API_KEY}
    depends_on:
      - mongo
      - redis
    volumes:
      - ./server/uploads:/app/uploads
      - ./server/outputs:/app/outputs

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - client
      - server

volumes:
  mongo-data:
  redis-data:
```

### 6.2 环境变量配置

```env
# .env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/song-generator

# Redis
REDIS_URL=redis://localhost:6379

# API Keys
DEEPSEEK_API_KEY=sk-9c295285116547729e8deee1255030aa
MINIMAX_API_KEY=sk-cp-M8nlgav6xfT4XWypLAVjq9RpxpDua3Uj2RrxlL87Rdx5Db-QKZLqLKYiwAA2PICAbdZcWCdTcIn2_tg_iJdd2AREkarnEE2xS2epcs3LffEPzv1dV5Dd8A4

# File Upload
MAX_FILE_SIZE=104857600
UPLOAD_DIR=./uploads
OUTPUT_DIR=./outputs

# Generation Settings
DEFAULT_DURATION_MIN=180
DEFAULT_DURATION_MAX=300
```

---

## 7. 安全设计

### 7.1 API安全
- 所有API请求需要Token认证
- API密钥通过环境变量注入，不在前端暴露
- 请求频率限制 (Rate Limiting)

### 7.2 文件上传安全
- 文件类型白名单校验
- 文件大小限制
- 文件名随机化
- 恶意文件扫描

### 7.3 内容安全
- 歌词敏感词检测
- 用户生成内容审核
- 侵权风险评估

---

## 8. 性能优化

### 8.1 前端优化
- 路由懒加载
- 组件按需加载
- 图片懒加载
- CSS代码分割

### 8.2 后端优化
- Redis缓存热点数据
- MongoDB索引优化
- 异步任务队列
- 音频处理流式传输

### 8.3 AI服务调用优化
- 请求合并
- 结果缓存
- 失败重试机制
- 降级策略

---

## 9. 监控与日志

### 9.1 日志系统
- 请求日志
- 错误日志
- AI服务调用日志
- 用户行为日志

### 9.2 监控指标
- API响应时间
- AI服务成功率
- 系统资源使用率
- 并发用户数

---

## 10. 开发规范

### 10.1 Git工作流
- Feature Branch Workflow
- Commit Message规范 (Conventional Commits)
- Code Review机制

### 10.2 代码规范
- ESLint + Prettier
- TypeScript strict mode
- 统一的命名规范
- 完整的TypeScript类型定义

### 10.3 测试规范
- Jest单元测试
- Supertest集成测试
- React Testing Library组件测试
- 覆盖率要求 ≥80%

---

## 11. 第三方服务集成

### 11.1 DeepSeek V4Pro
- **用途：** 风格分析、旋律分析、歌词生成
- **模型：** deepseek-chat-v4-pro
- **限制：** 遵循DeepSeek API限制

### 11.2 MiniMax music-2.6
- **用途：** AI歌曲合成
- **模型：** music-2.6
- **输入：** 风格提示词、旋律提示词、歌词
- **输出：** MP3/WAV格式音频

### 11.3 音乐平台API（预留）
- QQ音乐API
- 网易云音乐API
- 酷狗音乐API
- 用于热门歌曲数据获取

---

## 12. 扩展性设计

### 12.1 插件化架构
- 支持自定义AI模型
- 可配置的侵权检测引擎
- 模块化的音频处理器

### 12.2 微服务预留
- 独立的音频处理服务
- 独立的AI推理服务
- 独立的数据分析服务

---

**文档版本：** 1.0  
**创建时间：** 2026-05-20  
**最后更新：** 2026-05-20  
**文档作者：** AI Assistant
