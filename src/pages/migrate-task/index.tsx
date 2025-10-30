import React, { useEffect, useRef, useState, useCallback } from 'react';
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
import { getRemotesAPI } from '@/api/remote';
import {
  createJobAPI,
  getJobsAPI,
  deleteJobAPI,
  stopJobAPI,
  restartJobAPI,
  updateJobAPI
} from '@/api/job';
import type { JobModelType, JobParamsType } from '@/types/job';
import type { RemoteResponseType } from '@/types/remote';

const MigrateTask: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<JobModelType | null>(null);
  const [persistantDataSource, setPersistantDataSource] = useState<
    JobModelType[]
  >([]);
  const [dataSource, setDataSource] = useState<JobModelType[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState<JobModelType | null>(
    null
  );
  const [ws, setWs] = useState<WebSocket | null>(null);
  const dataSourceRef = useRef<JobModelType[]>([]);
  const [sourceDevices, setSourceDevices] = useState<RemoteResponseType[]>([]);
  const [targetDevices, setTargetDevices] = useState<RemoteResponseType[]>([]);

  // 打开新建抽屉
  const handleCreate = () => {
    setEditingRecord(null);
    setOpen(true);
  };

  // 打开编辑抽屉
  const handleEdit = (record: JobModelType) => {
    setEditingRecord(record);
    setOpen(true);
  };

  // 停止任务
  const handleStop = async (record: JobModelType) => {
    const id = record.id;
    if (id) {
      const res = await stopJobAPI(id);
      if (res.code === 200) {
        message.success(res.message);
        getJobs();
      }
    }
  };

  // 重启任务
  const handleReStart = async (record: JobModelType) => {
    try {
      if (record.id) {
        const res = await restartJobAPI(record.id);
        if (res.code === 200) {
          message.success(res.message);
          getJobs();
        }
      }
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  // 删除记录
  const handleDelete = (record: JobModelType) => {
    setDeletingRecord(record);
    setDeleteModalOpen(true);
  };

  // 确认删除
  const handleConfirmDelete = async () => {
    if (deletingRecord && deletingRecord.id) {
      try {
        const res = await deleteJobAPI(deletingRecord.id);
        if (res.code === 200) {
          message.success(res.message);
          getJobs();
        }
      } catch (error) {
        console.error(error);
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
  const handleSave = async (values: Partial<JobParamsType>) => {
    if (editingRecord) {
      try {
        // 编辑模式：只更新可编辑的字段
        const res = await updateJobAPI(
          editingRecord.id!,
          values as JobParamsType
        );
        if (res.code === 200) {
          message.success(res.message);
          getJobs();
        }
        getJobs();
      } catch (error) {
        message.error((error as Error).message);
      }
    } else {
      // 新建模式
      try {
        const res = await createJobAPI(values as JobParamsType);
        if (res.code === 200) {
          message.success(res.message);
          // await startTaskAPI((res.data as { id: number }).id);
          getJobs();
        }
      } catch (error) {
        console.error(error);
      }
    }
    handleCloseDrawer();
  };

  // 获取任务列表
  const getJobs = async () => {
    try {
      const res = await getJobsAPI();
      if (res.code === 200 && res.data) {
        const newRecords: JobModelType[] = res.data.map((item) => {
          return {
            ...item,
            key: item.id,
            rcloneData: null
          };
        });
        setDataSource(newRecords);
        setPersistantDataSource(newRecords);
        dataSourceRef.current = newRecords;
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 创建ws连接
  const createWs = useCallback(() => {
    const ws = new WebSocket('ws://localhost:3000');
    setWs(ws);
    ws.onmessage = (event) => {
      const { jobId, data, status, type } = JSON.parse(event.data);
      if (type && type === 'heartbeat') {
        ws.send(
          JSON.stringify({
            type: 'heartbeat',
            message: 'pong'
          })
        );
      }
      setDataSource((currentDataSource) => {
        const updated = currentDataSource.map((item) => {
          if (item.id === jobId) {
            return {
              ...item,
              status,
              rcloneData: data
            };
          }
          return item;
        });
        // setFilteredDataSource(updated);
        return updated;
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
  }, []);

  // 获取设备列表
  const getDevices = async () => {
    try {
      const sourceDevices = await getRemotesAPI({ type: 'source' });
      const targetDevices = await getRemotesAPI({ type: 'target' });
      if (sourceDevices.code === 200 && sourceDevices.data) {
        setSourceDevices(sourceDevices.data);
      }
      if (targetDevices.code === 200 && targetDevices.data) {
        setTargetDevices(targetDevices.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 搜索
  const handleSearch = async (values: {
    name: string;
    sourceDeviceId: number;
    targetDeviceId: number;
  }) => {
    const { name, sourceDeviceId, targetDeviceId } = values;
    const filtered = persistantDataSource.filter((item) => {
      const nameMatch =
        !name || item.name?.toLowerCase().includes(name.toLowerCase());

      // 根据设备名称匹配，因为JobModelType中没有source_remote_id字段
      console.log(sourceDevices);
      const sourceMatch =
        !sourceDeviceId ||
        sourceDevices.find((device) => device.id === sourceDeviceId)?.name ===
          item.source_remote.split(':')[0];
      const targetMatch =
        !targetDeviceId ||
        targetDevices.find((device) => device.id === targetDeviceId)?.name ===
          item.target_remote.split(':')[0];

      return nameMatch && sourceMatch && targetMatch;
    });
    setDataSource(filtered);
  };

  // 重置
  const handleReset = () => {
    getJobs();
  };

  useEffect(() => {
    getJobs();
    getDevices();
    // 建立socket连接
    if (!ws) {
      createWs();
    }
  }, [ws, createWs]);

  // 动态生成columns
  const tableColumns: TableProps<JobModelType>['columns'] = [
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
      render: (_: unknown, record: JobModelType) => {
        const sourceRemote = record.source_remote || '未知设备';
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
              {sourceRemote}
            </Text>
          </div>
        );
      },
      width: 200
    },
    {
      title: <span style={{ fontWeight: 600, color: '#1f2937' }}>目标端</span>,
      key: 'target',
      render: (_: unknown, record: JobModelType) => {
        const targetRemote = record.target_remote || '未知设备';
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
              {targetRemote}
            </Text>
          </div>
        );
      },
      width: 200
    },
    {
      title: <span style={{ fontWeight: 600, color: '#1f2937' }}>状态</span>,
      key: 'status',
      render: (_: unknown, record: JobModelType) => {
        switch (record.status) {
          case 'NEW':
            return <Tag color="processing">{'等待启动'}</Tag>;
          case 'RUNNING':
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
                    {record.rcloneData?.stats.bytes
                      ? (
                          ((record.rcloneData?.stats.bytes || 0) /
                            (record.rcloneData?.stats.totalBytes || 1024)) *
                          100
                        ).toFixed(2) + '%'
                      : '0%'}
                  </Text>
                </div>
                <Progress
                  percent={
                    record.rcloneData?.stats.bytes
                      ? Number(
                          (
                            (record.rcloneData?.stats.bytes /
                              record.rcloneData?.stats.totalBytes) *
                            100
                          ).toFixed(2)
                        )
                      : 0
                  }
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
                      {record.rcloneData?.stats.speed
                        ? (
                            record.rcloneData?.stats.speed /
                            1024 /
                            1024
                          ).toFixed(2) + 'MB/s'
                        : '0MB/s'}
                    </Text>
                  </div>
                  <div>
                    <span>已迁移: </span>
                    <Text style={{ color: '#1f2937', fontWeight: 500 }}>
                      {record.rcloneData?.stats.bytes
                        ? (record.rcloneData?.stats.bytes / 1024 / 1024)
                            .toString()
                            .slice(0, 5) + 'MB'
                        : '0MB'}{' '}
                      /{' '}
                      {record.rcloneData?.stats.totalBytes
                        ? (record.rcloneData?.stats.totalBytes / 1024 / 1024)
                            .toString()
                            .slice(0, 5) + 'MB'
                        : '0MB'}
                    </Text>
                  </div>
                </div>
              </div>
            );
          case 'COMPLETED':
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
                  {record.total_size_bytes === 0
                    ? '数据已迁移'
                    : '总计: ' +
                      (record.total_size_bytes
                        ? record.total_size_bytes / 1024 / 1024
                        : 0
                      ).toFixed(2) +
                      'MB'}
                </div>
              </div>
            );

          case 'FAILED':
            return <Tag color="red">{'迁移失败'}</Tag>;
          case 'CANCELED':
            return <Tag color="yellow">{'迁移停止'}</Tag>;
          default:
            return <Tag>{'未知状态'}</Tag>;
        }
      },
      width: 220
    },
    {
      title: (
        <span style={{ fontWeight: 600, color: '#1f2937' }}>已用时间</span>
      ),
      key: 'usedTime',
      render: (_: unknown, record: JobModelType) => (
        <Text style={{ color: '#64748b', fontSize: '13px' }}>
          {record.rcloneData?.stats?.elapsedTime
            ? record.rcloneData?.stats?.elapsedTime.toFixed(0) + 's'
            : '-'}
        </Text>
      ),
      width: 100
    },
    {
      title: (
        <span style={{ fontWeight: 600, color: '#1f2937' }}>剩余时间</span>
      ),
      key: 'remainingTime',
      render: (_: unknown, record: JobModelType) => (
        <Text style={{ color: '#ef4444', fontSize: '13px' }}>
          {record.rcloneData?.stats?.eta
            ? record.rcloneData?.stats?.eta.toFixed(0) + 's'
            : '-'}
        </Text>
      ),
      width: 100
    },
    {
      title: <span style={{ fontWeight: 600, color: '#1f2937' }}>操作</span>,
      key: 'action',
      render: (_: unknown, record: JobModelType) => (
        <Space size="small">
          {record.status === 'NEW' && (
            <Tooltip title="编辑任务">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
                style={{ color: '#3b82f6' }}
              />
            </Tooltip>
          )}
          {record.status === 'RUNNING' && (
            <Tooltip title="停止任务">
              <Button
                type="text"
                size="small"
                icon={<PauseCircleOutlined />}
                onClick={() => handleStop(record)}
                style={{ color: '#f59e0b' }}
              />
            </Tooltip>
          )}
          {record.status === 'CANCELED' && (
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
          {record.status === 'COMPLETED' && (
            <Tooltip title="重新启动">
              <Button
                type="text"
                size="small"
                icon={<PlayCircleOutlined />}
                onClick={() => handleReStart(record)}
                style={{ color: '#10b981' }}
              />
            </Tooltip>
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
      <SearchForm
        openDrawer={handleCreate}
        sourceDevices={sourceDevices}
        targetDevices={targetDevices}
        onSearch={handleSearch}
        onReset={handleReset}
      />
      <Table
        columns={tableColumns}
        dataSource={dataSource}
        rowKey="key"
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
        sourceDevices={sourceDevices}
        targetDevices={targetDevices}
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
