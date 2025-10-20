import React, { useState } from 'react';
import {
  Space,
  Table,
  Modal,
  message,
  Typography,
  Tag,
  Button,
  Tooltip,
  Progress
} from 'antd';
import type { TableProps } from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Text } = Typography;

import SearchForm from './SearchForm';
import TaskDrawer from './TaskDrawer';

interface DataType {
  key: string;
  name: string;
  source?: string;
  target?: string;
  status?: '迁移中' | '完成';
  usedTime?: string;
  remainingTime?: string;
  age?: number;
  address?: string;
  tags?: string[];
  sourceDevice?: string; // 源端设备名称
  sourceBuket?: string; // bucket名称
  targetDevice?: string; // 目标端设备名称
  targetBuket?: string; // 目标端bucket名称
  progress?: number; // 迁移进度百分比 (0-100)
  migrateSpeed?: string; // 迁移速度
  migratedSize?: string; // 已迁移大小
  totalSize?: string; // 总大小
  concurrentNum?: string; // 并发数
  bandwidthLimit?: string; // 带宽限速
  retryCount?: string; // 自动增量周期
}

const data: DataType[] = [
  {
    key: '1',
    name: '任务001',
    source: '设备001',
    sourceDevice: 'Amazon S3',
    sourceBuket: 'test-bucket-1',
    target: '设备002',
    targetDevice: '阿里云OSS',
    targetBuket: 'backup-target-1',
    status: '迁移中',
    usedTime: '100s',
    remainingTime: '100s',
    progress: 65,
    migrateSpeed: '15.2MB/s',
    migratedSize: '2.1GB',
    totalSize: '3.2GB'
  },
  {
    key: '2',
    name: '任务002',
    source: '设备001',
    sourceDevice: '设备001',
    sourceBuket: 'backup-bucket',
    target: '设备002',
    targetDevice: '腾讯云COS',
    targetBuket: 'target-bucket-2',
    status: '完成',
    usedTime: '500s',
    remainingTime: '0s',
    progress: 100,
    migrateSpeed: '12.8MB/s',
    migratedSize: '5.8GB',
    totalSize: '5.8GB'
  },
  {
    key: '3',
    name: '任务003',
    source: '设备001',
    sourceDevice: 'OSS设备',
    sourceBuket: 'storage-bucket',
    target: '设备002',
    targetDevice: '华为云OBS',
    targetBuket: 'final-destination',
    status: '迁移中',
    usedTime: '200s',
    remainingTime: '150s',
    progress: 35,
    migrateSpeed: '8.5MB/s',
    migratedSize: '1.2GB',
    totalSize: '3.4GB'
  }
];

