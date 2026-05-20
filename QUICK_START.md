# 🚀 AI Song Generator - 快速入门指南

## 📖 项目简介

AI Song Generator 是一个基于先进AI技术的智能仿写歌曲生成平台。用户可以：

- 🎵 搜索热门歌曲或上传自定义歌曲
- 🎯 通过DeepSeek V4Pro分析歌曲风格和旋律
- ✍️ AI智能生成原创歌词（含敏感词检测）
- 🎧 使用MiniMax music-2.6合成歌曲
- ✅ 多维度侵权检测
- 💾 下载MP3/WAV格式

---

## ⚡ 快速开始

### 方式一：一键启动（推荐）

```bash
# Linux/Mac
./start.sh

# Windows
start.bat
```

### 方式二：手动启动

```bash
# 1. 安装依赖
npm install

# 2. 启动后端 (终端1)
cd server
npm run dev

# 3. 启动前端 (终端2)
cd client
npm run dev
```

### 4. 访问应用

打开浏览器访问：**http://localhost:3000**

---

## 🔑 配置API密钥

首次使用需要配置AI服务的API密钥：

### 1. 通过界面配置（推荐）

1. 访问 **http://localhost:3000**
2. 点击顶部菜单 **"设置"**
3. 填入 DeepSeek 和 MiniMax 的API密钥
4. 点击 **"保存设置"**

### 2. 通过环境变量配置

编辑 `.env` 文件：

```bash
DEEPSEEK_API_KEY=sk-your-deepseek-api-key
MINIMAX_API_KEY=sk-cp-your-minimax-api-key
```

### 获取API密钥

- **DeepSeek**: https://platform.deepseek.com
- **MiniMax**: https://www.minimax.chat

---

## 🎨 使用流程

### 步骤1：选择歌曲

- **方式A**：在首页搜索框输入歌曲名
- **方式B**：从热门歌曲列表选择
- **方式C**：上传本地音频文件

### 步骤2：风格分析

点击"开始风格分析"，系统将分析：
- 曲风类型（流行、摇滚、电子等）
- 情绪标签（欢快、悲伤等）
- BPM速度、人声特征
- 乐器配置、和声走向
- 混音风格

### 步骤3：旋律分析

点击"开始旋律分析"，提取：
- 音高范围
- 音符时长分布
- 音程特征
- 力度变化曲线
- 节奏模式

### 步骤4：歌词创作

- 点击"AI智能创作歌词"自动生成
- 或手动编辑歌词
- 系统会实时检测敏感词

### 步骤5：歌曲生成

点击"开始生成歌曲"，系统将：
- 使用MiniMax music-2.6合成
- 严格执行3-5分钟时长
- 输出MP3和WAV格式

### 步骤6：侵权检测与下载

- 系统自动进行侵权检测
- 根据风险等级决定是否可以下载
- 选择格式下载（MP3/WAV）

---

## 🐛 常见问题

### Q1: 启动失败，端口被占用？

```bash
# 查找占用端口的进程
lsof -i :3000
lsof -i :5000

# 杀掉进程
kill -9 <PID>
```

### Q2: API调用失败？

1. 检查API密钥是否正确配置
2. 检查网络连接
3. 查看服务端日志
4. 确认API额度是否充足

### Q3: 文件上传失败？

- 检查文件格式是否支持（MP3/WAV/M4A/FLAC）
- 检查文件大小是否超过100MB
- 检查上传目录权限

### Q4: 歌曲生成很慢？

- 歌曲生成需要3-5分钟
- 这是正常的，请耐心等待
- 可以查看实时进度

---

## 📂 项目结构

```
song-generator/
├── client/                 # 前端 (React)
│   ├── src/
│   │   ├── components/    # UI组件
│   │   ├── pages/         # 页面
│   │   ├── services/      # API服务
│   │   └── store/         # 状态管理
│   └── package.json
│
├── server/                 # 后端 (Express)
│   ├── src/
│   │   ├── routes/        # API路由
│   │   ├── services/      # 业务逻辑
│   │   ├── middleware/    # 中间件
│   │   └── app.ts        # 入口
│   ├── uploads/           # 上传目录
│   ├── outputs/           # 输出目录
│   └── package.json
│
├── .env                   # 环境变量
├── docker-compose.yml     # Docker配置
├── start.sh              # 启动脚本
└── README.md             # 说明文档
```

---

## 🐳 Docker部署

```bash
# 1. 克隆项目
git clone <repository>
cd song-generator

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 填入API密钥

# 3. 启动服务
docker-compose up -d

# 4. 访问
# 前端: http://localhost:3000
# 后端: http://localhost:5000
```

---

## 🔧 开发指南

### 前端开发

```bash
cd client

# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint
```

### 后端开发

```bash
cd server

# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 代码检查
npm run lint
```

---

## 🧪 测试

### 运行测试脚本

```bash
# Linux/Mac
./test.sh

# Windows
bash test.sh
```

### 手动测试API

```bash
# 健康检查
curl http://localhost:5000/api/health

# 获取热门歌曲
curl http://localhost:5000/api/songs/hot

# 搜索歌曲
curl "http://localhost:5000/api/songs/search?q=周杰伦"
```

---

## 📚 更多文档

- [README.md](README.md) - 项目完整说明
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - 项目详细总结
- [DELIVERY_CHECKLIST.md](DELIVERY_CHECKLIST.md) - 交付清单
- [.trae/documents/PRD.md](../.trae/documents/PRD.md) - 产品需求文档
- [.trae/documents/Technical-Architecture.md](../.trae/documents/Technical-Architecture.md) - 技术架构

---

## ⚠️ 注意事项

1. **API密钥安全**：不要将真实密钥提交到代码仓库
2. **版权问题**：生成歌曲仅供个人学习使用
3. **网络要求**：需要稳定的网络连接访问AI服务
4. **存储空间**：确保有足够空间存储音频文件

---

## 🎉 成功案例

使用本系统，你可以：

- 🎵 快速生成风格相似的原创歌曲
- ✍️ 获取专业的歌词创作建议
- 🎼 学习不同歌曲的风格特点
- 🔍 了解AI音乐生成技术
- 💡 激发音乐创作灵感

---

**享受音乐创作的乐趣吧！** 🎵✨

---

**版本：** v1.0.0  
**更新：** 2026-05-20
