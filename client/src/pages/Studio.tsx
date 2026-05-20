import { useState } from 'react'
import { Card, Steps, Button, Space, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import type { CSSProperties } from 'react'
import SourceSelection from '../components/Studio/SourceSelection'
import StyleAnalysis from '../components/Studio/StyleAnalysis'
import MelodyAnalysis from '../components/Studio/MelodyAnalysis'
import LyricGeneration from '../components/Studio/LyricGeneration'
import SongGeneration from '../components/Studio/SongGeneration'
import DownloadExport from '../components/Studio/DownloadExport'
import { RootState } from '../store'

const steps = [
  { title: '选择歌曲', description: '搜索或上传歌曲' },
  { title: '风格分析', description: 'DeepSeek分析风格' },
  { title: '旋律分析', description: '提取旋律特征' },
  { title: '歌词创作', description: '生成原创歌词' },
  { title: '歌曲生成', description: 'MiniMax合成' },
  { title: '下载导出', description: '获取最终作品' },
]

function Studio() {
  const [currentStep, setCurrentStep] = useState(0)
  const dispatch = useDispatch()
  const { sourceSong } = useSelector((state: RootState) => state.song)
  const { stylePrompt, melodyPrompt } = useSelector((state: RootState) => state.analysis)
  const { lyrics, generatedSong } = useSelector((state: RootState) => state.generation)

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!sourceSong
      case 1:
        return !!stylePrompt
      case 2:
        return !!melodyPrompt
      case 3:
        return !!lyrics
      case 4:
        return !!generatedSong
      default:
        return false
    }
  }

  const handleNext = () => {
    if (!canProceed()) {
      message.warning('请完成当前步骤后再继续')
      return
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <SourceSelection />
      case 1:
        return <StyleAnalysis />
      case 2:
        return <MelodyAnalysis />
      case 3:
        return <LyricGeneration />
      case 4:
        return <SongGeneration />
      case 5:
        return <DownloadExport />
      default:
        return null
    }
  }

  return (
    <div style={styles.container}>
      <Card style={styles.headerCard}>
        <div style={styles.title}>
          <h1>🎵 创作工作室</h1>
          <p style={styles.subtitle}>基于AI的智能歌曲仿写与创作系统</p>
        </div>
      </Card>

      <Card style={styles.stepsCard}>
        <Steps
          current={currentStep}
          items={steps.map((step, index) => ({
            title: step.title,
            description: step.description,
            status: index < currentStep ? 'finish' : index === currentStep ? 'process' : 'wait',
          }))}
        />
      </Card>

      <Card style={styles.contentCard}>
        <div style={styles.stepContent}>{renderStepContent()}</div>

        <div style={styles.navigation}>
          <Space>
            <Button
              onClick={handlePrev}
              disabled={currentStep === 0}
              size="large"
            >
              上一步
            </Button>
            {currentStep < steps.length - 1 && (
              <Button
                type="primary"
                onClick={handleNext}
                disabled={!canProceed()}
                size="large"
              >
                下一步
              </Button>
            )}
          </Space>
        </div>
      </Card>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
  },
  headerCard: {
    background: 'var(--gradient-primary)',
    border: 'none',
    borderRadius: '16px',
    marginBottom: '24px',
    textAlign: 'center',
  },
  title: {
    padding: '20px 0',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '16px',
    marginBottom: 0,
  },
  stepsCard: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    marginBottom: '24px',
    padding: '24px',
  },
  contentCard: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    minHeight: '600px',
  },
  stepContent: {
    minHeight: '500px',
    padding: '20px',
  },
  navigation: {
    borderTop: '1px solid var(--border-color)',
    padding: '24px',
    textAlign: 'center',
  },
}

export default Studio
