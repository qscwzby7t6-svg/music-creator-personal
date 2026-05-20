import { useState } from 'react'
import { Card, Input, Select, Upload, Button, List, Avatar, Space, Typography, Progress } from 'antd'
import { SearchOutlined, UploadOutlined, PlayCircleOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { setSourceSong, setSelectedCategory, setHotSongs, Song } from '../../store/slices/songSlice'
import { RootState } from '../../store'
import type { CSSProperties } from 'react'

const { Search } = Input
const { Option } = Select
const { Text, Title } = Typography

const categories = [
  { value: 'all', label: '全部热门' },
  { value: 'pop', label: '流行音乐' },
  { value: 'hiphop', label: '说唱/嘻哈' },
  { value: 'edm', label: '电子音乐' },
  { value: 'rock', label: '摇滚' },
  { value: 'folk', label: '民谣' },
  { value: 'love', label: '情歌' },
  { value: 'tiktok', label: '抖音神曲' },
  { value: 'western', label: '欧美热歌' },
  { value: 'jpop', label: '日韩流行' },
  { value: 'chinese', label: '华语热歌' },
]

const mockHotSongs: Song[] = [
  {
    id: '1',
    title: '起风了',
    artist: '买辣椒也用券',
    duration: 285,
    coverUrl: 'https://p2.music.126.net/VkGpqUQRk3L8Qv6T6g2kCQ==/109951166950853327.jpg',
    audioUrl: '',
    playCount: 10000000,
    category: 'chinese',
  },
  {
    id: '2',
    title: '孤勇者',
    artist: '陈奕迅',
    duration: 240,
    coverUrl: 'https://p2.music.126.net/VkGpqUQRk3L8Qv6T6g2kCQ==/109951166950853327.jpg',
    audioUrl: '',
    playCount: 9500000,
    category: 'chinese',
  },
  {
    id: '3',
    title: '周杰伦 - 晴天',
    artist: '周杰伦',
    duration: 267,
    coverUrl: 'https://p2.music.126.net/VkGpqUQRk3L8Qv6T6g2kCQ==/109951166950853327.jpg',
    audioUrl: '',
    playCount: 8900000,
    category: 'chinese',
  },
  {
    id: '4',
    title: 'See You Again',
    artist: 'Wiz Khalifa',
    duration: 237,
    coverUrl: 'https://p2.music.126.net/VkGpqUQRk3L8Qv6T6g2kCQ==/109951166950853327.jpg',
    audioUrl: '',
    playCount: 8500000,
    category: 'western',
  },
  {
    id: '5',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    duration: 234,
    coverUrl: 'https://p2.music.126.net/VkGpqUQRk3L8Qv6T6g2kCQ==/109951166950853327.jpg',
    audioUrl: '',
    playCount: 8200000,
    category: 'western',
  },
  {
    id: '6',
    title: '稻香',
    artist: '周杰伦',
    duration: 228,
    coverUrl: 'https://p2.music.126.net/VkGpqUQRk3L8Qv6T6g2kCQ==/109951166950853327.jpg',
    audioUrl: '',
    playCount: 7800000,
    category: 'chinese',
  },
]

function SourceSelection() {
  const dispatch = useDispatch()
  const { selectedCategory, sourceSong, isUploading, uploadProgress } = useSelector(
    (state: RootState) => state.song
  )
  const [searchResults, setSearchResults] = useState<Song[]>([])

  const handleSearch = (value: string) => {
    if (!value.trim()) {
      setSearchResults([])
      return
    }
    const filtered = mockHotSongs.filter(
      (song) =>
        song.title.toLowerCase().includes(value.toLowerCase()) ||
        song.artist.toLowerCase().includes(value.toLowerCase())
    )
    setSearchResults(filtered)
  }

  const handleCategoryChange = (value: string) => {
    dispatch(setSelectedCategory(value))
    if (value === 'all') {
      dispatch(setHotSongs(mockHotSongs))
    } else {
      const filtered = mockHotSongs.filter((song) => song.category === value)
      dispatch(setHotSongs(filtered))
    }
  }

  const handleSelectSong = (song: Song) => {
    dispatch(setSourceSong(song))
  }

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.mp3,.wav,.m4a,.flac',
    showUploadList: false,
    beforeUpload: (file) => {
      const isLt100M = file.size / 1024 / 1024 < 100
      if (!isLt100M) {
        message.error('文件大小必须小于100MB')
        return false
      }

      const song: Song = {
        id: `local-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        artist: '本地文件',
        duration: 0,
        coverUrl: '',
        audioUrl: URL.createObjectURL(file),
      }
      dispatch(setSourceSong(song))
      return false
    },
    onChange: (info) => {
      if (info.file.status === 'uploading') {
        dispatch({ type: 'song/setIsUploading', payload: true })
      }
    },
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatPlayCount = (count: number) => {
    if (count >= 10000000) return `${(count / 10000000).toFixed(1)}亿`
    if (count >= 10000) return `${(count / 10000).toFixed(0)}万`
    return count.toString()
  }

  return (
    <div style={styles.container}>
      <Card style={styles.section}>
        <Title level={4} style={styles.sectionTitle}>
          🔍 搜索歌曲
        </Title>
        <Search
          placeholder="搜索歌曲名称或艺术家..."
          allowClear
          enterButton={<Button type="primary" icon={<SearchOutlined />}>搜索</Button>}
          size="large"
          onSearch={handleSearch}
        />
        
        {(searchResults.length > 0 || !searchResults.length) && (
          <List
            style={{ marginTop: '20px', maxHeight: '300px', overflow: 'auto' }}
            dataSource={searchResults.length > 0 ? searchResults : mockHotSongs}
            renderItem={(item) => (
              <List.Item
                style={styles.songItem}
                onClick={() => handleSelectSong(item)}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      shape="square"
                      size={64}
                      src={item.coverUrl}
                      style={styles.cover}
                    >
                      🎵
                    </Avatar>
                  }
                  title={
                    <Space>
                      <Text strong style={{ color: sourceSong?.id === item.id ? '#1890ff' : 'white' }}>
                        {item.title}
                      </Text>
                      {sourceSong?.id === item.id && <Text type="secondary">✓ 已选择</Text>}
                    </Space>
                  }
                  description={
                    <Space>
                      <Text type="secondary">{item.artist}</Text>
                      {item.playCount && (
                        <Text type="secondary">播放 {formatPlayCount(item.playCount)}</Text>
                      )}
                    </Space>
                  }
                />
                <Text type="secondary">{formatDuration(item.duration)}</Text>
              </List.Item>
            )}
          />
        )}
      </Card>

      <Card style={styles.section}>
        <Title level={4} style={styles.sectionTitle}>
          📂 分类浏览
        </Title>
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          size="large"
          style={{ width: '300px' }}
        >
          {categories.map((cat) => (
            <Option key={cat.value} value={cat.value}>
              {cat.label}
            </Option>
          ))}
        </Select>
      </Card>

      <Card style={styles.section}>
        <Title level={4} style={styles.sectionTitle}>
          📤 上传自定义歌曲
        </Title>
        <Upload.Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <UploadOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
          </p>
          <p className="ant-upload-text" style={{ color: 'white' }}>
            点击或拖拽音频文件到此处上传
          </p>
          <p className="ant-upload-hint" style={{ color: 'var(--text-secondary)' }}>
            支持 MP3、WAV、M4A、FLAC 格式，文件大小不超过100MB
          </p>
        </Upload.Dragger>
        {isUploading && (
          <Progress percent={uploadProgress} status="active" style={{ marginTop: '16px' }} />
        )}
      </Card>

      {sourceSong && (
        <Card style={styles.selectedCard}>
          <Title level={4} style={styles.sectionTitle}>
            ✅ 已选择歌曲
          </Title>
          <Space>
            <Avatar shape="square" size={80} src={sourceSong.coverUrl}>
              🎵
            </Avatar>
            <div>
              <Title level={5} style={{ color: '#1890ff', marginBottom: '8px' }}>
                {sourceSong.title}
              </Title>
              <Text type="secondary">{sourceSong.artist}</Text>
              <br />
              <Button
                type="link"
                icon={<PlayCircleOutlined />}
                onClick={() => {
                  if (sourceSong.audioUrl) {
                    window.open(sourceSong.audioUrl, '_blank')
                  }
                }}
              >
                播放预览
              </Button>
            </div>
          </Space>
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
  section: {
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
  },
  sectionTitle: {
    color: 'white',
    marginBottom: '16px',
  },
  songItem: {
    cursor: 'pointer',
    padding: '12px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    border: '1px solid transparent',
  },
  cover: {
    borderRadius: '8px',
  },
  selectedCard: {
    background: 'var(--bg-tertiary)',
    border: '2px solid #1890ff',
    borderRadius: '12px',
    gridColumn: '1 / -1',
  },
}

export default SourceSelection
