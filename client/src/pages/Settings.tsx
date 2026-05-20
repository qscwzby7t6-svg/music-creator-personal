import { useState } from 'react'
import { Card, Form, Input, Button, Slider, Switch, Space, Typography, message, Alert } from 'antd'
import { SaveOutlined, KeyOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { setDeepseekApiKey, setMinimaxApiKey, setDefaultDuration } from '../store/slices/settingsSlice'
import { RootState } from '../store'
import type { CSSProperties } from 'react'

const { Title, Text, Paragraph } = Typography

function Settings() {
  const dispatch = useDispatch()
  const { deepseekApiKey, minimaxApiKey, defaultDuration } = useSelector(
    (state: RootState) => state.settings
  )
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  const handleSave = async (values: any) => {
    setSaving(true)
    try {
      dispatch(setDeepseekApiKey(values.deepseekApiKey))
      dispatch(setMinimaxApiKey(values.minimaxApiKey))
      dispatch(setDefaultDuration(values.duration))

      localStorage.setItem('settings', JSON.stringify(values))

      message.success('设置保存成功！')
    } catch (error) {
      message.error('保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={styles.container}>
      <Card style={styles.headerCard}>
        <Title level={3} style={styles.title}>
          ⚙️ 设置
        </Title>
        <Text type="secondary">
          配置API密钥和其他参数设置
        </Text>
      </Card>

      <Card style={styles.section}>
        <div style={styles.sectionHeader}>
          <KeyOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: '12px' }} />
          <div>
            <Title level={4} style={styles.sectionTitle}>
              API密钥配置
            </Title>
            <Text type="secondary">
              配置DeepSeek和MiniMax的API密钥以启用AI功能
            </Text>
          </div>
        </div>

        <Alert
          message="密钥安全提示"
          description="API密钥仅存储在本地浏览器中，不会上传到任何服务器"
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            deepseekApiKey: deepseekApiKey || 'sk-9c295285116547729e8deee1255030aa',
            minimaxApiKey: minimaxApiKey || 'sk-cp-M8nlgav6xfT4XWypLAVjq9RpxpDua3Uj2RrxlL87Rdx5Db-QKZLqLKYiwAA2PICAbdZcWCdTcIn2_tg_iJdd2AREkarnEE2xS2epcs3LffEPzv1dV5Dd8A4',
            duration: defaultDuration,
          }}
          onFinish={handleSave}
        >
          <Form.Item
            label={<Text style={{ color: 'white' }}>DeepSeek API Key</Text>}
            name="deepseekApiKey"
            rules={[{ required: true, message: '请输入DeepSeek API密钥' }]}
          >
            <Input.Password
              placeholder="sk-..."
              size="large"
            />
          </Form.Item>

          <Paragraph type="secondary" style={{ marginBottom: '24px' }}>
            用于风格分析、旋律分析和歌词创作。获取地址：https://platform.deepseek.com
          </Paragraph>

          <Form.Item
            label={<Text style={{ color: 'white' }}>MiniMax API Key</Text>}
            name="minimaxApiKey"
            rules={[{ required: true, message: '请输入MiniMax API密钥' }]}
          >
            <Input.Password
              placeholder="sk-cp-..."
              size="large"
            />
          </Form.Item>

          <Paragraph type="secondary" style={{ marginBottom: '24px' }}>
            用于AI歌曲合成。获取地址：https://www.minimax.chat
          </Paragraph>

          <Form.Item
            label={<Text style={{ color: 'white' }}>歌曲时长设置</Text>}
            name="duration"
            tooltip="设置生成歌曲的时长范围（秒）"
          >
            <Slider
              range
              min={120}
              max={360}
              marks={{
                120: '2分钟',
                180: '3分钟',
                240: '4分钟',
                300: '5分钟',
                360: '6分钟',
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              size="large"
              icon={<SaveOutlined />}
              htmlType="submit"
              loading={saving}
              style={styles.saveButton}
            >
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <Title level={4} style={styles.sectionTitle}>
              关于系统
            </Title>
          </div>
        </div>

        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text type="secondary">版本信息：</Text>
            <Text strong style={{ marginLeft: '8px', color: 'white' }}>v1.0.0</Text>
          </div>
          <div>
            <Text type="secondary">技术架构：</Text>
            <Text style={{ marginLeft: '8px' }}>React + TypeScript + Express.js</Text>
          </div>
          <div>
            <Text type="secondary">AI模型：</Text>
            <Space style={{ marginLeft: '8px' }}>
              <Text>DeepSeek V4Pro</Text>
              <Text type="secondary">|</Text>
              <Text>MiniMax music-2.6</Text>
            </Space>
          </div>
          <div>
            <Text type="secondary">音频处理：</Text>
            <Text style={{ marginLeft: '8px' }}>Web Audio API + FFmpeg</Text>
          </div>
        </Space>
      </Card>

      <Card style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <Title level={4} style={styles.sectionTitle}>
              使用说明
            </Title>
          </div>
        </div>

        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text strong style={{ color: 'white' }}>1. 获取API密钥</Text>
            <Paragraph type="secondary" style={{ marginTop: '8px' }}>
              分别在DeepSeek和MiniMax平台注册账号并获取API密钥
            </Paragraph>
          </div>
          <div>
            <Text strong style={{ color: 'white' }}>2. 配置密钥</Text>
            <Paragraph type="secondary" style={{ marginTop: '8px' }}>
              将API密钥填入上方配置表单中并保存
            </Paragraph>
          </div>
          <div>
            <Text strong style={{ color: 'white' }}>3. 开始创作</Text>
            <Paragraph type="secondary" style={{ marginTop: '8px' }}>
              进入创作工作室，选择或上传歌曲，开始AI歌曲创作之旅
            </Paragraph>
          </div>
        </Space>
      </Card>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 20px',
  },
  headerCard: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    marginBottom: '24px',
  },
  title: {
    color: 'white',
    marginBottom: '8px',
  },
  section: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    marginBottom: '24px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
  },
  sectionTitle: {
    color: 'white',
    marginBottom: '4px',
  },
  saveButton: {
    width: '200px',
    height: '48px',
    fontSize: '16px',
    borderRadius: '24px',
    background: 'var(--gradient-primary)',
    border: 'none',
  },
}

export default Settings
