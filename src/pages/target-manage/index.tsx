import React, { useEffect, useState } from 'react';
import {
  Space,
  Table,
  Modal,
  message,
  Typography,
  Button,
  Tooltip
} from 'antd';
import type { TableProps } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
const { Text } = Typography;

import SearchForm from './SearchForm';
import TaskDrawer from './TaskDrawer';
import {
  createRemoteAPI,
  getRemotesAPI,
  updateRemoteAPI,
  deleteRemoteAPI
} from '@/api/remote';
import type { RemoteModelType } from '@/types/remote';

const SourceManage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RemoteModelType | null>(
    null
  );
  const [dataSource, setDataSource] = useState<RemoteModelType[]>([]);
  const [filteredDataSource, setFilteredDataSource] = useState<
    RemoteModelType[]
  >([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState<RemoteModelType | null>(
    null
  );
  const [messageApi, contextHolder] = message.useMessage();

  // 获取列表
  const getList = async () => {
    const res = await getRemotesAPI({ type: 'target' });
    if (res.code === 200 && res.data) {
      const listData = res.data.map((item) => {
        const config = JSON.parse(item.config_json);
        const newItem = {
          key: item.id,
          ...item,
          ...config
        };
        return newItem;
      });
      setDataSource(listData);
      setFilteredDataSource(listData);
    }
  };

  // 打开新建抽屉
  const handleCreate = () => {
    setEditingRecord(null);
    setOpen(true);
  };

  // 打开编辑抽屉
  const handleEdit = (record: RemoteModelType) => {
    setEditingRecord(record);
    setOpen(true);
  };

  // 删除记录
  const handleDelete = (record: RemoteModelType) => {
    setDeletingRecord(record);
    setDeleteModalOpen(true);
  };

  // 确认删除
  const handleConfirmDelete = async () => {
    if (deletingRecord && dataSource) {
      try {
        const res = await deleteRemoteAPI(deletingRecord.id!);
        if (res.code === 200) {
          messageApi.success(res.message);
          getList();
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
  const handleSave = async (values: Partial<RemoteModelType>) => {
    // 编辑模式
    if (editingRecord && dataSource) {
      const newRecord = {
        name: values.name!,
        type: 'target' as const,
        remote_type: values.remote_type!,
        protocol: values.protocol!,
        ak: values.ak!,
        sk: values.sk!,
        endpoint: values.endpoint!
      };
      try {
        const res = await updateRemoteAPI(editingRecord.id!, newRecord);
        if (res.code == 200) {
          messageApi.success(res.message);
          getList();
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      // 新建模式
      const newRecord = {
        name: values.name!,
        type: 'target' as const,
        remote_type: values.remote_type!,
        protocol: values.protocol!,
        ak: values.ak!,
        sk: values.sk!,
        endpoint: values.endpoint!
      };
      try {
        const res = await createRemoteAPI(newRecord);
        if (res.code === 200) {
          messageApi.success(res.message);
          getList();
        }
      } catch (error) {
        console.error(error);
      }
    }
    handleCloseDrawer();
  };

  // 动态生成columns
  const tableColumns: TableProps<RemoteModelType>['columns'] = [
    {
      title: (
        <span style={{ fontWeight: 600, color: '#1f2937' }}>设备名称</span>
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
      title: (
        <span style={{ fontWeight: 600, color: '#1f2937' }}>设备类型</span>
      ),
      dataIndex: 'remote_type',
      key: 'remote_type',
      render: (text: string) => (
        <Text style={{ color: '#64748b', fontSize: '13px' }}>{text}</Text>
      ),
      width: 120
    },
    {
      title: (
        <span style={{ fontWeight: 600, color: '#1f2937' }}>设备协议</span>
      ),
      dataIndex: 'protocol',
      key: 'protocol',
      render: (text: string) => (
        <Text style={{ color: '#64748b', fontSize: '13px' }}>{text}</Text>
      ),
      width: 100
    },
    {
      title: <span style={{ fontWeight: 600, color: '#1f2937' }}>AK</span>,
      dataIndex: 'ak',
      key: 'ak',
      render: (text: string) => (
        <Text style={{ color: '#64748b', fontSize: '13px' }}>{text}</Text>
      ),
      width: 120
    },
    {
      title: <span style={{ fontWeight: 600, color: '#1f2937' }}>SK</span>,
      dataIndex: 'sk',
      key: 'sk',
      render: (text: string) => (
        <Text style={{ color: '#64748b', fontSize: '13px' }}>{text}</Text>
      ),
      width: 120
    },
    {
      title: (
        <span style={{ fontWeight: 600, color: '#1f2937' }}>Endpoint</span>
      ),
      dataIndex: 'endpoint',
      key: 'endpoint',
      render: (text: string) => (
        <Text style={{ color: '#64748b', fontSize: '13px' }}>{text}</Text>
      ),
      width: 200
    },
    {
      title: <span style={{ fontWeight: 600, color: '#1f2937' }}>操作</span>,
      key: 'action',
      render: (_: unknown, record: RemoteModelType) => (
        <Space size="small">
          <Tooltip title="编辑设备">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ color: '#3b82f6' }}
            />
          </Tooltip>
          <Tooltip title="删除设备">
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
      width: 100,
      fixed: 'right' as const
    }
  ];

  useEffect(() => {
    // 获取列表
    getList();
  }, []);

  // 搜索
  const handleSearch = (values: { name: string; endpoint: string }) => {
    const { name, endpoint } = values;
    const filtered = dataSource.filter((item) => {
      const nameMatch =
        !name || item.name?.toLowerCase().includes(name.toLowerCase());
      const endpointMatch =
        !endpoint ||
        item.endpoint?.toLowerCase().includes(endpoint.toLowerCase());
      return nameMatch && endpointMatch;
    });
    setFilteredDataSource(filtered);
  };

  // 重置
  const handleReset = () => {
    setFilteredDataSource(dataSource);
  };

  return (
    <>
      {contextHolder}
      <SearchForm
        openDrawer={handleCreate}
        onSearch={handleSearch}
        onReset={handleReset}
      />
      <Table
        columns={tableColumns}
        dataSource={filteredDataSource}
        rowKey="key"
        scroll={{ x: 1000 }}
        style={{
          backgroundColor: '#ffffff'
        }}
        className="source-manage-table"
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
        <p>确定要删除设备"{deletingRecord?.name}"吗？</p>
      </Modal>
    </>
  );
};

export default SourceManage;
