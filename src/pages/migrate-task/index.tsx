import React, { useState } from 'react';
import { Space, Table, Modal, message } from 'antd';
import type { TableProps } from 'antd';

import SearchForm from './SearchForm';
import TaskDrawer from './TaskDrawer';

interface DataType {
  key: string;
  name: string;
  source?: string;
  target?: string;
  status?: string;
  usedTime?: string;
  remainingTime?: string;
  age?: number;
  address?: string;
  tags?: string[];
}

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser']
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher']
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
      title: '任务名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '源端',
      dataIndex: 'source',
      key: 'source'
    },
    {
      title: '目标端',
      dataIndex: 'target',
      key: 'target'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: '已用时间',
      dataIndex: 'usedTime',
      key: 'usedTime'
    },
    {
      title: '剩余时间',
      dataIndex: 'remainingTime',
      key: 'remainingTime'
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: DataType) => (
        <Space size="middle">
          <a onClick={() => handlePause(record)}>暂停</a>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleStart(record)}>启动</a>
          <a onClick={() => handleDelete(record)}>删除</a>
        </Space>
      )
    }
  ];

  return (
    <>
      <SearchForm openDrawer={handleCreate} />
      <Table<DataType> columns={tableColumns} dataSource={dataSource} />
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
