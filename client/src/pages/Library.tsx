import { useEffect, useState } from 'react'
import { Card, Table, Tag, Space, Button, Typography, Empty, Modal } from 'antd'
import { PlayCircleOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { CSSProperties } from 'react'

const { Title, Text } = Typography

interface Project {
  id: string
  title: string
  sourceSong: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
  duration: number
}

function Library() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setProjects([
        {
          id: '1',
          title: '我的创作1',
          sourceSong: '起风了',
          status: 'completed',
          createdAt: '2026-05-20 10:30:00',
          duration: 240,
        },
        {
          id: '2',
          title: '我的创作2',
          sourceSong: '孤勇者',
          status: 'completed',
          createdAt: '2026-05-19 15:20:00',
          duration: 215,
        },
        {
          id: '3',
          title: '我的创作3',
          sourceSong: '晴天',
          status: 'failed',
          createdAt: '2026-05-18 09:15:00',
          duration: 0,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handlePlay = (record: Project) => {
    if (record.status === 'completed') {
      Modal.info({
        title: '播放歌曲',
        content: `播放: ${record.title}`,
      })
    }
  }

  const handleDownload = (record: Project) => {
    if (record.status === 'completed') {
      Modal.confirm({
        title: '下载歌曲',
        content: '选择下载格式',
        okText: 'MP3',
        cancelText: 'WAV',
        onOk: () => {
          console.log('下载MP3')
        },
      })
    }
  }

  const handleDelete = (record: Project) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除项目"${record.title}"吗？`,
      okText: '删除',
      okType: 'danger',
      onOk: () => {
        setProjects(projects.filter(p => p.id !== record.id))
      },
    })
  }

  const columns: ColumnsType<Project> = [
    {
      title: '项目名称',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <Text strong style={{ color: 'white' }}>{text}</Text>,
    },
    {
      title: '参考歌曲',
      dataIndex: 'sourceSong',
      key: 'sourceSong',
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) =>
        duration > 0 ? `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}` : '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          pending: 'blue',
          completed: 'green',
          failed: 'red',
        }
        const labels = {
          pending: '生成中',
          completed: '已完成',
          failed: '失败',
        }
        return <Tag color={colors[status]}>{labels[status]}</Tag>
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<PlayCircleOutlined />}
            onClick={() => handlePlay(record)}
            disabled={record.status !== 'completed'}
          >
            播放
          </Button>
          <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record)}
            disabled={record.status !== 'completed'}
          >
            下载
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div style={styles.container}>
      <Card style={styles.headerCard}>
        <Title level={3} style={styles.title}>
          📁 歌曲库
        </Title>
        <Text type="secondary">
          管理您所有的创作项目，包括正在生成和已完成的作品
        </Text>
      </Card>

      <Card style={styles.tableCard}>
        {projects.length > 0 ? (
          <Table
            columns={columns}
            dataSource={projects}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 个项目`,
            }}
          />
        ) : (
          <Empty
            description="暂无创作项目"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => window.location.href = '/studio'}>
              前往创作
            </Button>
          </Empty>
        )}
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
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    marginBottom: '24px',
  },
  title: {
    color: 'white',
    marginBottom: '8px',
  },
  tableCard: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
  },
}

export default Library
