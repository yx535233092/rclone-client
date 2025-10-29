import React, { useEffect } from 'react';
import { Button, Col, Drawer, Form, Input, Row, Space, Select } from 'antd';
import type { JobResponseType } from '@/types/job';
import type { RemoteResponseType } from '@/types/remote';

const TaskDrawer: React.FC<{
  open: boolean;
  closeDrawer: () => void;
  editingRecord?: JobResponseType | null;
  onSave: (values: Partial<JobResponseType>) => void;
  sourceDevices: RemoteResponseType[];
  targetDevices: RemoteResponseType[];
}> = ({
  open,
  closeDrawer,
  editingRecord,
  onSave,
  sourceDevices,
  targetDevices
}) => {
  const [form] = Form.useForm();

  // 当编辑记录改变时，更新表单值
  useEffect(() => {
    if (open) {
      if (editingRecord) {
        const rclone_options = JSON.parse(editingRecord.rclone_options);
        // 编辑模式：只设置可编辑的字段
        form.setFieldsValue({
          concurrent: rclone_options.concurrent,
          limit_speed: rclone_options.limit_speed,
          increment_circle: rclone_options.increment_circle || 0
        });
      } else {
        form.resetFields();
        // TODO:测试数据
        form.setFieldsValue({
          name: Date.now(),
          source_remote_id: sourceDevices[0]?.id,
          target_remote_id: targetDevices[0]?.id,
          source_bucket_name: 'my-bucket',
          source_url: '/',
          target_bucket_name: 'another-bucket',
          target_url: '/',
          concurrent: 1,
          limit_speed: 0.1,
          increment_circle: 0
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
        console.log(values);
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
                    name="name"
                    label="任务名称"
                    rules={[{ required: true, message: '请输入设备名称' }]}
                  >
                    <Input placeholder="请输入设备名称" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="source_remote_id" label="源端">
                    <Select placeholder="请选择源端设备">
                      {sourceDevices.map((device) => (
                        <Select.Option key={device.id} value={device.id}>
                          {device.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="source_bucket_name" label="bucket名称">
                    <Input placeholder="请输入bucket名称" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="source_url" label="路径">
                    <Input style={{ width: '100%' }} placeholder="请输入路径" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="target_remote_id" label="目标端">
                    <Select placeholder="请选择目标端设备">
                      {targetDevices.map((device) => (
                        <Select.Option key={device.id} value={device.id}>
                          {device.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="target_bucket_name" label="bucket名称">
                    <Input placeholder="请输入bucket名称" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="target_url" label="路径">
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
                        editingRecord.source_remote.split(':')[0] || '未知设备'
                      }
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="bucket名称">
                    <Input
                      value={
                        editingRecord.source_remote
                          .split(':')[1]
                          .split('/')[0] || '未知bucket'
                      }
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="路径">
                    <Input
                      value={
                        editingRecord.source_remote.match(/.*(\/.*)/)?.[1] ||
                        '-'
                      }
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
                        editingRecord.target_remote.split(':')[0] || '未知设备'
                      }
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="bucket名称">
                    <Input
                      value={
                        editingRecord.target_remote
                          .split(':')[1]
                          .split('/')[0] || '未知bucket'
                      }
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="路径">
                    <Input
                      value={
                        editingRecord.source_remote.match(/.*(\/.*)/)?.[1] ||
                        '-'
                      }
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
              <Form.Item name="concurrent" label="并发数">
                <Input placeholder="请输入并发数" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="limit_speed" label="带宽限速（可选）">
                <Input
                  type="number"
                  placeholder="请输入带宽限速，如：10Mb/s（可选填写）"
                  suffix="Mb/s"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="increment_circle" label="自动增量周期（可选）">
                <Input
                  disabled
                  type="number"
                  placeholder="请输入自动增量周期，如：3600s（可选填写）"
                  suffix="s"
                />
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
