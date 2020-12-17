import { InfoCircleOutlined } from '@ant-design/icons'
import { Card, Col, Row, Table, Tooltip } from 'antd'
import { FormattedMessage } from 'umi'
import React from 'react'
import numeral from 'numeral'
import { MiniArea } from './Charts'
import NumberInfo from './NumberInfo'
import Trend from './Trend'
import styles from '../style.less'

const columns = [
  {
    title: '排名',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '学生id',
    dataIndex: 'keyword',
    key: 'keyword',
    render: (text) => <a href='/'>{text}</a>,
  },
  {
    title: '学生姓名',
    dataIndex: 'count',
    key: 'count',
    sorter: (a, b) => a.count - b.count,
    className: styles.alignRight,
  },
  {
    title: '分数',
    dataIndex: 'range',
    key: 'range',
    sorter: (a, b) => a.range - b.range,
    render: (text, record) => (
      <Trend flag={record.status === 1 ? 'down' : 'up'}>
        <span
          style={{
            marginRight: 4,
          }}
        >
          {text}
        </span>
      </Trend>
    ),
  },
]

const TopSearch = ({ loading, visitData2, searchData, dropdownGroup }) => (
  <Card
    loading={loading}
    bordered={false}
    title='学生成绩排名'
    extra={dropdownGroup}
    style={{
      height: '100%',
    }}
  >
    <Table
      rowKey={(record) => record.index}
      size='small'
      columns={columns}
      dataSource={searchData}
      pagination={{
        style: {
          marginBottom: 0,
        },
        pageSize: 5,
      }}
    />
  </Card>
)

export default TopSearch
