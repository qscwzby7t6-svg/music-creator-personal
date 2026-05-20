import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

interface Song {
  id: string
  title: string
  artist: string
  duration: number
  coverUrl: string
  audioUrl: string
  playCount?: number
  category?: string
}

export async function getHotSongs(params: {
  platform?: string
  category?: string
  limit?: number
}): Promise<Song[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/songs/hot`, {
      params,
    })
    return response.data.data
  } catch (error) {
    console.error('获取热门歌曲失败:', error)
    return []
  }
}

export async function searchSongs(query: string): Promise<Song[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/songs/search`, {
      params: { q: query },
    })
    return response.data.data
  } catch (error) {
    console.error('搜索歌曲失败:', error)
    return []
  }
}

export async function uploadSong(file: File): Promise<Song> {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await axios.post(`${API_BASE_URL}/songs/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
        console.log(`上传进度: ${percent}%`)
      },
    })
    return response.data.data
  } catch (error) {
    console.error('上传歌曲失败:', error)
    throw error
  }
}

export async function getSongById(id: string): Promise<Song | null> {
  try {
    const response = await axios.get(`${API_BASE_URL}/songs/${id}`)
    return response.data.data
  } catch (error) {
    console.error('获取歌曲详情失败:', error)
    return null
  }
}

export async function downloadSong(
  songId: string,
  format: 'mp3' | 'wav'
): Promise<void> {
  try {
    const response = await axios.get(`${API_BASE_URL}/generate/download/${songId}`, {
      params: { format },
      responseType: 'blob',
    })

    const blob = new Blob([response.data])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `song_${songId}.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('下载歌曲失败:', error)
    throw error
  }
}

export async function getUserProjects(): Promise<any[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects`)
    return response.data.data
  } catch (error) {
    console.error('获取项目列表失败:', error)
    return []
  }
}

export async function saveProject(projectData: any): Promise<any> {
  try {
    const response = await axios.post(`${API_BASE_URL}/projects`, projectData)
    return response.data.data
  } catch (error) {
    console.error('保存项目失败:', error)
    throw error
  }
}
