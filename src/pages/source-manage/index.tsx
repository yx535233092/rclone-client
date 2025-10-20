import React, { useState } from 'react';
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

interface DataType {
  key: string;
  name: string;
  type?: string;
  protocol?: string;
  ak?: string;
  sk?: string;
  endpoint?: string;
  age?: number;
  address?: string;
  tags?: string[];
}

const data: DataType[] = [
  {
    key: '1',
    name: '设备001',
    type: 'Amazon S3',
    protocol: 's3',
    ak: '1234567890',
    sk: '1234567890',
    endpoint: 'https://s3.amazonaws.com'
  },
  {
    key: '2',
    name: '设备002',
    type: 'Amazon S3',
    protocol: 's3',
    ak: '1234567890',
    sk: '1234567890',
    endpoint: 'https://s3.amazonaws.com'
  },
  {
    key: '3',
    name: '设备003',
    type: 'Amazon S3',
    protocol: 's3',
    ak: '1234567890',
    sk: '1234567890',
    endpoint: 'https://s3.amazonaws.com'
  }
];

const SourceManage: React.FC = () => {
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

  // 删除记录
  const handleDelete = (record: DataType) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除设备"${record.name}"吗？`,
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
      // 编辑模式
      setDataSource(
        dataSource.map((item) =>
          item.key === editingRecord.key ? { ...item, ...values } : item
        )
      );
      message.success('编辑成功');
    } else {
      // 新建模式
      const newRecord: DataType = {
        key: Date.now().toString(),
        name: values.name || '',
        ...values
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
      dataIndex: 'type',
      key: 'type',
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
      render: (_: unknown, record: DataType) => (
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
    </>
  );
};

export default SourceManage;
