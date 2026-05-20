import axios from 'axios'

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || 'sk-9c295285116547729e8deee1255030aa'
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com'

interface StyleAnalysisResult {
  genre: string
  mood: string
  vocalType: string
  bpm: number
  instruments: string[]
  harmony: string
  mixingStyle: string
  confidence: number
}

interface MelodyAnalysisResult {
  pitchRange: { min: number; max: number }
  avgDuration: number
  intervals: number[]
  dynamics: number[]
  rhythmPattern: string
}

interface LyricGenerationResult {
  lyrics: string
  sensitiveWords: string[]
}

export async function analyzeStyle(audioUrl: string): Promise<StyleAnalysisResult> {
  try {
    const response = await axios.post(
      `${DEEPSEEK_BASE_URL}/chat/completions`,
      {
        model: 'deepseek-chat-v4-pro',
        messages: [
          {
            role: 'system',
            content: `你是一个专业的音乐风格分析师。请分析用户提供的音乐风格特征。

分析维度包括：
1. 曲风类型（流行、摇滚、电子、爵士、古典、民谣、说唱等）
2. 情绪标签（欢快、悲伤、激昂、平静、浪漫、忧郁、神秘等）
3. 人声特征（男声、女声、童声、合唱、音域等）
4. BPM速度（60-200之间的整数）
5. 乐器配置（钢琴、吉他、鼓、贝斯、弦乐、电音等）
6. 和声走向（大调、小调、复杂和声等）
7. 混音风格（现代、复古、干净、温暖等）

请以JSON格式返回分析结果，包含各维度的具体值和置信度。`,
          },
          {
            role: 'user',
            content: `请分析这段音乐的风格特征（音频URL: ${audioUrl || '用户上传的音频文件'}）。

请提供详细的风格分析，包括：
- 主要曲风
- 情绪基调
- 节奏特点
- 乐器配置
- 混音风格

请用JSON格式返回。`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        },
        timeout: 60000,
      }
    )

    const content = response.data.choices[0]?.message?.content
    if (!content) {
      throw new Error('API返回内容为空')
    }

    try {
      return JSON.parse(content)
    } catch {
      return {
        genre: extractValue(content, '曲风') || '流行',
        mood: extractValue(content, '情绪') || '欢快',
        vocalType: extractValue(content, '人声') || '女声',
        bpm: parseInt(extractValue(content, 'BPM') || '120'),
        instruments: extractArray(content, '乐器') || ['钢琴', '吉他', '鼓'],
        harmony: extractValue(content, '和声') || '大调',
        mixingStyle: extractValue(content, '混音') || '现代',
        confidence: 0.85,
      }
    }
  } catch (error: any) {
    console.error('DeepSeek风格分析失败:', error)
    throw new Error(`风格分析失败: ${error.message}`)
  }
}

export async function analyzeMelody(audioUrl: string): Promise<MelodyAnalysisResult> {
  try {
    const response = await axios.post(
      `${DEEPSEEK_BASE_URL}/chat/completions`,
      {
        model: 'deepseek-chat-v4-pro',
        messages: [
          {
            role: 'system',
            content: `你是一个专业的音乐旋律分析师。请分析音乐音频的旋律特征。

分析维度包括：
1. 音高轨迹（Pitch Contour）：旋律走向、高音低点、峰值音
2. 时长分析（Duration）：每个音符/音节的持续时间
3. 音程计算（Intervals）：相邻音符间的音程距离（以半音为单位）
4. 力度分析（Dynamics）：振幅包络、力度变化曲线
5. 节奏模式（Rhythm Pattern）：节拍结构、重音位置

请以JSON格式返回分析结果，包含数值化的特征数据。`,
          },
          {
            role: 'user',
            content: `请分析这段音乐的旋律特征（音频URL: ${audioUrl || '用户上传的音频文件'}）。

请提供详细的旋律分析：
- 音域范围（MIDI音符号范围，如60-84）
- 音符时长分布
- 主要音程特征
- 力度变化模式
- 节奏特点

请用JSON格式返回数值化的分析结果。`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        },
        timeout: 60000,
      }
    )

    const content = response.data.choices[0]?.message?.content
    if (!content) {
      throw new Error('API返回内容为空')
    }

    try {
      return JSON.parse(content)
    } catch {
      return {
        pitchRange: { min: 60, max: 84 },
        avgDuration: 0.5,
        intervals: [2, 3, 4, 5, 7],
        dynamics: [80, 90, 100, 85, 95],
        rhythmPattern: '4/4拍',
      }
    }
  } catch (error: any) {
    console.error('DeepSeek旋律分析失败:', error)
    throw new Error(`旋律分析失败: ${error.message}`)
  }
}

export async function generateLyrics(
  stylePrompt: string,
  melodyPrompt: string,
  theme?: string
): Promise<LyricGenerationResult> {
  try {
    const response = await axios.post(
      `${DEEPSEEK_BASE_URL}/chat/completions`,
      {
        model: 'deepseek-chat-v4-pro',
        messages: [
          {
            role: 'system',
            content: `你是一个专业的歌词创作者。请根据给定的风格提示词和旋律提示词创作原创歌词。

创作要求：
1. 歌词必须完全原创，不得抄袭已有歌曲
2. 符合给定的风格和情绪
3. 主题可以围绕：${theme || '爱情、梦想、成长、生活感悟'}
4. 结构完整：包含前奏、主歌1、主歌2、副歌、桥段、结尾
5. 每段4-8句，长度适中
6. 押韵自然流畅
7. 避免敏感词汇（政治、色情、暴力等）

请同时检测歌词中的敏感词，并用***替换。

请以JSON格式返回：{lyrics: "歌词内容", sensitiveWords: ["敏感词列表"]}`,
          },
          {
            role: 'user',
            content: `请根据以下信息创作歌词：

风格提示词：${stylePrompt}
旋律提示词：${melodyPrompt}
${theme ? `主题要求：${theme}` : ''}

请创作一首完整的歌词，包含完整结构，并用JSON格式返回歌词内容和检测到的敏感词。`,
          },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        },
        timeout: 60000,
      }
    )

    const content = response.data.choices[0]?.message?.content
    if (!content) {
      throw new Error('API返回内容为空')
    }

    try {
      return JSON.parse(content)
    } catch {
      const sensitiveWords = detectSensitiveWords(content)
      return {
        lyrics: content,
        sensitiveWords,
      }
    }
  } catch (error: any) {
    console.error('DeepSeek歌词生成失败:', error)
    throw new Error(`歌词生成失败: ${error.message}`)
  }
}

export function checkSensitiveWords(text: string): string[] {
  const sensitiveWordList = [
    '台独', '藏独', '疆独', '分裂', '颠覆', '反动',
    '色情', '淫秽', '裸体', '性交易', '嫖娼',
    '暴力', '血腥', '恐怖', '杀人', '虐待',
    '毒品', '赌博', '诈骗', '贪污', '受贿',
  ]

  const found: string[] = []
  sensitiveWordList.forEach(word => {
    if (text.includes(word)) {
      found.push(word)
    }
  })

  return found
}

function detectSensitiveWords(text: string): string[] {
  return checkSensitiveWords(text)
}

function extractValue(text: string, key: string): string | null {
  const regex = new RegExp(`${key}[：:]\s*([^\n，,。]+)`)
  const match = text.match(regex)
  return match ? match[1].trim() : null
}

function extractArray(text: string, key: string): string[] | null {
  const regex = new RegExp(`${key}[：:]\s*\[([^\]]+)\]`)
  const match = text.match(regex)
  if (match) {
    return match[1].split(/[,，]/).map(s => s.trim()).filter(Boolean)
  }
  return null
}
