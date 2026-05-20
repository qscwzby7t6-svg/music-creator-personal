import axios from 'axios'

const MINIMAX_API_KEY = import.meta.env.VITE_MINIMAX_API_KEY || 'sk-cp-M8nlgav6xfT4XWypLAVjq9RpxpDua3Uj2RrxlL87Rdx5Db-QKZLqLKYiwAA2PICAbdZcWCdTcIn2_tg_iJdd2AREkarnEE2xS2epcs3LffEPzv1dV5Dd8A4'
const MINIMAX_BASE_URL = 'https://api.minimax.chat/v1'

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

export async function generateSong(params: GenerateSongParams): Promise<GenerateSongResult> {
  const { stylePrompt, melodyPrompt, lyrics, duration } = params

  try {
    const response = await axios.post(
      `${MINIMAX_BASE_URL}/music_generation`,
      {
        model: 'music-2.6',
        style_prompt: stylePrompt,
        melody_prompt: melodyPrompt,
        lyrics: lyrics,
        duration_seconds: {
          min: duration[0],
          max: duration[1],
        },
        output_format: ['mp3', 'wav'],
        callback_url: '',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MINIMAX_API_KEY}`,
        },
        timeout: 180000,
      }
    )

    if (response.data.error) {
      throw new Error(response.data.error.message || 'MiniMax API错误')
    }

    const taskId = response.data.task_id
    
    const result = await pollTaskStatus(taskId)

    return result
  } catch (error: any) {
    console.error('MiniMax歌曲生成失败:', error)
    throw new Error(`歌曲生成失败: ${error.message}`)
  }
}

async function pollTaskStatus(taskId: string, maxAttempts: number = 60): Promise<GenerateSongResult> {
  const pollInterval = 3000
  let attempts = 0

  while (attempts < maxAttempts) {
    try {
      const response = await axios.get(`${MINIMAX_BASE_URL}/music_generation/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${MINIMAX_API_KEY}`,
        },
        timeout: 10000,
      })

      const status = response.data.status

      if (status === 'completed') {
        return {
          id: taskId,
          title: response.data.title || 'AI生成歌曲',
          audioUrl: response.data.audio_url,
          duration: response.data.duration || 240,
        }
      } else if (status === 'failed') {
        throw new Error('歌曲生成任务失败')
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval))
      attempts++
    } catch (error) {
      throw error
    }
  }

  throw new Error('歌曲生成超时')
}

export async function getTaskStatus(taskId: string): Promise<{
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
}> {
  try {
    const response = await axios.get(`${MINIMAX_BASE_URL}/music_generation/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${MINIMAX_API_KEY}`,
      },
      timeout: 10000,
    })

    return {
      status: response.data.status,
      progress: response.data.progress || 0,
    }
  } catch (error: any) {
    console.error('获取任务状态失败:', error)
    throw new Error(`获取状态失败: ${error.message}`)
  }
}

export async function cancelGeneration(taskId: string): Promise<void> {
  try {
    await axios.delete(`${MINIMAX_BASE_URL}/music_generation/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${MINIMAX_API_KEY}`,
      },
      timeout: 10000,
    })
  } catch (error: any) {
    console.error('取消生成任务失败:', error)
    throw new Error(`取消失败: ${error.message}`)
  }
}
