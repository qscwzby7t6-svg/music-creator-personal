import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

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
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.mp3', '.wav', '.m4a', '.flac']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowedTypes.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error('不支持的文件类型'))
    }
  },
})

const hotSongs = [
  {
    id: '1',
    title: '起风了',
    artist: '买辣椒也用券',
    duration: 285,
    coverUrl: 'https://p2.music.126.net/VkGpqUQRk3L8Qv6T6g2kCQ==/109951166950853327.jpg',
    audioUrl: '',
    playCount: 10000000,
    category: 'chinese',
  },
  {
    id: '2',
    title: '孤勇者',
    artist: '陈奕迅',
    duration: 240,
    coverUrl: 'https://p2.music.126.net/VkGpqUQRk3L8Qv6T6g2kCQ==/109951166950853327.jpg',
    audioUrl: '',
    playCount: 9500000,
    category: 'chinese',
  },
  {
    id: '3',
    title: '晴天',
    artist: '周杰伦',
    duration: 267,
    coverUrl: 'https://p2.music.126.net/VkGpqUQRk3L8Qv6T6g2kCQ==/109951166950853327.jpg',
    audioUrl: '',
    playCount: 8900000,
    category: 'chinese',
  },
  {
    id: '4',
    title: 'See You Again',
    artist: 'Wiz Khalifa',
    duration: 237,
    coverUrl: 'https://p2.music.126.net/VkGpqUQRk3L8Qv6T6g2kCQ==/109951166950853327.jpg',
    audioUrl: '',
    playCount: 8500000,
    category: 'western',
  },
  {
    id: '5',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    duration: 234,
    coverUrl: 'https://p2.music.126.net/VkGpqUQRk3L8Qv6T6g2kCQ==/109951166950853327.jpg',
    audioUrl: '',
    playCount: 8200000,
    category: 'western',
  },
  {
    id: '6',
    title: '稻香',
    artist: '周杰伦',
    duration: 228,
    coverUrl: 'https://p2.music.126.net/VkGpqUQRk3L8Qv6T6g2kCQ==/109951166950853327.jpg',
    audioUrl: '',
    playCount: 7800000,
    category: 'chinese',
  },
]

router.get('/hot', (req, res) => {
  const { category, limit = 20 } = req.query
  let result = hotSongs

  if (category && category !== 'all') {
    result = hotSongs.filter(song => song.category === category)
  }

  res.json({
    success: true,
    data: result.slice(0, Number(limit)),
  })
})

router.get('/search', (req, res) => {
  const { q } = req.query

  if (!q) {
    return res.json({
      success: false,
      message: '请提供搜索关键词',
    })
  }

  const query = (q as string).toLowerCase()
  const results = hotSongs.filter(
    song =>
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query)
  )

  res.json({
    success: true,
    data: results,
  })
})

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: '请上传文件',
    })
  }

  const song = {
    id: uuidv4(),
    title: req.file.originalname.replace(/\.[^/.]+$/, ''),
    artist: '本地文件',
    duration: 0,
    coverUrl: '',
    audioUrl: `/uploads/${req.file.filename}`,
    category: 'local',
  }

  res.json({
    success: true,
    data: song,
  })
})

router.get('/:id', (req, res) => {
  const song = hotSongs.find(s => s.id === req.params.id)

  if (!song) {
    return res.status(404).json({
      success: false,
      message: '歌曲不存在',
    })
  }

  res.json({
    success: true,
    data: song,
  })
})

export default router
