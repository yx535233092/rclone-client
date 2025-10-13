import React from 'react';
import { FolderOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate } from 'react-router';

const { Header, Content, Sider } = Layout;

const menuItems = [
  {
    key: '/',
    label: '迁移任务',
    icon: <FolderOutlined />
  },
  {
    key: 'source-manage',
    label: '源设备管理',
    icon: <FolderOutlined />
  },
  {
    key: 'target-manage',
    label: '目标设备管理',
    icon: <FolderOutlined />
  }
];

const LayoutPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();

  return (
    <Layout className="h-screen">
      <Sider breakpoint="lg" collapsedWidth="0">
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['0']}
          items={menuItems}
          onClick={(item) => {
            navigate(item.key);
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
