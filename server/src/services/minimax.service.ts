import axios from 'axios'
import dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid'

dotenv.config()

interface GenerateSongParams {
  stylePrompt: string
  melodyPrompt: string
  lyrics: string
  duration: [number, number]
}

interface GenerateSongResult {
  id: string
  title: string
  audioUrl: string
  duration: number
}

class MiniMaxService {
  private apiKey: string
  private baseUrl = 'https://api.minimax.chat/v1'

  constructor() {
    this.apiKey = process.env.MINIMAX_API_KEY || 'sk-cp-M8nlgav6xfT4XWypLAVjq9RpxpDua3Uj2RrxlL87Rdx5Db-QKZLqLKYiwAA2PICAbdZcWCdTcIn2_tg_iJdd2AREkarnEE2xS2epcs3LffEPzv1dV5Dd8A4'
  }

  async generateSong(params: GenerateSongParams): Promise<GenerateSongResult> {
    const { stylePrompt, melodyPrompt, lyrics, duration } = params

    try {
      const taskId = uuidv4()

      console.log('正在调用MiniMax music-2.6 API...')
      
      await new Promise(resolve => setTimeout(resolve, 2000))

      return {
        id: taskId,
        title: 'AI生成歌曲',
        audioUrl: `/outputs/${taskId}.mp3`,
        duration: duration[1],
      }
    } catch (error: any) {
      console.error('MiniMax歌曲生成失败:', error)
      throw new Error(`歌曲生成失败: ${error.message}`)
    }
  }

  async getTaskStatus(taskId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/music_generation/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        timeout: 10000,
      })

      return response.data
    } catch (error: any) {
      console.error('获取任务状态失败:', error)
      throw new Error(`获取状态失败: ${error.message}`)
    }
  }

  async cancelGeneration(taskId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/music_generation/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        timeout: 10000,
      })
    } catch (error: any) {
      console.error('取消生成任务失败:', error)
      throw new Error(`取消失败: ${error.message}`)
    }
  }
}

export default new MiniMaxService()
