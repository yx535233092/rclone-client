import React from 'react';
import { Button, Form, Input } from 'antd';

const SearchForm: React.FC<{ openDrawer: () => void }> = ({ openDrawer }) => {
  const [form] = Form.useForm();

  return (
    <Form
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '16px 0'
      }}
      layout={'inline'}
      form={form}
    >
      <div className="flex gap-4">
        <Form.Item label="设备名称">
          <Input placeholder="请输入设备名称" />
        </Form.Item>
        <Form.Item label="IP">
          <Input placeholder="请输入IP" />
        </Form.Item>
      </div>

      <div className="flex">
        <Form.Item>
          <Button type="primary">搜索</Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={openDrawer}>
            新建任务
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default SearchForm;
