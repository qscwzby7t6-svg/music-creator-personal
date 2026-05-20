import { useState } from 'react'
import { Card, Typography, Button, Space, Alert, Select, message, Tabs } from 'antd'
import { DownloadOutlined, FilePdfOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { downloadSong } from '../../services/song'
import type { CSSProperties } from 'react'

const { Title, Text, Paragraph } = Typography
const { Option } = Select

function DownloadExport() {
  const { generatedSong, plagiarismReport } = useSelector((state: RootState) => state.generation)
  const { sourceSong } = useSelector((state: RootState) => state.song)
  const { lyrics } = useSelector((state: RootState) => state.generation)
  const [selectedFormat, setSelectedFormat] = useState<'mp3' | 'wav'>('mp3')
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async (format: 'mp3' | 'wav') => {
    if (!generatedSong) {
      message.warning('请先生成歌曲')
      return
    }

    if (plagiarismReport && plagiarismReport.riskLevel === 'high') {
      const confirmed = window.confirm(
        '当前歌曲存在较高侵权风险，是否确认下载？建议根据提示修改后再下载。'
      )
      if (!confirmed) return
    }

    setIsDownloading(true)
    try {
      await downloadSong(generatedSong.id, format)
      message.success(`成功下载 ${format.toUpperCase()} 格式！`)
    } catch (err) {
      message.error('下载失败，请重试')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDownloadAll = async () => {
    if (!generatedSong) {
      message.warning('请先生成歌曲')
      return
    }

    setIsDownloading(true)
    try {
      await downloadSong(generatedSong.id, 'mp3')
      await new Promise(resolve => setTimeout(resolve, 500))
      await downloadSong(generatedSong.id, 'wav')
      message.success('所有格式下载完成！')
    } catch (err) {
      message.error('下载失败，请重试')
    } finally {
      setIsDownloading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const mockFileSizes = {
    mp3: 8.5,
    wav: 45.2,
  }

  return (
    <div style={styles.container}>
      {!generatedSong && (
        <Alert
          message="请先完成歌曲生成"
          description="在进行下载之前，请先完成歌曲生成"
          type="warning"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      {generatedSong && plagiarismReport?.riskLevel !== 'high' && (
        <Alert
          message={<><CheckCircleOutlined style={{ color: '#52c41a' }} /> 歌曲已准备就绪</>}
          description="恭喜！您的歌曲已完成生成并通过侵权检测，可以安全下载使用"
          type="success"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      {generatedSong && plagiarismReport?.riskLevel === 'high' && (
        <Alert
          message="⚠️ 侵权风险警告"
          description="当前歌曲存在较高侵权风险，建议根据系统建议进行修改后再下载使用"
          type="error"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      <Card style={styles.infoCard}>
        <Title level={4} style={styles.title}>
          📋 歌曲信息
        </Title>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text type="secondary">歌曲标题：</Text>
            <Text strong style={{ color: 'white', marginLeft: '8px' }}>
              {generatedSong?.title || '未命名'}
            </Text>
          </div>
          <div>
            <Text type="secondary">参考原曲：</Text>
            <Text style={{ marginLeft: '8px' }}>
              {sourceSong ? `${sourceSong.title} - ${sourceSong.artist}` : '无'}
            </Text>
          </div>
          <div>
            <Text type="secondary">歌曲时长：</Text>
            <Text style={{ marginLeft: '8px' }}>
              {generatedSong ? `${Math.floor(generatedSong.duration / 60)}:${(generatedSong.duration % 60).toString().padStart(2, '0')}` : '0:00'}
            </Text>
          </div>
          <div>
            <Text type="secondary">生成时间：</Text>
            <Text style={{ marginLeft: '8px' }}>
              {generatedSong?.createdAt ? new Date(generatedSong.createdAt).toLocaleString('zh-CN') : '-'}
            </Text>
          </div>
        </Space>
      </Card>

      <Card style={styles.downloadCard}>
        <Title level={4} style={styles.title}>
          💾 下载选项
        </Title>
        
        <Tabs
          defaultActiveKey="mp3"
          onChange={(key) => setSelectedFormat(key as 'mp3' | 'wav')}
          items={[
            {
              key: 'mp3',
              label: (
                <span>
                  <FilePdfOutlined />
                  MP3 高质量
                </span>
              ),
              children: (
                <div style={styles.formatInfo}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                      <Text type="secondary">格式：</Text>
                      <Text strong style={{ marginLeft: '8px' }}>MP3</Text>
                    </div>
                    <div>
                      <Text type="secondary">比特率：</Text>
                      <Text strong style={{ marginLeft: '8px' }}>320 kbps</Text>
                    </div>
                    <div>
                      <Text type="secondary">采样率：</Text>
                      <Text strong style={{ marginLeft: '8px' }}>44.1 kHz</Text>
                    </div>
                    <div>
                      <Text type="secondary">预估大小：</Text>
                      <Text strong style={{ marginLeft: '8px' }}>{mockFileSizes.mp3} MB</Text>
                    </div>
                    <div>
                      <Text type="secondary">适用场景：</Text>
                      <div style={{ marginTop: '8px' }}>
                        <Space wrap>
                          <span style={styles.tag}>网络分享</span>
                          <span style={styles.tag}>社交媒体</span>
                          <span style={styles.tag}>移动端播放</span>
                        </Space>
                      </div>
                    </div>
                    <Button
                      type="primary"
                      size="large"
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownload('mp3')}
                      loading={isDownloading}
                      style={styles.downloadButton}
                    >
                      下载 MP3
                    </Button>
                  </Space>
                </div>
              ),
            },
            {
              key: 'wav',
              label: (
                <span>
                  <FilePdfOutlined />
                  WAV 无损
                </span>
              ),
              children: (
                <div style={styles.formatInfo}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                      <Text type="secondary">格式：</Text>
                      <Text strong style={{ marginLeft: '8px' }}>WAV</Text>
                    </div>
                    <div>
                      <Text type="secondary">位深度：</Text>
                      <Text strong style={{ marginLeft: '8px' }}>16 bit</Text>
                    </div>
                    <div>
                      <Text type="secondary">采样率：</Text>
                      <Text strong style={{ marginLeft: '8px' }}>44.1 kHz</Text>
                    </div>
                    <div>
                      <Text type="secondary">预估大小：</Text>
                      <Text strong style={{ marginLeft: '8px' }}>{mockFileSizes.wav} MB</Text>
                    </div>
                    <div>
                      <Text type="secondary">适用场景：</Text>
                      <div style={{ marginTop: '8px' }}>
                        <Space wrap>
                          <span style={styles.tag}>专业制作</span>
                          <span style={styles.tag}>无损音质</span>
                          <span style={styles.tag}>后期处理</span>
                        </Space>
                      </div>
                    </div>
                    <Button
                      size="large"
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownload('wav')}
                      loading={isDownloading}
                      style={styles.downloadButtonWav}
                    >
                      下载 WAV
                    </Button>
                  </Space>
                </div>
              ),
            },
          ]}
        />

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <Button
            size="large"
            icon={<DownloadOutlined />}
            onClick={handleDownloadAll}
            loading={isDownloading}
            style={{ width: '300px', height: '48px' }}
          >
            下载所有格式
          </Button>
          <Text type="secondary" style={{ display: 'block', marginTop: '12px' }}>
            同时下载 MP3 和 WAV 两种格式
          </Text>
        </div>
      </Card>

      <Card style={styles.tipsCard}>
        <Title level={4} style={styles.title}>
          💡 使用提示
        </Title>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text strong style={{ color: 'white' }}>• 版权说明：</Text>
            <Text type="secondary"> 下载的歌曲仅供个人学习交流使用，商业用途请注意版权问题</Text>
          </div>
          <div>
            <Text strong style={{ color: 'white' }}>• 音质选择：</Text>
            <Text type="secondary"> 如需后期编辑，推荐使用 WAV 无损格式</Text>
          </div>
          <div>
            <Text strong style={{ color: 'white' }}>• 分享推荐：</Text>
            <Text type="secondary"> 日常分享使用 MP3 格式即可，文件更小更便于传输</Text>
          </div>
          <div>
            <Text strong style={{ color: 'white' }}>• 再次创作：</Text>
            <Text type="secondary"> 如需调整，可返回上一步修改歌词后重新生成</Text>
          </div>
        </Space>
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
  infoCard: {
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
  },
  downloadCard: {
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
  },
  tipsCard: {
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
  },
  title: {
    color: 'white',
    marginBottom: '16px',
  },
  formatInfo: {
    padding: '24px',
    background: 'var(--bg-secondary)',
    borderRadius: '8px',
    marginTop: '16px',
  },
  tag: {
    padding: '4px 12px',
    background: 'var(--bg-tertiary)',
    borderRadius: '4px',
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },
  downloadButton: {
    width: '100%',
    height: '48px',
    fontSize: '16px',
    borderRadius: '24px',
    background: 'var(--gradient-primary)',
    border: 'none',
  },
  downloadButtonWav: {
    width: '100%',
    height: '48px',
    fontSize: '16px',
    borderRadius: '24px',
    border: '2px solid var(--border-color)',
  },
}

export default DownloadExport
