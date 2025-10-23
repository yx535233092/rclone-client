import React, { useEffect } from 'react';
import { Button, Col, Drawer, Form, Input, Row, Select, Space } from 'antd';

const { Option } = Select;

interface DataType {
  key: string;
  name: string;
  source?: string;
  target?: string;
  status?: '迁移中' | '完成';
  usedTime?: string;
  remainingTime?: string;
  sourceBucket?: string;
  sourceUrl?: string;
  targetBucket?: string;
  targetUrl?: string;
  concurrentNum?: string;
  bandwidthLimit?: string;
  retryCount?: string;
  sourceDevice?: string; // 源端设备名称
  targetDevice?: string; // 目标端设备名称
  progress?: number; // 迁移进度百分比 (0-100)
  migrateSpeed?: string; // 迁移速度
  migratedSize?: string; // 已迁移大小
  totalSize?: string; // 总大小
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
        // 编辑模式：只设置可编辑的字段
        form.setFieldsValue({
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
        let submitData;
        if (editingRecord) {
          // 编辑模式：只提交可编辑的字段
          submitData = {
            concurrentNum: values.concurrentNum,
            bandwidthLimit: values.bandwidthLimit,
            retryCount: values.retryCount
          };
        } else {
          // 新建模式：提交所有字段
          submitData = {
            name: values.deviceName,
            source: values.protocol,
            sourceBucket: values.sourceBucket,
            sourceUrl: values.sourceUrl,
            target: values.targetProtocol,
            targetBucket: values.targetBucket,
            targetUrl: values.targetUrl,
            concurrentNum: values.concurrentNum,
            bandwidthLimit: values.bandwidthLimit,
            retryCount: values.retryCount
          };
        }
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
          {!editingRecord && (
            <>
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
                  <Form.Item name="sourceBucket" label="bucket名称">
                    <Input placeholder="请输入bucket名称" />
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
                  <Form.Item name="targetProtocol" label="目标端">
                    <Select placeholder="请选择目标端设备">
                      <Option value="1">Amazon S3</Option>
                      <Option value="2">Amazon S3</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="targetBucket" label="bucket名称">
                    <Input placeholder="请输入bucket名称" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="targetUrl" label="路径">
                    <Input style={{ width: '100%' }} placeholder="请输入路径" />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
          {editingRecord && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="任务名称">
                    <Input value={editingRecord.name} disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="源端">
                    <Input
                      value={
                        editingRecord.sourceDevice ||
                        editingRecord.source ||
                        '未知设备'
                      }
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="bucket名称">
                    <Input
                      value={editingRecord.sourceBucket || '未知bucket'}
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="路径">
                    <Input
                      value={editingRecord.sourceUrl || '-'}
                      style={{ width: '100%' }}
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="目标端">
                    <Input
                      value={
                        editingRecord.targetDevice ||
                        editingRecord.target ||
                        '未知设备'
                      }
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="bucket名称">
                    <Input
                      value={editingRecord.targetBucket || '未知bucket'}
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="路径">
                    <Input
                      value={editingRecord.targetUrl || '-'}
                      style={{ width: '100%' }}
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Row>
              <div
                style={{
                  marginBottom: '16px',
                  padding: '12px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef',
                  color: '#6c757d',
                  fontSize: '13px'
                }}
              >
                编辑模式下只能修改并发数、带宽限速和自动增量周期
              </div>
            </>
          )}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="concurrentNum" label="并发数">
                <Input placeholder="请输入并发数" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="bandwidthLimit" label="带宽限速（可选）">
                <Input placeholder="请输入带宽限速，如：10MB/s（可选填写）" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="retryCount" label="自动增量周期（可选）">
                <Input placeholder="请输入自动增量周期，如：3600s（可选填写）" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item>
                <Button type="primary" onClick={handleSubmit}>
                  {editingRecord ? '更新任务' : '启动任务'}
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