const MigrateTask: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DataType | null>(null);
  const [dataSource, setDataSource] = useState<DataType[]>(data);

  // 打开新建抽屉
  const handleCreate = () => {
    setEditingRecord(null);
    setOpen(true);
  };

  // 打开编辑抽屉
  const handleEdit = (record: DataType) => {
    setEditingRecord(record);
    setOpen(true);
  };

  // 暂停任务
  const handlePause = (record: DataType) => {
    message.info(`暂停任务: ${record.name}`);
    // 这里可以添加实际的暂停逻辑
  };

  // 启动任务
  const handleStart = (record: DataType) => {
    message.info(`启动任务: ${record.name}`);
    // 这里可以添加实际的启动逻辑
  };

  // 删除记录
  const handleDelete = (record: DataType) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除任务"${record.name}"吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setDataSource(dataSource.filter((item) => item.key !== record.key));
        message.success('删除成功');
      }
    });
  };

  // 关闭抽屉
  const handleCloseDrawer = () => {
    setOpen(false);
    setEditingRecord(null);
  };

  // 保存数据
  const handleSave = (values: Partial<DataType>) => {
    if (editingRecord) {
      // 编辑模式：只更新可编辑的字段
      setDataSource(
        dataSource.map((item) =>
          item.key === editingRecord.key
            ? {
                ...item,
                concurrentNum: values.concurrentNum || item.concurrentNum,
                bandwidthLimit: values.bandwidthLimit || item.bandwidthLimit,
                retryCount: values.retryCount || item.retryCount
              }
            : item
        )
      );
      message.success('编辑成功');
    } else {
      // 新建模式
      const newRecord: DataType = {
        key: Date.now().toString(),
        name: values.name || '',
        status: '迁移中', // 新建任务默认为迁移中状态
        progress: 0, // 初始进度为0
        migrateSpeed: '0MB/s', // 初始速度为0
        migratedSize: '0GB', // 初始已迁移大小为0
        totalSize: '0GB', // 初始总大小，后续可以更新
        ...values,
        sourceDevice: values.source, // 保存源端设备名称
        sourceBuket: values.sourceBuket, // 保存源端bucket名称
        targetDevice: values.target, // 保存目标端设备名称
        targetBuket: values.targetBuket // 保存目标端bucket名称
      };
      setDataSource([...dataSource, newRecord]);
      message.success('新建成功');
    }
    handleCloseDrawer();
  };

  // 动态生成columns
  const tableColumns: TableProps<DataType>['columns'] = [
    {
      title: (
        <span style={{ fontWeight: 600, color: '#1f2937' }}>任务名称</span>
      ),
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Text strong style={{ color: '#1f2937' }}>
          {text}
        </Text>
      ),
      width: 150
    },
    {
      title: <span style={{ fontWeight: 600, color: '#1f2937' }}>源端</span>,
      key: 'source',
      render: (_: unknown, record: DataType) => {
        const deviceName = record.sourceDevice || record.source || '未知设备';
        const bucketName = record.sourceBuket || '未知bucket';
        return (
          <div
            style={{
              padding: '6px 12px',
              backgroundColor: '#f0f9ff',
              borderRadius: '6px',
              border: '1px solid #e0f2fe'
            }}
          >
            <Text style={{ color: '#0369a1', fontSize: '13px' }}>
              {deviceName}：{bucketName}
            </Text>
          </div>
        );
      },
      width: 200
    },
    {
      title: <span style={{ fontWeight: 600, color: '#1f2937' }}>目标端</span>,
      key: 'target',
      render: (_: unknown, record: DataType) => {
        const deviceName = record.targetDevice || record.target || '未知设备';
        const bucketName = record.targetBuket || '未知bucket';
        return (
          <div
            style={{
              padding: '6px 12px',
              backgroundColor: '#fffbeb',
              borderRadius: '6px',
              border: '1px solid #fef3c7'
            }}
          >
            <Text style={{ color: '#d97706', fontSize: '13px' }}>
              {deviceName}：{bucketName}
            </Text>
          </div>
        );
      },
      width: 200
    },
    {
      title: <span style={{ fontWeight: 600, color: '#1f2937' }}>状态</span>,
      key: 'status',
      render: (_: unknown, record: DataType) => {
        if (record.status === '迁移中') {
          return (
            <div
              style={{
                padding: '8px',
                background: '#f0f9ff',
                borderRadius: '6px',
                border: '1px solid #e0f2fe'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '6px',
                  gap: '8px'
                }}
              >
                <Tag
                  color="processing"
                  icon={<PlayCircleOutlined />}
                  style={{ margin: 0, fontWeight: 500 }}
                >
                  迁移中
                </Tag>
                <Text
                  style={{
                    fontSize: '12px',
                    color: '#0369a1',
                    fontWeight: 600
                  }}
                >
                  {record.progress || 0}%
                </Text>
              </div>
              <Progress
                percent={record.progress || 0}
                size="small"
                showInfo={false}
                strokeColor="#3b82f6"
                trailColor="#e0f2fe"
                style={{ marginBottom: '6px' }}
              />
              <div
                style={{
                  fontSize: '11px',
                  color: '#64748b',
                  lineHeight: '16px'
                }}
              >
                <div style={{ marginBottom: '2px' }}>
                  <span>速度: </span>
                  <Text style={{ color: '#059669', fontWeight: 500 }}>
                    {record.migrateSpeed || '0MB/s'}
                  </Text>
                </div>
                <div>
                  <span>已迁移: </span>
                  <Text style={{ color: '#1f2937', fontWeight: 500 }}>
                    {record.migratedSize || '0GB'} / {record.totalSize || '0GB'}
                  </Text>
                </div>
              </div>
            </div>
          );
        } else if (record.status === '完成') {
          return (
            <div
              style={{
                padding: '8px',
                background: '#f0fdf4',
                borderRadius: '6px',
                border: '1px solid #dcfce7'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '4px'
                }}
              >
                <Tag
                  color="success"
                  icon={<CheckCircleOutlined />}
                  style={{ margin: 0, fontWeight: 500 }}
                >
                  完成
                </Tag>
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#16a34a',
                  fontWeight: 500
                }}
              >
                总计: {record.totalSize || '0GB'}
              </div>
            </div>
          );
        }
        return <Tag>{record.status || '未知'}</Tag>;
      },
      width: 220
    },
    {
      title: (
        <span style={{ fontWeight: 600, color: '#1f2937' }}>已用时间</span>
      ),
      dataIndex: 'usedTime',
      key: 'usedTime',
      render: (text: string) => (
        <Text style={{ color: '#64748b', fontSize: '13px' }}>{text}</Text>
      ),
      width: 100
    },
    {
      title: (
        <span style={{ fontWeight: 600, color: '#1f2937' }}>剩余时间</span>
      ),
      dataIndex: 'remainingTime',
      key: 'remainingTime',
      render: (text: string) => (
        <Text style={{ color: '#ef4444', fontSize: '13px' }}>{text}</Text>
      ),
      width: 100
    },
    {
      title: <span style={{ fontWeight: 600, color: '#1f2937' }}>操作</span>,
      key: 'action',
      render: (_: unknown, record: DataType) => (
        <Space size="small">
          {record.status === '迁移中' && (
            <Tooltip title="暂停任务">
              <Button
                type="text"
                size="small"
                icon={<PauseCircleOutlined />}
                onClick={() => handlePause(record)}
                style={{ color: '#f59e0b' }}
              />
            </Tooltip>
          )}
          {record.status === '完成' && (
            <Tooltip title="重新启动">
              <Button
                type="text"
                size="small"
                icon={<PlayCircleOutlined />}
                onClick={() => handleStart(record)}
                style={{ color: '#10b981' }}
              />
            </Tooltip>
          )}
          <Tooltip title="编辑任务">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ color: '#3b82f6' }}
            />
          </Tooltip>
          <Tooltip title="删除任务">
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              style={{ color: '#ef4444' }}
            />
          </Tooltip>
        </Space>
      ),
      width: 140,
      fixed: 'right' as const
    }
  ];

  return (
    <>
      <SearchForm openDrawer={handleCreate} />
      <Table<DataType>
        columns={tableColumns}
        dataSource={dataSource}
        rowKey="key"
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
          pageSizeOptions: ['10', '20', '50', '100'],
          defaultPageSize: 10
        }}
        scroll={{ x: 1200 }}
        style={{
          backgroundColor: '#ffffff'
        }}
        className="migrate-task-table"
        size="middle"
      />
      <TaskDrawer
        open={open}
        closeDrawer={handleCloseDrawer}
        editingRecord={editingRecord}
        onSave={handleSave}
      />
    </>
  );
};

export default MigrateTask;
