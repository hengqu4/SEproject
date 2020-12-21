import { Input, notification } from 'antd'
import React, { useState, useRef } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import { Link } from 'react-router-dom'
import { useMount } from 'react-use'
import { connect } from 'umi'

const PendingListData = ({ lab }) => ({
  isSuccess: lab.isSuccess,
  allPendingList: lab.allPendingList,
})

const FormatData = (allPendingList) => {
  const formattedLabList = []
  for (let i = 0; i < allPendingList.length; i++) {
    const score = allPendingList[i].submission_score
    formattedLabList.push({
      key: allPendingList[i].submissionCaseId,
      name: allPendingList[i].submissionUploader,
      startTime: allPendingList[i].submissionTimestamp,
      status: score === -1 ? 1 : 0,
      score: score === -1 ? null : score,
    })
  }
  return formattedLabList
}

const TableList = ({ allPendingList = [], dispatch = () => {} }) => {
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
      sorter: false,
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
      title: '得分',
      dataIndex: 'score',
      sorter: true,
      hideInForm: true,
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

  const [loading, setLoading] = useState(true)
  useMount(() => {
    dispatch({
      type: 'lab/fetchAllStudentReport',
      payload: {
        allPendingList,
      },
      onError: (err) => {
        notification.error({
          message: '获取提交情况失败',
          description: err.message,
        })
      },
      onFinish: setLoading.bind(this, false),
    })
  })

  return (
    <PageContainer>
      <ProTable
        headerTitle='提交列表'
        actionRef={actionRef}
        search={false}
        rowKey='key'
        dataSource={FormatData(allPendingList)}
        columns={columns}
      />
    </PageContainer>
  )
}

export default connect(PendingListData)(TableList)
