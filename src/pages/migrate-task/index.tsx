import React, { useEffect, useRef, useState } from 'react';
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
import type { TaskType } from '@/types/task';

const { Text } = Typography;

import SearchForm from './SearchForm';
import TaskDrawer from './TaskDrawer';
import {
  createTaskAPI,
  deleteTaskAPI,
  getTasksAPI,
  startTaskAPI,
  stopTaskAPI,
  updateTaskAPI
} from '@/apis/task';

const data: TaskType[] = [];

const MigrateTask: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TaskType | null>(null);
  const [dataSource, setDataSource] = useState<TaskType[]>(data);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState<TaskType | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const dataSourceRef = useRef<TaskType[]>([]);

  // 打开新建抽屉
  const handleCreate = () => {
    setEditingRecord(null);
    setOpen(true);
  };

  // 打开编辑抽屉
  const handleEdit = (record: TaskType) => {
    setEditingRecord(record);
    setOpen(true);
  };

  // 暂停任务
  const handlePause = async (record: TaskType) => {
    const id = record.id;
    if (id) {
      const res = await stopTaskAPI(id);
      if (res.code === 200) {
        message.success(res.message);
        getTasks();
      }
    }
  };

  // 启动任务
  const handleReStart = async (record: TaskType) => {
    try {
      if (record.id) {
        const res = await startTaskAPI(record.id);
        if (res.code === 200) {
          message.success(res.message);
          getTasks();
        }
      }
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  // 删除记录
  const handleDelete = (record: TaskType) => {
    setDeletingRecord(record);
    setDeleteModalOpen(true);
  };

  // 确认删除
  const handleConfirmDelete = async () => {
    if (deletingRecord && deletingRecord.id) {
      try {
        const res = await deleteTaskAPI(deletingRecord.id);
        if (res.code === 200) {
          message.success(res.message);
          getTasks();
        }
      } catch (error) {
        message.error((error as Error).message);
      }
      setDeleteModalOpen(false);
      setDeletingRecord(null);
    }
  };

  // 取消删除
  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setDeletingRecord(null);
  };

  // 关闭抽屉
  const handleCloseDrawer = () => {
    setOpen(false);
    setEditingRecord(null);
  };

  // 保存数据
  const handleSave = async (values: Partial<TaskType>) => {
    if (editingRecord) {
      try {
        // 编辑模式：只更新可编辑的字段
        await updateTaskAPI(editingRecord.id!, values);
        message.success('编辑成功');
        getTasks();
      } catch (error) {
        message.error((error as Error).message);
      }
    } else {
      // 新建模式
      try {
        const res = await createTaskAPI(values as TaskType);
        if (res.code === 200) {
          message.success(res.message);
          await startTaskAPI((res.data as { id: number }).id);
          getTasks();
        }
      } catch (error) {
        message.error((error as Error).message);
      }
    }
    handleCloseDrawer();
  };

  const getTasks = async () => {
    const res = await getTasksAPI();
    if (res.code === 200 && res.data) {
      const newRecords = (res.data as TaskType[]).map((item) => {
        return {
          ...item,
          key: item.id
        };
      });
      setDataSource(newRecords as TaskType[]);
      dataSourceRef.current = newRecords as TaskType[];
    }
  };

  const createWs = () => {
    const ws = new WebSocket('ws://localhost:3000');
    setWs(ws);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setDataSource((currentDataSource) => {
        return currentDataSource.map((item) => {
          if (item.id?.toString() === data.taskId) {
            return {
              ...item,
              status:
                data.taskInfo.percent === '100%' ? 'success' : item.status,
              percent: data.taskInfo.percent,
              downloadSpeed: data.taskInfo.downloadSpeed,
              transferredSize: data.taskInfo.transferredSize,
              totalSize: data.taskInfo.totalSize,
              elapsedTime: data.taskInfo.elapsedTime,
              remainingTime: data.taskInfo.remainingTime
            };
          }
          return item;
        });
      });
    };
    ws.onopen = () => {
      console.log('ws连接成功');
    };
    ws.onclose = () => {
      console.log('ws连接关闭');
    };
    ws.onerror = () => {
      console.log('ws连接错误');
    };
  };

  useEffect(() => {
    getTasks();

    // 建立socket连接
    if (!ws) {
      createWs();
    }
  }, []);

  // 动态生成columns
  const tableColumns: TableProps<TaskType>['columns'] = [
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
      render: (_: unknown, record: TaskType) => {
        const deviceName = record.source_device_id || '未知设备';
        const bucketName = record.source_bucket_name || '未知bucket';
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
      render: (_: unknown, record: TaskType) => {
        const deviceName = record.target_device_id || '未知设备';
        const bucketName = record.target_bucket_name || '未知bucket';
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
      render: (_: unknown, record: TaskType) => {
        if (record.status === 'migration') {
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
                  {record.percent || '0%'}
                </Text>
              </div>
              <Progress
                percent={Number(record.percent?.replace('%', '')) || 0}
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
                    {record.downloadSpeed || '0MB/s'}
                  </Text>
                </div>
                <div>
                  <span>已迁移: </span>
                  <Text style={{ color: '#1f2937', fontWeight: 500 }}>
                    {record.transferredSize || '0GB'} /{' '}
                    {record.totalSize || '0GB'}
                  </Text>
                </div>
              </div>
            </div>
          );
        } else if (record.status === 'success') {
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
                  迁移成功
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
        } else if (record.status === 'stopped') {
          return <Tag color="red">{'已停止'}</Tag>;
        } else if (record.status === 'failed') {
          return <Tag color="red">{'迁移失败'}</Tag>;
        } else if (record.status === 'init') {
          return <Tag>{'初始化中'}</Tag>;
        }
        return <Tag>{'未知状态'}</Tag>;
      },
      width: 220
    },
    {
      title: (
        <span style={{ fontWeight: 600, color: '#1f2937' }}>已用时间</span>
      ),
      dataIndex: 'elapsedTime',
      key: 'usedTime',
      render: (text: string) => (
        <Text style={{ color: '#64748b', fontSize: '13px' }}>
          {text || '0s'}
        </Text>
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
        <Text style={{ color: '#ef4444', fontSize: '13px' }}>
          {text || '0s'}
        </Text>
      ),
      width: 100
    },
    {
      title: <span style={{ fontWeight: 600, color: '#1f2937' }}>操作</span>,
      key: 'action',
      render: (_: unknown, record: TaskType) => (
        <Space size="small">
          {record.status === 'migration' && (
            <Tooltip title="停止任务">
              <Button
                type="text"
                size="small"
                icon={<PauseCircleOutlined />}
                onClick={() => handlePause(record)}
                style={{ color: '#f59e0b' }}
              />
            </Tooltip>
          )}
          {record.status === 'stopped' && (
            <>
              <Tooltip title="重新启动">
                <Button
                  type="text"
                  size="small"
                  icon={<PlayCircleOutlined />}
                  onClick={() => handleReStart(record)}
                  style={{ color: '#10b981' }}
                />
              </Tooltip>
              <Tooltip title="编辑任务">
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record)}
                  style={{ color: '#3b82f6' }}
                />
              </Tooltip>
            </>
          )}

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
      <Table<TaskType>
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

      {/* 删除确认 Modal */}
      <Modal
        title="确认删除"
        open={deleteModalOpen}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="确认"
        cancelText="取消"
        centered
      >
        <p>确定要删除任务"{deletingRecord?.name}"吗？</p>
      </Modal>
    </>
  );
};

export default MigrateTask;
