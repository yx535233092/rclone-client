import React, { useState } from 'react';
import { Space, Table, Modal, message } from 'antd';
import type { TableProps } from 'antd';

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

const TargetManage: React.FC = () => {
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
      title: '设备名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '设备协议',
      dataIndex: 'protocol',
      key: 'protocol'
    },
    {
      title: 'AK',
      dataIndex: 'ak',
      key: 'ak'
    },
    {
      title: 'SK',
      dataIndex: 'sk',
      key: 'sk'
    },
    {
      title: 'endpoint',
      dataIndex: 'endpoint',
      key: 'endpoint'
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: DataType) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>编辑</a>
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

export default TargetManage;
