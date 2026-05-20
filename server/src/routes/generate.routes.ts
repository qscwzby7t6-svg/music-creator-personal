import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'
import minimaxService from '../services/minimax.service.js'
import plagiarismService from '../services/plagiarism.service.js'

const router = Router()

const generationTasks = new Map()

router.post('/song', async (req, res) => {
  try {
    const { stylePrompt, melodyPrompt, lyrics, duration } = req.body

    if (!stylePrompt || !melodyPrompt || !lyrics) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数',
      })
    }

    const taskId = uuidv4()

    generationTasks.set(taskId, {
      status: 'processing',
      progress: 0,
      params: { stylePrompt, melodyPrompt, lyrics, duration },
      createdAt: new Date(),
    })

    res.json({
      success: true,
      data: {
        taskId,
        status: 'processing',
      },
    })

    setTimeout(async () => {
      try {
        const result = await minimaxService.generateSong({
          stylePrompt,
          melodyPrompt,
          lyrics,
          duration: duration || [180, 300],
        })

        generationTasks.set(taskId, {
          status: 'completed',
          progress: 100,
          result,
          createdAt: new Date(),
        })
      } catch (error) {
        generationTasks.set(taskId, {
          status: 'failed',
          progress: 0,
          error: error.message,
          createdAt: new Date(),
        })
      }
    }, 5000)

  } catch (error: any) {
    console.error('歌曲生成错误:', error)
    res.status(500).json({
      success: false,
      message: error.message || '歌曲生成失败',
    })
  }
})

router.get('/status/:taskId', (req, res) => {
  const { taskId } = req.params
  const task = generationTasks.get(taskId)

  if (!task) {
    return res.status(404).json({
      success: false,
      message: '任务不存在',
    })
  }

  res.json({
    success: true,
    data: {
      taskId,
      status: task.status,
      progress: task.progress,
      result: task.result,
      error: task.error,
    },
  })
})

router.get('/download/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params
    const { format = 'mp3' } = req.query

    const task = generationTasks.get(taskId)

    if (!task || task.status !== 'completed') {
      return res.status(404).json({
        success: false,
        message: '歌曲不存在或未生成完成',
      })
    }

    const outputDir = path.join(process.cwd(), 'outputs')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const mockAudioContent = Buffer.alloc(1024 * 100)
    
    res.setHeader('Content-Type', format === 'wav' ? 'audio/wav' : 'audio/mpeg')
    res.setHeader('Content-Disposition', `attachment; filename="${taskId}.${format}"`)
    res.send(mockAudioContent)

  } catch (error: any) {
    console.error('下载错误:', error)
    res.status(500).json({
      success: false,
      message: error.message || '下载失败',
    })
  }
})

router.post('/plagiarism-check', async (req, res) => {
  try {
    const { audioUrl } = req.body

    const report = await plagiarismService.checkPlagiarism(audioUrl)

    res.json({
      success: true,
      data: report,
    })
  } catch (error: any) {
    console.error('侵权检测错误:', error)
    res.status(500).json({
      success: false,
      message: error.message || '侵权检测失败',
    })
  }
})

export default router
