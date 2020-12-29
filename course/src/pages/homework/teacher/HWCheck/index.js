import React, { useRef, useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import {Input, Button, Table, Modal, Space} from 'antd'
import ProTable from '@ant-design/pro-table';

const data = [
  {
    key:1,
    name: 'dd',
    file: 'dd_hw1.pdf',
    createTime: '2020-12-30'
  }
]

  const columns = [
    {
      title: '学生名称',
      dataIndex: 'name',
      width: '20%',
    },
    {
      title: '文件',
      dataIndex: 'file',
      width: '20%',
    },
    {
      title: '上传日期',
      dataIndex: 'createTime',
      width: '20%',
    },
    {
      title: '操作',
      dataIndex: 'opr',
      width: '30%',
      render: (_, record) => (
        <>
          <Button type='primary'>下载</Button>
          <Input addonBefore="输入分数" style={{marginLeft:'20px', width:'50%'}}></Input>
        </>
      )
    }
  ]

const Bread = () => {
  return (
    <PageContainer>
      <ProTable
        headerTitle='作业批改详情'
        search={false}
        dataSource={data}
        columns={columns}
      />
    </PageContainer>
  )
}

export default Bread