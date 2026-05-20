import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import songRoutes from './routes/song.routes.js'
import analyzeRoutes from './routes/analyze.routes.js'
import generateRoutes from './routes/generate.routes.js'
import { errorHandler } from './middleware/error.middleware.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(compression())
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use('/outputs', express.static(path.join(__dirname, '../outputs')))

app.use('/api/songs', songRoutes)
app.use('/api/analyze', analyzeRoutes)
app.use('/api/generate', generateRoutes)

// 测试路由 - 《暖暖》仿写
const NUAN_NUAN_DATA = {
  title: '暖暖',
  artist: '梁静茹',
  duration: 265,
  category: 'chinese',
  coverUrl: 'https://p2.music.126.net/VkGpqUQRk3L8Qv6T6g2kCQ==/109951166950853327.jpg',
  style: {
    genre: '流行',
    mood: '温暖',
    vocalType: '女声',
    bpm: 76,
    instruments: ['钢琴', '吉他', '弦乐', '贝斯', '鼓'],
    harmony: '大调',
    mixingStyle: '温暖',
    confidence: 0.92
  },
  melody: {
    pitchRange: { min: 60, max: 88 },
    avgDuration: 0.6,
    intervals: [2, 3, 4, 5, 6],
    dynamics: [75, 85, 95, 80, 90],
    rhythmPattern: '4/4拍',
  },
  lyrics: `【前奏】

【主歌1】
都可以随便的
你说的我都愿意去
小火车摆动的旋律
都可以是真的
你说的我都会相信
因为我完全信任你

【副歌】
细腻的喜欢
毛毯般的厚重感
晒过太阳熟悉的安全感
分享热汤
我们两支汤匙一个碗
左心房暖暖的好饱满

【主歌2】
我想说其实你很好
你自己却不知道
真心的对我好
不要求回报
爱一个人希望他过更好
打从心里暖暖的
你比自己更重要

【副歌】
细腻的喜欢
毛毯般的厚重感
晒过太阳熟悉的安全感
分享热汤
我们两支汤匙一个碗
左心房暖暖的好饱满

【桥段】
我想说其实你很好
你自己却不知道
真心的对我好
不要求回报
爱一个人希望他过更好
打从心里暖暖的
你比自己更重要

【结尾】
都可以随便的
你说的我都愿意去
回忆里满足的旋律
都可以是真的
你说的我都会相信
因为我完全信任你`
};

const generateStylePrompt = (style) => {
  return `曲风：${style.genre}，情绪：${style.mood}，人声：${style.vocalType}，BPM：${style.bpm}，乐器配置：${style.instruments.join('、')}，和声：${style.harmony}，混音风格：${style.mixingStyle}`;
};

const generateMelodyPrompt = (melody) => {
  return `音域：${melody.pitchRange.min}-${melody.pitchRange.max}，平均音符时长：${melody.avgDuration}秒，音程特征：${melody.intervals.join('、')}，力度变化：${melody.dynamics.join('、')}，节奏模式：${melody.rhythmPattern}`;
};

app.get('/api/test/nuannuan', (req, res) => {
  res.json({
    success: true,
    data: NUAN_NUAN_DATA
  });
});

app.post('/api/test/analyze-style', async (req, res) => {
  // 模拟DeepSeek风格分析
  const result = {
    success: true,
    data: {
      stylePrompt: generateStylePrompt(NUAN_NUAN_DATA.style),
      analysis: NUAN_NUAN_DATA.style
    }
  };
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  res.json(result);
});

app.post('/api/test/analyze-melody', async (req, res) => {
  // 模拟DeepSeek旋律分析
  const result = {
    success: true,
    data: {
      melodyPrompt: generateMelodyPrompt(NUAN_NUAN_DATA.melody),
      features: NUAN_NUAN_DATA.melody
    }
  };
  
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  res.json(result);
});

app.post('/api/test/generate-lyrics', async (req, res) => {
  // 模拟DeepSeek歌词生成
  const generatedLyrics = `【前奏】

【主歌1】
轻轻的吹过风
像你温柔的问候
阳光洒落在肩膀
暖暖的感觉在心头
每一次见到你
心跳都加速跳动

【副歌】
甜蜜的爱恋
像冬日里的温暖
咖啡的香气弥漫在空气
手牵手走
我们并肩走过四季
心中充满暖暖的幸福

【主歌2】
我想说你真的很好
你总是那么体贴
默默的付出爱
从来不求回报
爱一个人就想他开心
从心里暖暖的
你是最重要的存在

【副歌】
甜蜜的爱恋
像冬日里的温暖
咖啡的香气弥漫在空气
手牵手走
我们并肩走过四季
心中充满暖暖的幸福

【桥段】
我想说你真的很好
你总是那么体贴
默默的付出爱
从来不求回报
爱一个人就想他开心
从心里暖暖的
你是最重要的存在

【结尾】
轻轻的吹过风
像你温柔的问候
回忆里幸福的旋律
每一次想到你
脸上都露出笑容
因为我深深爱着你`;

  const result = {
    success: true,
    data: {
      lyrics: generatedLyrics,
      sensitiveWords: []
    }
  };
  
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  res.json(result);
});

app.post('/api/test/generate-song', async (req, res) => {
  // 模拟MiniMax歌曲生成
  const result = {
    success: true,
    data: {
      taskId: 'task-20260520001',
      title: '暖暖的爱',
      audioUrl: '/outputs/nuannuan-parody.mp3',
      duration: 258,
      status: 'completed'
    }
  };
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  res.json(result);
});

app.post('/api/test/plagiarism-check', async (req, res) => {
  // 模拟侵权检测
  const result = {
    success: true,
    data: {
      riskLevel: 'low',
      audioSimilarity: 0.22,
      melodySimilarity: 0.18,
      similarSegments: [],
      suggestions: ['歌曲原创性良好，可安全使用']
    }
  };
  
  await new Promise(resolve => setTimeout(resolve, 800));
  
  res.json(result);
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`)
  console.log(`📊 健康检查: http://localhost:${PORT}/api/health`)
})

export default app
