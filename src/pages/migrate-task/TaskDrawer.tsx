import React, { useEffect, useState } from 'react';
import { Button, Col, Drawer, Form, Input, Row, Select, Space } from 'antd';
import type { TaskType } from '@/types/task';
import { getDevicesAPI } from '@/apis/device';
import type { DeviceType } from '@/types/device';

const { Option } = Select;

const TaskDrawer: React.FC<{
  open: boolean;
  closeDrawer: () => void;
  editingRecord?: TaskType | null;
  onSave: (values: Partial<TaskType>) => void;
}> = ({ open, closeDrawer, editingRecord, onSave }) => {
  const [form] = Form.useForm();
  const [sourceDevices, setSourceDevices] = useState<DeviceType[]>([]);
  const [targetDevices, setTargetDevices] = useState<DeviceType[]>([]);

  // 当编辑记录改变时，更新表单值
  useEffect(() => {
    if (open) {
      if (editingRecord) {
        // 编辑模式：只设置可编辑的字段
        form.setFieldsValue({
          concurrent: editingRecord.concurrent,
          limit_speed: editingRecord.limit_speed,
          increment_circle: editingRecord.increment_circle
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          name: 'test',
          source_device_id: sourceDevices[0]?.id,
          target_device_id: targetDevices[0]?.id,
          source_bucket_name: 'my-bucket',
          source_url: 'test',
          target_bucket_name: 'another-bucket',
          target_url: 'test',
          concurrent: 1,
          limit_speed: 1,
          increment_circle: 0
        });
      }
    }
  }, [open, editingRecord, form]);

  // 获取源端与目标端设备列表
  useEffect(() => {
    const getDevices = async () => {
      const sourceRes = await getDevicesAPI({ device_type: 'source' });
      const targetRes = await getDevicesAPI({ device_type: 'target' });

      if (sourceRes.code === 200 && sourceRes.data) {
        setSourceDevices(sourceRes.data);
      }
      if (targetRes.code === 200 && targetRes.data) {
        setTargetDevices(targetRes.data);
      }
    };
    getDevices();
  }, []);

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
            concurrent: values.concurrent,
            limit_speed: values.limit_speed,
            increment_circle: values.increment_circle
          };
        } else {
          // 新建模式：提交所有字段
          submitData = {
            ...values
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
                  <Form.Item name="source_device_id" label="源端">
                    <Select placeholder="请选择源端设备">
                      {sourceDevices.map((device) => (
                        <Option key={device.id} value={device.id}>
                          {device.name}
                        </Option>
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
                  <Form.Item name="target_device_id" label="目标端">
                    <Select placeholder="请选择目标端设备">
                      {targetDevices.map((device) => (
                        <Option key={device.id} value={device.id}>
                          {device.name}
                        </Option>
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
                    <Input value={editingRecord.source_device_id} disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="源端">
                    <Input
                      value={editingRecord.source_device_id || '未知设备'}
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="bucket名称">
                    <Input
                      value={editingRecord.source_bucket_name || '未知bucket'}
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="路径">
                    <Input
                      value={editingRecord.source_url || '-'}
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
                      value={editingRecord.target_device_id || '未知设备'}
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="bucket名称">
                    <Input
                      value={editingRecord.target_bucket_name || '未知bucket'}
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="路径">
                    <Input
                      value={editingRecord.target_url || '-'}
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
