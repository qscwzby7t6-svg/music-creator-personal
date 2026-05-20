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
