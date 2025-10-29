import React from 'react';
import { Button, Form, Input, Select } from 'antd';
import type { RemoteResponseType } from '@/types/remote';
const { Option } = Select;

interface SearchFormValues {
  name: string;
  sourceDeviceId: number;
  targetDeviceId: number;
}

const SearchForm: React.FC<{
  openDrawer: () => void;
  sourceDevices: RemoteResponseType[];
  targetDevices: RemoteResponseType[];
  onSearch: (values: SearchFormValues) => void;
  onReset: () => void;
}> = ({ openDrawer, sourceDevices, targetDevices, onSearch, onReset }) => {
  const [form] = Form.useForm();

  const handleSearch = () => {
    const values = form.getFieldsValue(true) as SearchFormValues;
    onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

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
        <Form.Item label="迁移任务" name="name">
          <Input placeholder="请输入迁移任务" style={{ width: 180 }} />
        </Form.Item>
        <Form.Item label="源端设备" name="sourceDeviceId">
          <Select
            placeholder="请选择源端设备"
            style={{ width: 180 }}
            allowClear
          >
            {sourceDevices.map((device) => (
              <Option key={device.id} value={device.id}>
                {device.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="目标端设备" name="targetDeviceId">
          <Select
            placeholder="请选择目标端设备"
            style={{ width: 180 }}
            allowClear
          >
            {targetDevices.map((device) => (
              <Option key={device.id} value={device.id}>
                {device.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      <div className="flex">
        <Form.Item>
          <Button color="purple" variant="outlined" onClick={handleSearch}>
            搜索
          </Button>
        </Form.Item>
        <Form.Item>
          <Button color="green" variant="solid" onClick={handleReset}>
            重置
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={openDrawer}>
            新增
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default SearchForm;
