import { Input, notification } from 'antd'
import React, { useState, useRef } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import { Link } from 'react-router-dom'
import { useMount } from 'react-use'
import { connect, useParams } from 'umi'

const PendingListData = ({ lab }) => ({
  isSuccess: lab.isSuccess,
  allPendingList: lab.allPendingList,
})

const FormatData = (allPendingList) => {
  const formattedLabList = []
  for (let i = 0; i < allPendingList.length; i++) {
    const score = allPendingList[i].submissionScore
    formattedLabList.push({
      key: allPendingList[i].submissionCaseId,
      studentId: [{ 
        submissionCaseId: allPendingList[i].submissionCaseId,
        courseCaseId: allPendingList[i].courseCaseId,
        name: allPendingList[i].realName,
        submissionStudentId: "1110001",
      }],
      studentName: "张三",
      submitTime: allPendingList[i].submissionTimestamp,
      status: score === -1 ? 1 : 0,
      score: score === -1 ? null : score,
    })
  }
  return formattedLabList
}

const TableList = ({ allPendingList = [], dispatch = () => { } }) => {
  const params = useParams()
  const actionRef = useRef()
  const columns = [
    {
      title: '学生学号',
      dataIndex: 'studentId',
      search: false,
      fieldProps: {
        rules: [
          {
            required: true,
            message: '规则名称为必填项',
          },
        ],
      },
      render: (_, row) => row?.studentId?.map((item) => 
        <Link key="nameJumpLab" to={`/labs/mark/${item.courseCaseId}/${item.submissionCaseId}`}> 
          {item.submissionCaseId}
        </Link>
      ),
      align:'center',
    },
    {
      title: '学生姓名',
      dataIndex: 'studentName',
      search: false,
      fieldProps: {
        rules: [
          {
            required: true,
            message: '规则名称为必填项',
          },
        ],
      },
      align:'center',
    },
    {
      title: '提交时间',
      // dataIndex: 'updatedAt',
      dataIndex: 'submitTime',
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
      align:'center',
    },
    
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      sorter: true,
      valueEnum: {
        0: {
          text: '已批改',
          status: 'Success',
        },
        1: {
          text: '未批改',
          status: 'Warning',
        },
      },
    },
    {
      title: '得分',
      dataIndex: 'score',
      sorter: true,
      hideInForm: true,
      align:'center',
    },
    {
      title: '操作',
      dataIndex: 'studentId',
      valueType: 'option',
      width: 250,
      search: false,
      render: (_, row) => row?.studentId?.map((item) => 
        <Link key="nameJumpLab" to={`/labs/mark/${item.courseCaseId}/${item.submissionCaseId}`}> 
          进入批改
        </Link>
      ),
      align:'center',
    },
  ]
  const [loading, setLoading] = useState(true)
  useMount(() => {
    dispatch({
      type: 'lab/fetchAllStudentReport',
      payload: params.courseCaseId,
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
    <PageContainer title={false}>
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