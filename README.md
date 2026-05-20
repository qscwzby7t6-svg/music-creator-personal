# AI Song Generator - 智能仿写歌曲生成器

基于先进的AI技术，自动分析原曲风格与旋律特征，创作独一无二的原创歌曲。

## 功能特性

- 🎵 全网热门歌曲自动搜索
- 🎯 DeepSeek V4Pro 风格分析
- 🎼 深度旋律特征提取
- ✍️ AI智能歌词创作
- 🔍 敏感词检测与过滤
- 🎧 MiniMax music-2.6 歌曲合成
- ✅ 侵权检测系统
- 💾 多格式导出（MP3/WAV）

## 技术栈

### 前端
- React 18 + TypeScript
- Redux Toolkit
- Ant Design 5.x
- Vite 5.x

### 后端
- Express.js 4.x
- MongoDB 6.x
- Redis 7.x

### AI服务
- DeepSeek V4Pro API
- MiniMax music-2.6 API

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

编辑 `.env` 文件，配置您的API密钥：

```
DEEPSEEK_API_KEY=sk-your-deepseek-api-key
MINIMAX_API_KEY=sk-cp-your-minimax-api-key
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 开发指南

### 前端开发

```bash
cd client
npm install
npm run dev
```

### 后端开发

```bash
cd server
npm install
npm run dev
```

## 创作流程

1. **选择歌曲** - 搜索热门歌曲或上传自定义歌曲
2. **风格分析** - DeepSeek分析曲风、情绪、乐器等
3. **旋律分析** - 提取音高、时长、音程等特征
4. **歌词创作** - AI生成原创歌词
5. **歌曲生成** - MiniMax合成完整歌曲
6. **侵权检测** - 确保原创性
7. **下载导出** - 获取MP3/WAV格式

## 注意事项

- API密钥仅存储在本地，不会上传到服务器
- 生成歌曲仅供个人学习交流使用
- 商业用途请注意版权问题

## License

MIT
