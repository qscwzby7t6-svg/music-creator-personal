import { useState, useEffect } from 'react'
import { Card, Typography, Button, Progress, Alert, Space, Tag, Descriptions, message } from 'antd'
import { ThunderboltOutlined, CheckCircleOutlined, AudioOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { setGeneratedSong, setGenerationProgress, setIsGenerating, setPlagiarismReport } from '../../store/slices/generationSlice'
import { RootState } from '../../store'
import { generateSong } from '../../services/minimax'
import { checkPlagiarism } from '../../services/plagiarism'
import type { CSSProperties } from 'react'

const { Title, Text, Paragraph } = Typography

function SongGeneration() {
  const dispatch = useDispatch()
  const { stylePrompt, melodyPrompt } = useSelector((state: RootState) => state.analysis)
  const { lyrics, generatedSong, generationProgress, isGenerating, plagiarismReport } = useSelector(
    (state: RootState) => state.generation
  )
  const { defaultDuration } = useSelector((state: RootState) => state.settings)
  const [error, setError] = useState<string | null>(null)
  const [generationStatus, setGenerationStatus] = useState<string>('idle')

  const handleGenerate = async () => {
    if (!stylePrompt || !melodyPrompt || !lyrics) {
      message.warning('请确保已完成风格分析、旋律分析和歌词创作')
      return
    }

    dispatch(setIsGenerating(true))
    setError(null)
    dispatch(setGenerationProgress(0))
    setGenerationStatus('generating')

    try {
      for (let i = 0; i <= 100; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 500))
        dispatch(setGenerationProgress(i))
      }

      const result = await generateSong({
        stylePrompt,
        melodyPrompt,
        lyrics,
        duration: defaultDuration,
      })

      dispatch(setGeneratedSong({
        id: result.id,
        title: result.title || 'AI生成歌曲',
        audioUrl: result.audioUrl,
        duration: result.duration || defaultDuration[1],
        format: 'mp3',
        createdAt: new Date().toISOString(),
      }))

      dispatch(setGenerationProgress(100))
      setGenerationStatus('plagiarism_check')

      const plagiarismResult = await checkPlagiarism(result.audioUrl)
      dispatch(setPlagiarismReport(plagiarismResult))

      dispatch(setIsGenerating(false))
      setGenerationStatus('completed')

      message.success('歌曲生成完成！正在进行侵权检测...')

    } catch (err: any) {
      setError(err.message || '生成失败')
      dispatch(setIsGenerating(false))
      dispatch(setGenerationProgress(0))
      setGenerationStatus('failed')
      message.error('歌曲生成失败')
    }
  }

  const riskLevelColors = {
    low: 'green',
    medium: 'orange',
    high: 'red',
  }

  const riskLevelText = {
    low: '低风险',
    medium: '中等风险',
    high: '高风险',
  }

  return (
    <div style={styles.container}>
      {!lyrics && (
        <Alert
          message="请先完成歌词创作"
          description="在进行歌曲生成之前，请先完成歌词创作"
          type="warning"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      <Card style={styles.card}>
        <Title level={4} style={styles.title}>
          🎵 MiniMax music-2.6 歌曲生成
        </Title>
        <Paragraph style={styles.description}>
          结合风格提示词、旋律提示词和原创歌词，使用MiniMax music-2.6 AI模型合成完整歌曲
        </Paragraph>

        <Descriptions column={1} size="small" style={{ marginBottom: '24px' }}>
          <Descriptions.Item label="歌曲时长">
            <Tag color="blue">{defaultDuration[0] / 60}-{defaultDuration[1] / 60} 分钟</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="输出格式">
            <Space>
              <Tag color="green">MP3</Tag>
              <Tag color="cyan">WAV</Tag>
            </Space>
          </Descriptions.Item>
        </Descriptions>

        <Button
          type="primary"
          size="large"
          icon={<ThunderboltOutlined />}
          onClick={handleGenerate}
          loading={isGenerating}
          disabled={!lyrics}
          style={styles.generateButton}
        >
          {isGenerating ? '生成中...' : '开始生成歌曲'}
        </Button>

        {isGenerating && (
          <div style={styles.progressSection}>
            <div style={styles.statusText}>
              <Text style={{ color: 'white' }}>
                {generationStatus === 'generating' && '正在合成音频...'}
                {generationStatus === 'plagiarism_check' && '正在进行侵权检测...'}
              </Text>
            </div>
            <Progress
              percent={generationProgress}
              status="active"
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
            <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
              {generationProgress < 100 ? `已完成 ${generationProgress}%` : '生成完成！'}
            </Text>
          </div>
        )}

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

      {generatedSong && (
        <Card style={styles.previewCard}>
          <Title level={4} style={styles.title}>
            <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
            生成结果预览
          </Title>

          <Card style={styles.audioCard}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div style={styles.audioInfo}>
                <AudioOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                <div style={{ marginLeft: '16px' }}>
                  <Title level={5} style={{ color: 'white', marginBottom: '8px' }}>
                    {generatedSong.title}
                  </Title>
                  <Text type="secondary">
                    时长：{Math.floor(generatedSong.duration / 60)}:{(generatedSong.duration % 60).toString().padStart(2, '0')}
                  </Text>
                  <br />
                  <Text type="secondary">格式：{generatedSong.format.toUpperCase()}</Text>
                </div>
              </div>
              <Button type="primary" icon={<AudioOutlined />} onClick={() => window.open(generatedSong.audioUrl, '_blank')}>
                播放预览
              </Button>
            </Space>
          </Card>
        </Card>
      )}

      {plagiarismReport && (
        <Card style={styles.reportCard}>
          <Title level={4} style={styles.title}>
            🔍 侵权检测报告
          </Title>

          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="风险等级">
              <Tag color={riskLevelColors[plagiarismReport.riskLevel]} style={{ fontSize: '16px', padding: '4px 16px' }}>
                {riskLevelText[plagiarismReport.riskLevel]}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="音频相似度">
              <Text style={{ color: plagiarismReport.audioSimilarity > 30 ? '#ff4d4f' : '#52c41a' }}>
                {(plagiarismReport.audioSimilarity * 100).toFixed(1)}%
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="旋律相似度">
              <Text style={{ color: plagiarismReport.melodySimilarity > 30 ? '#ff4d4f' : '#52c41a' }}>
                {(plagiarismReport.melodySimilarity * 100).toFixed(1)}%
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="相似片段数">
              <Text>{plagiarismReport.similarSegments.length}</Text>
            </Descriptions.Item>
          </Descriptions>

          {plagiarismReport.similarSegments.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <Text type="secondary" style={{ display: 'block', marginBottom: '12px' }}>
                相似片段详情：
              </Text>
              {plagiarismReport.similarSegments.map((seg, idx) => (
                <Tag key={idx} color="orange" style={{ marginRight: '8px', marginBottom: '8px' }}>
                  {seg.start.toFixed(1)}s - {seg.end.toFixed(1)}s ({(seg.similarity * 100).toFixed(1)}%)
                </Tag>
              ))}
            </div>
          )}

          {plagiarismReport.suggestions.length > 0 && (
            <Alert
              message="优化建议"
              description={
                <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                  {plagiarismReport.suggestions.map((suggestion, idx) => (
                    <li key={idx} style={{ color: 'var(--text-secondary)' }}>{suggestion}</li>
                  ))}
                </ul>
              }
              type={plagiarismReport.riskLevel === 'high' ? 'error' : plagiarismReport.riskLevel === 'medium' ? 'warning' : 'info'}
              showIcon
              style={{ marginTop: '24px' }}
            />
          )}
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
  previewCard: {
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
  },
  reportCard: {
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
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
  generateButton: {
    width: '240px',
    height: '48px',
    fontSize: '16px',
    borderRadius: '24px',
  },
  progressSection: {
    marginTop: '32px',
    padding: '24px',
    background: 'var(--bg-secondary)',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
  },
  statusText: {
    marginBottom: '16px',
    textAlign: 'center',
  },
  audioCard: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '24px',
  },
  audioInfo: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 0',
  },
}

export default SongGeneration
