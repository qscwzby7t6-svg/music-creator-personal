import { Request, Response, NextFunction } from 'express'

interface Error {
  status?: number
  message?: string
  code?: string
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('错误:', err)

  const statusCode = err.status || 500
  const message = err.message || '服务器内部错误'

  res.status(statusCode).json({
    success: false,
    message,
    code: err.code || 'INTERNAL_ERROR',
    timestamp: new Date().toISOString(),
  })
}

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: '请求的资源不存在',
    code: 'NOT_FOUND',
  })
}
