import { Outlet, Link, useLocation } from 'react-router-dom'
import { Layout, Menu, Badge } from 'antd'
import {
  HomeOutlined,
  AudioOutlined,
  FolderOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

const { Header, Content, Footer } = Layout

const items: MenuProps['items'] = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: <Link to="/">首页</Link>,
  },
  {
    key: '/studio',
    icon: <AudioOutlined />,
    label: <Link to="/studio">创作工作室</Link>,
  },
  {
    key: '/library',
    icon: <FolderOutlined />,
    label: <Link to="/library">歌曲库</Link>,
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: <Link to="/settings">设置</Link>,
  },
]

function LayoutComponent() {
  const location = useLocation()

  return (
    <Layout className="layout">
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          padding: '0 50px',
          background: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            marginRight: '50px',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          🎵 AI Song Generator
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={items}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
          }}
        />
      </Header>
      <Content style={{ padding: '0 50px', minHeight: 'calc(100vh - 64px - 70px)' }}>
        <div style={{ padding: '24px 0' }}>
          <Outlet />
        </div>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)',
          padding: '20px 50px',
        }}
      >
        <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          AI Song Generator © {new Date().getFullYear()} - 智能仿写歌曲创作平台
          <br />
          <span style={{ fontSize: '12px' }}>
            Powered by DeepSeek V4Pro & MiniMax music-2.6
          </span>
        </div>
      </Footer>
    </Layout>
  )
}

export default LayoutComponent
