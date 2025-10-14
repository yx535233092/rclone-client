import React from 'react';
import { Button, Col, Drawer, Form, Input, Row, Select, Space } from 'antd';

const { Option } = Select;

const TaskDrawer: React.FC<{
  open: boolean;
  closeDrawer: () => void;
}> = ({ open, closeDrawer }) => {
  const onClose = () => {
    closeDrawer();
  };

  return (
    <>
      <Drawer
        title="新建源设备"
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
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="deviceName"
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
                name="deviceType"
                label="设备类型"
                rules={[{ required: true, message: '请选择设备类型' }]}
              >
                <Select placeholder="请选择设备类型">
                  <Option value="1">Amazon S3</Option>
                  <Option value="2">Amazon S3</Option>
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
                <Button type="primary">保存</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

export default TaskDrawer;
