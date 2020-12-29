import React, { useRef, useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import {Input, Button, Table, Modal, Space} from 'antd'
import {connect} from 'umi'
import {Link} from 'react-router-dom'
import { useMount } from 'react-use';
import onError from '@/utils/onError';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons'

const data = [
  {
    key:1,
    tittle: '第一次作业',
    creator: 'dri-toolman',
    createTime: '2020-11-30',
    endTime:'2020-12-31'
  }
]

  const columns = [
    {
      title: '作业名称',
      dataIndex: 'title',
      width: '20%',
      // render: (text, index) => {
      //   return <a>{text}</a>
      // },
    },
    {
      title: '发布者',
      dataIndex: 'creator',
      width: '15%',
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      width: '20%',
    },
    {
      title: '截止日期',
      dataIndex: 'endTime',
      width: '20%',
    },
    {
      title: '操作',
      dataIndex: 'opr',
      width: '15%',
      render: (_, record) => (
        <>
          <Link to={`/homework/hw-check/${record.key}`}>详情&nbsp;&nbsp;&nbsp;&nbsp;</Link>
        </>
      )
    }
  ]
const Bread = () => {
  return (
    <PageContainer>
      <ProTable
        headerTitle='作业批改'
        search={false}
        dataSource={data}
        columns={columns}
      />
    </PageContainer>
  )
}

export default Bread