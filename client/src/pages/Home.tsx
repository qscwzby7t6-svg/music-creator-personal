import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Row, Col, Typography, Space } from 'antd'
import {
  ThunderboltOutlined,
  AudioOutlined,
  SafetyOutlined,
  DownloadOutlined,
} from '@ant-design/icons'
import type { CSSProperties } from 'react'

const { Title, Paragraph } = Typography

const features = [
  {
    icon: <ThunderboltOutlined style={{ fontSize: '48px', color: '#1890ff' }} />,
    title: 'AI智能分析',
    description: '基于DeepSeek V4Pro深度学习模型，精准分析歌曲风格与旋律特征',
  },
  {
    icon: <AudioOutlined style={{ fontSize: '48px', color: '#722ed1' }} />,
    title: '智能创作',
    description: '结合风格提示词与旋律提示词，生成原创歌曲，支持3-5分钟时长',
  },
  {
    icon: <SafetyOutlined style={{ fontSize: '48px', color: '#52c41a' }} />,
    title: '侵权检测',
    description: '多维度版权检测系统，确保生成歌曲的原创性与合法性',
  },
  {
    icon: <DownloadOutlined style={{ fontSize: '48px', color: '#faad14' }} />,
    title: '多格式导出',
    description: '支持MP3、WAV等多种音频格式导出，满足不同使用场景',
  },
]

function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'AI Song Generator - 智能仿写歌曲生成器'
  }, [])

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <Title level={1} style={styles.heroTitle}>
          🎵 智能仿写歌曲生成器
        </Title>
        <Paragraph style={styles.heroSubtitle}>
          基于先进的AI技术，自动分析原曲风格与旋律特征，创作独一无二的原创歌曲
        </Paragraph>
        <Space size="large">
          <Button
            type="primary"
            size="large"
            icon={<ThunderboltOutlined />}
            onClick={() => navigate('/studio')}
            style={styles.heroButton}
          >
            开始创作
          </Button>
          <Button
            size="large"
            onClick={() => navigate('/library')}
            style={styles.heroButtonSecondary}
          >
            查看歌曲库
          </Button>
        </Space>
      </div>

      <Row gutter={[24, 24]} style={styles.features}>
        {features.map((feature, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card hoverable style={styles.featureCard}>
              <div style={styles.featureIcon}>{feature.icon}</div>
              <Title level={4} style={styles.featureTitle}>
                {feature.title}
              </Title>
              <Paragraph style={styles.featureDesc}>
                {feature.description}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      <Card style={styles.processCard}>
        <Title level={3} style={styles.sectionTitle}>
          🎼 创作流程
        </Title>
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} lg={12}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {[
                { step: '01', title: '选择歌曲', desc: '搜索热门歌曲或上传自定义歌曲' },
                { step: '02', title: 'AI风格分析', desc: 'DeepSeek深度分析曲风、情绪、乐器等特征' },
                { step: '03', title: '旋律特征提取', desc: '提取音高、时长、音程、力度等旋律信息' },
                { step: '04', title: '歌词创作', desc: 'AI生成原创歌词，自动过滤敏感词' },
                { step: '05', title: '歌曲生成', desc: 'MiniMax music-2.6合成完整歌曲' },
                { step: '06', title: '侵权检测与导出', desc: '确保原创性，下载MP3/WAV格式' },
              ].map((item) => (
                <Card key={item.step} size="small" style={styles.stepCard}>
                  <Space>
                    <div style={styles.stepNumber}>{item.step}</div>
                    <div>
                      <Title level={5} style={styles.stepTitle}>
                        {item.title}
                      </Title>
                      <Paragraph style={styles.stepDesc}>{item.desc}</Paragraph>
                    </div>
                  </Space>
                </Card>
              ))}
            </Space>
          </Col>
          <Col xs={24} lg={12}>
            <div style={styles.processIllustration}>
              <div style={styles.waveAnimation}>
                <div style={{ ...styles.wave, ...styles.wave1 }}></div>
                <div style={{ ...styles.wave, ...styles.wave2 }}></div>
                <div style={{ ...styles.wave, ...styles.wave3 }}></div>
              </div>
              <div style={styles.musicIcon}>🎵</div>
            </div>
          </Col>
        </Row>
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
  hero: {
    textAlign: 'center',
    padding: '80px 20px',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
    borderRadius: '24px',
    marginBottom: '60px',
    border: '1px solid var(--border-color)',
  },
  heroTitle: {
    fontSize: '56px',
    fontWeight: 'bold',
    marginBottom: '24px',
    background: 'var(--gradient-primary)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '20px',
    color: 'var(--text-secondary)',
    marginBottom: '40px',
    maxWidth: '700px',
    margin: '0 auto 40px',
  },
  heroButton: {
    height: '56px',
    padding: '0 48px',
    fontSize: '18px',
    borderRadius: '28px',
    background: 'var(--gradient-primary)',
    border: 'none',
  },
  heroButtonSecondary: {
    height: '56px',
    padding: '0 48px',
    fontSize: '18px',
    borderRadius: '28px',
    border: '2px solid var(--border-color)',
  },
  features: {
    marginBottom: '60px',
  },
  featureCard: {
    textAlign: 'center',
    height: '100%',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '32px 24px',
    transition: 'all 0.3s ease',
  },
  featureIcon: {
    marginBottom: '20px',
  },
  featureTitle: {
    color: 'white',
    marginBottom: '12px',
  },
  featureDesc: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
  },
  processCard: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '24px',
    padding: '48px',
    marginBottom: '60px',
  },
  sectionTitle: {
    textAlign: 'center',
    color: 'white',
    marginBottom: '40px',
    fontSize: '32px',
  },
  stepCard: {
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
  },
  stepNumber: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'var(--gradient-primary)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  stepTitle: {
    color: 'white',
    marginBottom: '4px',
  },
  stepDesc: {
    color: 'var(--text-secondary)',
    fontSize: '13px',
    marginBottom: 0,
  },
  processIllustration: {
    position: 'relative',
    height: '400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveAnimation: {
    position: 'relative',
    width: '300px',
    height: '300px',
  },
  wave: {
    position: 'absolute',
    border: '2px solid',
    borderRadius: '50%',
    animation: 'pulse 2s ease-in-out infinite',
  },
  wave1: {
    width: '100%',
    height: '100%',
    borderColor: 'rgba(24, 144, 255, 0.3)',
    animationDelay: '0s',
  },
  wave2: {
    width: '80%',
    height: '80%',
    top: '10%',
    left: '10%',
    borderColor: 'rgba(114, 46, 209, 0.3)',
    animationDelay: '0.3s',
  },
  wave3: {
    width: '60%',
    height: '60%',
    top: '20%',
    left: '20%',
    borderColor: 'rgba(82, 196, 26, 0.3)',
    animationDelay: '0.6s',
  },
  musicIcon: {
    fontSize: '80px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}

export default Home
