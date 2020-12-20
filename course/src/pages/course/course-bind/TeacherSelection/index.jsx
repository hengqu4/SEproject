import styles from './index.less';
import React, { useState } from 'react';
import { Table, Radio, Divider } from 'antd';
import ProTable from '@ant-design/pro-table';
import { queryTeacherList } from '../service';
const columns = [
  {
    title: '教师ID',
    dataIndex: 'teacherID',
  },
  {
    title: '教师姓名',
    dataIndex: 'teacherName',
  },
  {
    title: '教师邮箱',
    dataIndex: 'teacherEmail',
  },
];
const data = [
  
]; // rowSelection object indicates the need for row selection

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === 'Disabled User',
    // Column configuration not to be checked
    name: record.name,
  }),
};

const Demo = () => {
  const [selectionType, setSelectionType] = useState('checkbox');
  return (
    <div style={{padding: 15,}}>
      <ProTable
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        request={(params, sorter, filter) => queryTeacherList({ ...params, sorter, filter })}
        toolBarRender={false}
        search={false}
      />
    </div>
  );
};

export default () => (
  <div className={styles.container}>
    <div id="components-table-demo-row-selection">
      <Demo />
    </div>
  </div>
);
