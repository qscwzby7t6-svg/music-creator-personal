import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import deepseekService from '../services/deepseek.service.js'

const router = Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads'))
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
})

router.post('/style', upload.single('audioFile'), async (req, res) => {
  try {
    const audioBuffer = req.file ? req.file.buffer : undefined
    const audioUrl = req.body.audioUrl

    const result = await deepseekService.analyzeStyle(audioBuffer)

    const stylePrompt = `曲风：${result.genre}，情绪：${result.mood}，人声：${result.vocalType}，BPM：${result.bpm}，乐器配置：${result.instruments.join('、')}，和声：${result.harmony}，混音风格：${result.mixingStyle}`

    res.json({
      success: true,
      data: {
        stylePrompt,
        analysis: result,
      },
    })
  } catch (error: any) {
    console.error('风格分析错误:', error)
    res.status(500).json({
      success: false,
      message: error.message || '风格分析失败',
    })
  }
})

router.post('/melody', upload.single('audioFile'), async (req, res) => {
  try {
    const audioBuffer = req.file ? req.file.buffer : undefined
    const audioUrl = req.body.audioUrl

    const result = await deepseekService.analyzeMelody(audioBuffer)

    const melodyPrompt = `音域：${result.pitchRange.min}-${result.pitchRange.max}，平均音符时长：${result.avgDuration}秒，音程特征：${result.intervals.join('、')}音程，力度变化：${result.dynamics.join('、')}，节奏模式：${result.rhythmPattern}，包含${result.intervals.length}种主要音程`

    res.json({
      success: true,
      data: {
        melodyPrompt,
        features: result,
      },
    })
  } catch (error: any) {
    console.error('旋律分析错误:', error)
    res.status(500).json({
      success: false,
      message: error.message || '旋律分析失败',
    })
  }
})

router.post('/lyrics', async (req, res) => {
  try {
    const { stylePrompt, melodyPrompt, theme } = req.body

    if (!stylePrompt || !melodyPrompt) {
      return res.status(400).json({
        success: false,
        message: '缺少风格提示词或旋律提示词',
      })
    }

    const result = await deepseekService.generateLyrics(stylePrompt, melodyPrompt, theme)

    res.json({
      success: true,
      data: {
        lyrics: result.lyrics,
        sensitiveWords: result.sensitiveWords || [],
      },
    })
  } catch (error: any) {
    console.error('歌词生成错误:', error)
    res.status(500).json({
      success: false,
      message: error.message || '歌词生成失败',
    })
  }
})

export default router
