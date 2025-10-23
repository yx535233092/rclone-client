import React from 'react';
import { Button, Form, Input } from 'antd';
interface SearchFormValues {
  name: string;
  endpoint: string;
}

const SearchForm: React.FC<{
  openDrawer: () => void;
  onSearch: (values: SearchFormValues) => void;
  onReset: () => void;
}> = ({ openDrawer, onSearch, onReset }) => {
  const [form] = Form.useForm();

  const handleSearch = () => {
    // 1. 获取搜索参数
    const values = form.getFieldsValue(true) as SearchFormValues;
    // 2. 传递给父组件
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
        <Form.Item label="设备名称" name="name">
          <Input placeholder="请输入设备名称" style={{ width: 180 }} />
        </Form.Item>
        <Form.Item label="IP" name="endpoint">
          <Input placeholder="请输入IP" style={{ width: 180 }} />
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
