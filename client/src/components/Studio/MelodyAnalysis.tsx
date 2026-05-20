import { useState } from 'react'
import { Card, Typography, Tag, Button, Alert, Progress, Descriptions } from 'antd'
import { ThunderboltOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { setMelodyPrompt, setMelodyFeatures, setIsAnalyzing, setAnalysisProgress } from '../../store/slices/analysisSlice'
import { RootState } from '../../store'
import { analyzeMelody } from '../../services/deepseek'
import type { CSSProperties } from 'react'

const { Title, Text, Paragraph } = Typography

interface MelodyFeaturesResult {
  pitchRange: { min: number; max: number }
  avgDuration: number
  intervals: number[]
  dynamics: number[]
  rhythmPattern: string
}

function MelodyAnalysis() {
  const dispatch = useDispatch()
  const { sourceSong } = useSelector((state: RootState) => state.song)
  const { stylePrompt, melodyPrompt, melodyFeatures, isAnalyzing, analysisProgress } = useSelector(
    (state: RootState) => state.analysis
  )
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!sourceSong) {
      return
    }

    dispatch(setIsAnalyzing(true))
    setError(null)
    dispatch(setAnalysisProgress(10))

    try {
      dispatch(setAnalysisProgress(30))
      const result = await analyzeMelody(sourceSong.audioUrl)
      dispatch(setAnalysisProgress(80))

      const features: MelodyFeaturesResult = {
        pitchRange: result.pitchRange || { min: 60, max: 84 },
        avgDuration: result.avgDuration || 0.5,
        intervals: result.intervals || [2, 3, 4, 5],
        dynamics: result.dynamics || [80, 90, 100, 85],
        rhythmPattern: result.rhythmPattern || '4/4拍',
      }

      dispatch(setMelodyFeatures(features))
      
      const prompt = `音域：${features.pitchRange.min}-${features.pitchRange.max}，平均音符时长：${features.avgDuration}秒，音程特征：${features.intervals.join('、')}音程，力度变化：${features.dynamics.join('、')}，节奏模式：${features.rhythmPattern}，包含${features.intervals.length}种主要音程`
      dispatch(setMelodyPrompt(prompt))
      dispatch(setAnalysisProgress(100))
      dispatch(setIsAnalyzing(false))

    } catch (err: any) {
      setError(err.message || '分析失败')
      dispatch(setIsAnalyzing(false))
      dispatch(setAnalysisProgress(0))
    }
  }

  const pitchToNote = (midi: number): string => {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const octave = Math.floor(midi / 12) - 1
    const note = notes[midi % 12]
    return `${note}${octave}`
  }

  return (
    <div style={styles.container}>
      {!stylePrompt && (
        <Alert
          message="请先完成风格分析"
          description="在进行旋律分析之前，请先完成第二步的风格分析"
          type="warning"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      <Card style={styles.card}>
        <Title level={4} style={styles.title}>
          🎼 DeepSeek V4Pro 旋律分析
        </Title>
        <Paragraph style={styles.description}>
          提取原曲的旋律特征，包括音高轨迹、时长分布、音程走向、力度变化等，为歌曲生成提供精确的旋律参考
        </Paragraph>

        <Button
          type="primary"
          size="large"
          icon={<ThunderboltOutlined />}
          onClick={handleAnalyze}
          loading={isAnalyzing}
          disabled={!stylePrompt}
          style={styles.analyzeButton}
        >
          {isAnalyzing ? '分析中...' : '开始旋律分析'}
        </Button>

        {isAnalyzing && (
          <div style={styles.progress}>
            <Text>正在提取旋律特征...</Text>
            <Progress percent={analysisProgress} status="active" style={{ marginTop: '8px' }} />
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

      {melodyFeatures && (
        <Card style={styles.resultCard}>
          <Title level={4} style={styles.title}>
            <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
            旋律特征提取结果
          </Title>

          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="音域下限">
              <Tag color="blue">{pitchToNote(melodyFeatures.pitchRange.min)}</Tag>
              <Text type="secondary" style={{ marginLeft: '8px' }}>
                MIDI: {melodyFeatures.pitchRange.min}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="音域上限">
              <Tag color="red">{pitchToNote(melodyFeatures.pitchRange.max)}</Tag>
              <Text type="secondary" style={{ marginLeft: '8px' }}>
                MIDI: {melodyFeatures.pitchRange.max}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="音域跨度">
              <Tag color="purple">{melodyFeatures.pitchRange.max - melodyFeatures.pitchRange.min} 半音</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="平均音符时长">
              <Tag color="cyan">{(melodyFeatures.avgDuration * 1000).toFixed(0)}ms</Tag>
            </Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: '24px' }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: '12px' }}>
              主要音程分布
            </Text>
            <div>
              {melodyFeatures.intervals.map((interval, idx) => (
                <Tag key={idx} color="green" style={{ fontSize: '16px', padding: '8px 16px', marginRight: '12px', marginBottom: '12px' }}>
                  {interval} {interval === 1 ? '度' : interval === 2 ? '度' : interval === 3 ? '度' : interval === 4 ? '度' : interval === 5 ? '度' : '音程'}
                </Tag>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: '12px' }}>
              力度包络曲线
            </Text>
            <div style={styles.dynamicsChart}>
              {melodyFeatures.dynamics.map((dyn, idx) => (
                <div key={idx} style={styles.dynamicsBar}>
                  <div
                    style={{
                      height: `${dyn}%`,
                      background: 'var(--gradient-primary)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease',
                    }}
                  />
                  <Text type="secondary" style={{ fontSize: '10px' }}>
                    {dyn}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <Text type="secondary">节奏模式</Text>
            <div>
              <Tag color="orange" style={{ fontSize: '18px', padding: '8px 20px' }}>
                {melodyFeatures.rhythmPattern}
              </Tag>
            </div>
          </div>
        </Card>
      )}

      {melodyPrompt && (
        <Card style={styles.promptCard}>
          <Title level={4} style={styles.title}>
            📝 生成的旋律提示词
          </Title>
          <div style={styles.promptBox}>
            <Paragraph copyable style={styles.promptText}>
              {melodyPrompt}
            </Paragraph>
          </div>
          <Text type="secondary" style={{ display: 'block', marginTop: '12px' }}>
            此提示词将用于MiniMax music-2.6生成具有相似旋律特征的新歌曲
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
  },
  dynamicsChart: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '120px',
    padding: '16px',
    background: 'var(--bg-secondary)',
    borderRadius: '8px',
  },
  dynamicsBar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '60px',
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

export default MelodyAnalysis
