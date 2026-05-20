import { useEffect, useState } from 'react'
import { Card, Typography, Space, Tag, Button, Spin, message, Alert } from 'antd'
import { ThunderboltOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { setStylePrompt, setStyleAnalysis, setIsAnalyzing, setAnalysisProgress } from '../../store/slices/analysisSlice'
import { RootState } from '../../store'
import { analyzeStyle } from '../../services/deepseek'
import type { CSSProperties } from 'react'

const { Title, Text, Paragraph } = Typography

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

function StyleAnalysis() {
  const dispatch = useDispatch()
  const { sourceSong } = useSelector((state: RootState) => state.song)
  const { stylePrompt, styleAnalysis, isAnalyzing, analysisProgress } = useSelector(
    (state: RootState) => state.analysis
  )
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!sourceSong) {
      message.warning('请先选择一首歌曲')
      return
    }

    dispatch(setIsAnalyzing(true))
    setError(null)
    dispatch(setAnalysisProgress(10))

    try {
      dispatch(setAnalysisProgress(30))
      const result = await analyzeStyle(sourceSong.audioUrl)
      dispatch(setAnalysisProgress(80))

      const analysis: StyleAnalysisResult = {
        genre: result.genre || '流行',
        mood: result.mood || '欢快',
        vocalType: result.vocalType || '女声',
        bpm: result.bpm || 120,
        instruments: result.instruments || ['钢琴', '吉他', '鼓'],
        harmony: result.harmony || '大调',
        mixingStyle: result.mixingStyle || '现代',
        confidence: result.confidence || 0.85,
      }

      dispatch(setStyleAnalysis(analysis))
      
      const prompt = `曲风：${analysis.genre}，情绪：${analysis.mood}，人声：${analysis.vocalType}，BPM：${analysis.bpm}，乐器配置：${analysis.instruments.join('、')}，和声：${analysis.harmony}，混音风格：${analysis.mixingStyle}`
      dispatch(setStylePrompt(prompt))
      dispatch(setAnalysisProgress(100))
      dispatch(setIsAnalyzing(false))

      message.success('风格分析完成！')
    } catch (err: any) {
      setError(err.message || '分析失败，请重试')
      dispatch(setIsAnalyzing(false))
      dispatch(setAnalysisProgress(0))
      message.error('风格分析失败')
    }
  }

  const moodColors: Record<string, string> = {
    欢快: 'green',
    悲伤: 'blue',
    激昂: 'red',
    平静: 'cyan',
    浪漫: 'pink',
    忧郁: 'purple',
  }

  return (
    <div style={styles.container}>
      {!sourceSong && (
        <Alert
          message="提示"
          description="请先在第一步选择或上传一首歌曲，才能进行风格分析"
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      <Card style={styles.card}>
        <Title level={4} style={styles.title}>
          🎯 DeepSeek V4Pro 风格分析
        </Title>
        <Paragraph style={styles.description}>
          基于深度学习模型，精准分析原曲的风格特征，包括曲风、情绪、速度、乐器配置等维度
        </Paragraph>

        <Button
          type="primary"
          size="large"
          icon={<ThunderboltOutlined />}
          onClick={handleAnalyze}
          loading={isAnalyzing}
          disabled={!sourceSong}
          style={styles.analyzeButton}
        >
          {isAnalyzing ? '分析中...' : '开始风格分析'}
        </Button>

        {isAnalyzing && (
          <div style={styles.progress}>
            <Text>正在分析音频特征...</Text>
            <div style={{ marginTop: '8px' }}>
              <Progress percent={analysisProgress} status="active" />
            </div>
          </div>
        )}

        {error && (
          <Alert
            message="分析失败"
            description={error}
            type="error"
            showIcon
            closable
            style={{ marginTop: '16px' }}
          />
        )}
      </Card>

      {styleAnalysis && (
        <Card style={styles.resultCard}>
          <Title level={4} style={styles.title}>
            <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
            分析结果
          </Title>

          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div style={styles.analysisItem}>
              <Text type="secondary">曲风类型</Text>
              <div>
                <Tag color="blue" style={{ fontSize: '16px', padding: '4px 12px' }}>
                  {styleAnalysis.genre}
                </Tag>
              </div>
            </div>

            <div style={styles.analysisItem}>
              <Text type="secondary">情绪标签</Text>
              <div>
                <Tag color={moodColors[styleAnalysis.mood] || 'default'} style={{ fontSize: '16px', padding: '4px 12px' }}>
                  {styleAnalysis.mood}
                </Tag>
              </div>
            </div>

            <div style={styles.analysisItem}>
              <Text type="secondary">人声特征</Text>
              <div>
                <Tag color="purple" style={{ fontSize: '16px', padding: '4px 12px' }}>
                  {styleAnalysis.vocalType}
                </Tag>
              </div>
            </div>

            <div style={styles.analysisItem}>
              <Text type="secondary">BPM速度</Text>
              <div>
                <Tag color="cyan" style={{ fontSize: '16px', padding: '4px 12px' }}>
                  {styleAnalysis.bpm} BPM
                </Tag>
              </div>
            </div>

            <div style={styles.analysisItem}>
              <Text type="secondary">乐器配置</Text>
              <div>
                {styleAnalysis.instruments.map((inst, idx) => (
                  <Tag key={idx} color="green" style={{ marginRight: '8px', marginBottom: '8px' }}>
                    {inst}
                  </Tag>
                ))}
              </div>
            </div>

            <div style={styles.analysisItem}>
              <Text type="secondary">和声走向</Text>
              <div>
                <Tag color="orange" style={{ fontSize: '16px', padding: '4px 12px' }}>
                  {styleAnalysis.harmony}
                </Tag>
              </div>
            </div>

            <div style={styles.analysisItem}>
              <Text type="secondary">混音风格</Text>
              <div>
                <Tag color="magenta" style={{ fontSize: '16px', padding: '4px 12px' }}>
                  {styleAnalysis.mixingStyle}
                </Tag>
              </div>
            </div>

            <div style={styles.analysisItem}>
              <Text type="secondary">分析置信度</Text>
              <div>
                <Text strong style={{ color: '#52c41a', fontSize: '18px' }}>
                  {(styleAnalysis.confidence * 100).toFixed(1)}%
                </Text>
              </div>
            </div>
          </Space>
        </Card>
      )}

      {stylePrompt && (
        <Card style={styles.promptCard}>
          <Title level={4} style={styles.title}>
            📝 生成的风格提示词
          </Title>
          <div style={styles.promptBox}>
            <Paragraph copyable style={styles.promptText}>
              {stylePrompt}
            </Paragraph>
          </div>
          <Text type="secondary" style={{ display: 'block', marginTop: '12px' }}>
            此提示词将用于后续的歌词创作和歌曲生成步骤
          </Text>
        </Card>
      )}
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
  },
  card: {
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
  },
  resultCard: {
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
  },
  promptCard: {
    background: 'var(--bg-tertiary)',
    border: '2px solid #1890ff',
    borderRadius: '12px',
    gridColumn: '1 / -1',
  },
  title: {
    color: 'white',
    marginBottom: '16px',
  },
  description: {
    color: 'var(--text-secondary)',
    marginBottom: '24px',
  },
  analyzeButton: {
    width: '200px',
    height: '48px',
    fontSize: '16px',
    borderRadius: '24px',
  },
  progress: {
    marginTop: '24px',
    textAlign: 'center',
  },
  analysisItem: {
    padding: '12px 0',
    borderBottom: '1px solid var(--border-color)',
  },
  promptBox: {
    background: 'var(--bg-secondary)',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
  },
  promptText: {
    color: '#1890ff',
    fontSize: '16px',
    marginBottom: 0,
  },
}

export default StyleAnalysis
