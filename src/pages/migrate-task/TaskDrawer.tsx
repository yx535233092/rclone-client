import React, { useEffect } from 'react';
import { Button, Col, Drawer, Form, Input, Row, Select, Space } from 'antd';

const { Option } = Select;

interface DataType {
  key: string;
  name: string;
  source?: string;
  target?: string;
  status?: string;
  usedTime?: string;
  remainingTime?: string;
  sourceBuket?: string;
  sourceUrl?: string;
  targetBuket?: string;
  targetUrl?: string;
  concurrentNum?: string;
  bandwidthLimit?: string;
  retryCount?: string;
}

const TaskDrawer: React.FC<{
  open: boolean;
  closeDrawer: () => void;
  editingRecord?: DataType | null;
  onSave: (values: Partial<DataType>) => void;
}> = ({ open, closeDrawer, editingRecord, onSave }) => {
  const [form] = Form.useForm();

  // 当编辑记录改变时，更新表单值
  useEffect(() => {
    if (open) {
      if (editingRecord) {
        form.setFieldsValue({
          deviceName: editingRecord.name,
          protocol: editingRecord.source,
          sourceBuket: editingRecord.sourceBuket,
          sourceUrl: editingRecord.sourceUrl,
          targetBuket: editingRecord.targetBuket,
          targetUrl: editingRecord.targetUrl,
          concurrentNum: editingRecord.concurrentNum,
          bandwidthLimit: editingRecord.bandwidthLimit,
          retryCount: editingRecord.retryCount
        });
      } else {
        form.resetFields();
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
        const submitData = {
          name: values.deviceName,
          source: values.protocol,
          sourceBuket: values.sourceBuket,
          sourceUrl: values.sourceUrl,
          targetBuket: values.targetBuket,
          targetUrl: values.targetUrl,
          concurrentNum: values.concurrentNum,
          bandwidthLimit: values.bandwidthLimit,
          retryCount: values.retryCount
        };
        onSave(submitData);
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <>
      <Drawer
        title={editingRecord ? '编辑迁移任务' : '新建迁移任务'}
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
        <Form form={form} layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="deviceName"
                label="任务名称"
                rules={[{ required: true, message: '请输入设备名称' }]}
              >
                <Input placeholder="请输入设备名称" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="protocol" label="源端">
                <Select placeholder="请选择源端设备">
                  <Option value="1">Amazon S3</Option>
                  <Option value="2">Amazon S3</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="sourceBuket" label="buket名称">
                <Input placeholder="请输入buket名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="sourceUrl" label="路径">
                <Input style={{ width: '100%' }} placeholder="请输入路径" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="protocol" label="目标端">
                <Select placeholder="请选择目标端设备">
                  <Option value="1">Amazon S3</Option>
                  <Option value="2">Amazon S3</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="targetBuket" label="buket名称">
                <Input placeholder="请输入buket名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="targetUrl" label="路径">
                <Input style={{ width: '100%' }} placeholder="请输入路径" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="concurrentNum" label="并发数">
                <Input placeholder="请输入并发数" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="bandwidthLimit" label="带宽限速">
                <Input placeholder="请输入带宽限速" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="retryCount" label="自动增量周期">
                <Input placeholder="请输入自动增量周期" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item>
                <Button type="primary" onClick={handleSubmit}>
                  启动
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
