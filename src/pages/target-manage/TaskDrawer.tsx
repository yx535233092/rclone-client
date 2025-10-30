import React, { useEffect } from 'react';
import { Button, Col, Drawer, Form, Input, Row, Select, Space } from 'antd';
import type { RemoteModelType } from '@/types/remote';

const { Option } = Select;

const TaskDrawer: React.FC<{
  open: boolean;
  closeDrawer: () => void;
  editingRecord?: RemoteModelType | null;
  onSave: (values: RemoteModelType) => void;
}> = ({ open, closeDrawer, editingRecord, onSave }) => {
  const [form] = Form.useForm();

  // 当编辑记录改变时，更新表单值
  useEffect(() => {
    if (open) {
      if (editingRecord) {
        form.setFieldsValue({
          name: editingRecord.name,
          remote_type: editingRecord.remote_type,
          protocol: editingRecord.protocol,
          ak: editingRecord.ak,
          sk: editingRecord.sk,
          endpoint: editingRecord.endpoint
        });
      } else {
        form.resetFields();
        // TODO 测试数据
        form.setFieldsValue({
          name: Date.now(),
          remote_type: 's3',
          protocol: 'Minio',
          ak: 'minioadmin',
          sk: 'minioadmin',
          endpoint: 'http://localhost:9000'
        });
      }
    }
  }, [open, editingRecord, form]);

  const onClose = () => {
    form.resetFields();
    closeDrawer();
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSave(values);
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <>
      <Drawer
        title={editingRecord ? '编辑目标设备' : '新建目标设备'}
        width={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80
          }
        }}
        extra={
          <Space>
            <Button onClick={onClose}>取消</Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="设备名称"
                rules={[{ required: true, message: '请输入设备名称' }]}
              >
                <Input placeholder="请输入设备名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="protocol"
                label="设备协议"
                rules={[{ required: true, message: '请输入设备协议' }]}
              >
                <Input style={{ width: '100%' }} placeholder="请输入设备协议" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="remote_type"
                label="设备类型"
                rules={[{ required: true, message: '请选择设备类型' }]}
              >
                <Select placeholder="请选择设备类型">
                  <Option value="s3">s3</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endpoint"
                label="Endpoint"
                rules={[{ required: true, message: '请输入Endpoint' }]}
              >
                <Input style={{ width: '100%' }} placeholder="请输入Endpoint" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="sk"
                label="SK"
                rules={[{ required: true, message: '请输入SK' }]}
              >
                <Input style={{ width: '100%' }} placeholder="请输入SK" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="ak"
                label="AK"
                rules={[{ required: true, message: '请输入AK' }]}
              >
                <Input style={{ width: '100%' }} placeholder="请输入AK" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item>
                <Button type="primary" onClick={handleSubmit}>
                  保存
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

export default TaskDrawer;
