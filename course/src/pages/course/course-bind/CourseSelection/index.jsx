import styles from './index.less';
import React, { useState } from 'react';
import { Table } from 'antd';
import ProTable from '@ant-design/pro-table';
import { queryCourseList } from '../service';
const columns = [
  {
    title: '课程ID',
    dataIndex: 'courseID',
  },
  {
    title: '课程名称',
    dataIndex: 'courseName',
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
        request={(params, sorter, filter) => queryCourseList({ ...params, sorter, filter })}
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
