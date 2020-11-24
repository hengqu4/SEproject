import React from "react";
import styles from "./index.less";
import { Table } from "antd";

const columns = [
  { title: "课程名", dataIndex: "name", key: "name" },
  { title: "课号", dataIndex: "number", key: "number" },
  { title: "学分", dataIndex: "score", key: "score" },
  { title: "开始时间", dataIndex: "begin", key: "begin" },
  { title: "结束时间", dataIndex: "end", key: "end" },
  { title: "学时", dataIndex: "time", key: "time" },
  {
    title: "操作",
    dataIndex: "",
    key: "x",
    render: () => <a>编辑详情</a>
  }
];

const data = [
  {
    key: 1,
    name: "编译原理",
    number: 'XXXXXXX',
    score: '2.0',
    begin:'XXXX-XX-XX',
    end:'XXXX-XX-XX',
    time:'24',
    description:
      "My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park."
  },
  {
    key: 2,
    name: "软件工程",
    number: 'XXXXXXX',
    score: '3.0',
    begin:'XXXX-XX-XX',
    end:'XXXX-XX-XX',
    time:'36',
    description:
      "My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park."
  },
  {
    key: 3,
    name: "计算机网络",
    number: 'XXXXXXX',
    score: '3.0',
    begin:'XXXX-XX-XX',
    end:'XXXX-XX-XX',
    time:'36',
    description: "This not expandable"
  },
  {
    key: 4,
    name: "软件测试",
    number: 'XXXXXXX',
    score: '2.0',
    begin:'XXXX-XX-XX',
    end:'XXXX-XX-XX',
    time:'24',
    description:
      "My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park."
  }
];

export default () => (
  <div className={styles.container}>
    <div id="components-table-demo-expand">
      <Table
        columns={columns}
        expandable={{
          expandedRowRender: record => (
            <p style={{ margin: 0 }}>{record.description}</p>
          ),
          rowExpandable: record => record.name !== "Not Expandable"
        }}
        dataSource={data}
      />
    </div>
  </div>
);
