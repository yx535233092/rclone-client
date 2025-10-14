import React, { useState } from 'react';
import { Space, Table } from 'antd';
import type { TableProps } from 'antd';

import SearchForm from './SearchForm';
import TaskDrawer from './TaskDrawer';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: TableProps<DataType>['columns'] = [
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
    render: () => (
      <Space size="middle">
        <a>暂停</a>
        <a>编辑</a>
        <a>启动</a>
        <a>删除</a>
      </Space>
    )
  }
];

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

  return (
    <>
      <SearchForm openDrawer={() => setOpen(true)} />
      <Table<DataType> columns={columns} dataSource={data} />
      <TaskDrawer open={open} closeDrawer={() => setOpen(false)}></TaskDrawer>
    </>
  );
};

export default MigrateTask;
