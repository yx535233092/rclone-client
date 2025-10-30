import React, { useMemo } from 'react';
import { CloudServerOutlined, CloudSyncOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router';

const { Header, Content, Sider } = Layout;

const menuItems = [
  {
    key: '/migrate-task',
    label: '迁移任务',
    icon: <CloudSyncOutlined />
  },
  {
    key: '/source-manage',
    label: '源设备管理',
    icon: <CloudServerOutlined />
  },
  {
    key: '/target-manage',
    label: '目标设备管理',
    icon: <CloudServerOutlined />
  }
];

const LayoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();

  // 根据当前路径获取页面标题
  const pageTitle = useMemo(() => {
    const currentPath = location.pathname === '/' ? '/' : location.pathname;
    const currentItem = menuItems.find((item) => item.key === currentPath);
    return currentItem?.label || '首页';
  }, [location.pathname]);

  return (
    <Layout className="h-screen">
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="flex justify-center items-center px-4">
          <img src="/images/h3c-logo.webp" alt="logo" className="w-[30px]" />
          <div className="w-full flex justify-center text-white py-8 text-sm">
            H3C MigrateX V0.1
          </div>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[
            location.pathname === '/' ? '/migrate-task' : location.pathname
          ]}
          items={menuItems}
          onClick={(item) => {
            navigate(item.key);
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div className="px-6 h-full flex items-center">
            <h1 className="text-xl font-semibold">{pageTitle}</h1>
          </div>
        </Header>
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
