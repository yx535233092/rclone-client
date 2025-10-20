import React from 'react';
import { Button, Form, Select } from 'antd';
const { Option } = Select;

const SearchForm: React.FC<{ openDrawer: () => void }> = ({ openDrawer }) => {
  const [form] = Form.useForm();

  return (
    <Form
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '16px 0',
        marginBottom: '16px'
      }}
      layout={'inline'}
      form={form}
    >
      <div className="flex gap-4">
        <Form.Item label="迁移任务">
          <Select placeholder="请选择迁移任务" style={{ width: 180 }}>
            <Option value="1">迁移任务1</Option>
            <Option value="2">迁移任务2</Option>
            <Option value="3">迁移任务3</Option>
          </Select>
        </Form.Item>
        <Form.Item label="源端设备">
          <Select placeholder="请选择源端设备" style={{ width: 180 }}>
            <Option value="1">源端设备1</Option>
            <Option value="2">源端设备2</Option>
            <Option value="3">源端设备3</Option>
          </Select>
        </Form.Item>
        <Form.Item label="目标端设备">
          <Select placeholder="请选择目标端设备" style={{ width: 180 }}>
            <Option value="1">目标端设备1</Option>
            <Option value="2">目标端设备2</Option>
            <Option value="3">目标端设备3</Option>
          </Select>
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
