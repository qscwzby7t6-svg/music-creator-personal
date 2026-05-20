import { useState } from 'react'
import { Card, Typography, Input, Button, Alert, Tag, Space, message } from 'antd'
import { ThunderboltOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { setLyrics } from '../../store/slices/generationSlice'
import { setIsAnalyzing, setAnalysisProgress } from '../../store/slices/analysisSlice'
import { generateLyrics, checkSensitiveWords } from '../../services/deepseek'
import type { CSSProperties } from 'react'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

function LyricGeneration() {
  const dispatch = useDispatch()
  const { stylePrompt, melodyPrompt } = useSelector((state: RootState) => state.analysis)
  const { lyrics } = useSelector((state: RootState) => state.generation)
  const [customLyrics, setCustomLyrics] = useState(lyrics)
  const [isGenerating, setIsGeneratingState] = useState(false)
  const [sensitiveWords, setSensitiveWords] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!stylePrompt || !melodyPrompt) {
      message.warning('请先完成风格分析和旋律分析')
      return
    }

    setIsGeneratingState(true)
    setError(null)
    dispatch(setAnalysisProgress(10))

    try {
      dispatch(setAnalysisProgress(30))
      const result = await generateLyrics(stylePrompt, melodyPrompt)
      dispatch(setAnalysisProgress(80))

      setCustomLyrics(result.lyrics)
      setSensitiveWords(result.sensitiveWords || [])
      dispatch(setLyrics(result.lyrics))
      dispatch(setAnalysisProgress(100))
      setIsGeneratingState(false)

      if (result.sensitiveWords && result.sensitiveWords.length > 0) {
        message.warning('检测到敏感词，已自动替换')
      } else {
        message.success('歌词生成完成！')
      }
    } catch (err: any) {
      setError(err.message || '生成失败')
      setIsGeneratingState(false)
      dispatch(setAnalysisProgress(0))
      message.error('歌词生成失败')
    }
  }

  const handleCustomChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setCustomLyrics(value)
    dispatch(setLyrics(value))
    
    const words = checkSensitiveWords(value)
    setSensitiveWords(words)
  }

  const wordCount = customLyrics.trim() ? customLyrics.trim().split(/\s+/).length : 0

  return (
    <div style={styles.container}>
      {!melodyPrompt && (
        <Alert
          message="请先完成旋律分析"
          description="在进行歌词创作之前，请先完成风格分析和旋律分析"
          type="warning"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      <Card style={styles.card}>
        <Title level={4} style={styles.title}>
          ✍️ 歌词创作
        </Title>
        <Paragraph style={styles.description}>
          基于已分析的风格提示词和旋律提示词，使用DeepSeek V4Pro生成符合音乐风格的原创歌词
        </Paragraph>

        <Button
          type="primary"
          size="large"
          icon={<ThunderboltOutlined />}
          onClick={handleGenerate}
          loading={isGenerating}
          disabled={!melodyPrompt}
          style={styles.generateButton}
        >
          {isGenerating ? 'AI创作中...' : 'AI智能创作歌词'}
        </Button>

        {error && (
          <Alert
            message="生成失败"
            description={error}
            type="error"
            showIcon
            closable
            style={{ marginTop: '16px' }}
          />
        )}
      </Card>

      <Card style={styles.lyricsCard}>
        <div style={styles.lyricsHeader}>
          <Title level={4} style={styles.title}>
            📄 歌词编辑
          </Title>
          <Space>
            <Text type="secondary">字数统计：{wordCount}</Text>
            <Text type="secondary">|</Text>
            <Text type="secondary">
              建议长度：200-400字
            </Text>
          </Space>
        </div>

        <TextArea
          value={customLyrics}
          onChange={handleCustomChange}
          placeholder="在此编辑歌词，或使用上方AI自动生成...

【前奏】(8秒)

【主歌1】
歌词内容...

【副歌】
高潮部分...

【主歌2】
...

【副歌】
...

【桥段】
...

【结尾】
..."
          rows={16}
          style={styles.textarea}
        />

        <Text type="secondary" style={{ display: 'block', marginTop: '12px' }}>
          提示：歌词应包含主歌、副歌、桥段等结构，建议每段4-8句，整体200-400字
        </Text>
      </Card>

      {sensitiveWords.length > 0 && (
        <Card style={styles.warningCard}>
          <Title level={4} style={{ color: '#faad14', marginBottom: '16px' }}>
            <WarningOutlined /> 敏感词提醒
          </Title>
          <Alert
            message="检测到以下敏感词"
            description={
              <div>
                <Space wrap>
                  {sensitiveWords.map((word, idx) => (
                    <Tag key={idx} color="warning">
                      {word}
                    </Tag>
                  ))}
                </Space>
                <Paragraph style={{ marginTop: '12px', marginBottom: 0, color: 'var(--text-secondary)' }}>
                  请修改或删除这些词汇，以确保内容合规
                </Paragraph>
              </div>
            }
            type="warning"
            showIcon
          />
        </Card>
      )}

      {customLyrics && sensitiveWords.length === 0 && (
        <Card style={styles.successCard}>
          <Alert
            message={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            description={
              <Text style={{ color: '#52c41a' }}>
                歌词审核通过，未检测到敏感词汇
              </Text>
            }
            type="success"
            showIcon
          />
        </Card>
      )}

      <Card style={styles.referenceCard}>
        <Title level={4} style={styles.title}>
          📋 参考信息
        </Title>
        <div style={styles.referenceItem}>
          <Text type="secondary">风格提示词：</Text>
          <Tag color="blue">{stylePrompt || '未设置'}</Tag>
        </div>
        <div style={{ marginTop: '12px' }}>
          <Text type="secondary">旋律提示词：</Text>
          <Tag color="purple">{melodyPrompt || '未设置'}</Tag>
        </div>
      </Card>
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
  lyricsCard: {
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    gridColumn: '1 / -1',
  },
  warningCard: {
    background: 'var(--bg-tertiary)',
    border: '2px solid #faad14',
    borderRadius: '12px',
  },
  successCard: {
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
  },
  referenceCard: {
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
  },
  title: {
    color: 'white',
    marginBottom: '16px',
  },
  description: {
    color: 'var(--text-secondary)',
    marginBottom: '24px',
  },
  generateButton: {
    width: '240px',
    height: '48px',
    fontSize: '16px',
    borderRadius: '24px',
  },
  lyricsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  textarea: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '16px',
    lineHeight: '2',
    resize: 'vertical',
  },
  referenceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
}

export default LyricGeneration
