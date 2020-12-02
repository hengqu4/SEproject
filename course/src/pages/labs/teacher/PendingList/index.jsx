import { Input } from 'antd'
import React, { useRef } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import { Link } from 'react-router-dom'
import { queryRule } from './service'

const TableList = () => {
  const actionRef = useRef()
  const columns = [
    {
      title: '学生名称',
      dataIndex: 'name',
      search: false,
      fieldProps: {
        rules: [
          {
            required: true,
            message: '规则名称为必填项',
          },
        ],
      },
    },
    {
      title: '提交时间',
      // dataIndex: 'updatedAt',
      dataIndex: 'startTime',
      sorter: true,
      valueType: 'dateTime',
      hideInForm: true,
      search: false,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status')

        if (`${status}` === '0') {
          return false
        }

        if (`${status}` === '3') {
          return <Input {...rest} placeholder='请输入异常原因！' />
        }

        return defaultRender(item)
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      sorter: true,
      valueEnum: {
        0: {
          text: '已批改',
          status: 'Finished',
        },
        1: {
          text: '未批改',
          status: 'Pending',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 250,
      search: false,
      render: (_, record) => (
        <>
          <Link to='/labs/mark' target='_blank'>
            进入批改
          </Link>
        </>
      ),
    },
  ]
  return (
    <PageContainer>
      <ProTable
        headerTitle='提交列表'
        actionRef={actionRef}
        search={false}
        rowKey='key'
        request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
        columns={columns}
      />
    </PageContainer>
  )
}

export default TableList
