import { PlusOutlined } from '@ant-design/icons'
import { Button, Divider, message, Input, notification } from 'antd'
import React, { useState, useMemo, useCallback, useRef } from 'react'
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import { useMount } from 'react-use'
import { connect,Link,history } from 'umi'
import CreateForm from './components/CreateForm'
import Authorized from '@/components/Authorized/Authorized';

/**
 *  删除节点
 * @param selectedRows
 */

const handleRemove = async (selectedRows) => {
  const hide = message.loading('正在删除')
  if (!selectedRows) return true

  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    })
    hide()
    message.success('删除成功，即将刷新')
    return true
  } catch (error) {
    hide()
    message.error('删除失败，请重试')
    return false
  }
}

const noMatch = <div />;

const FormatData = (allLabsData) => {
  const formattedLabList = []
  for (let i = 0; i < allLabsData.length; i++) {
    formattedLabList.push({
      labTitle: [{ 
        name: allLabsData[i].experimentName,
        courseId: allLabsData[i].courseId,
        courseCaseId: allLabsData[i].courseCaseId,
      }],
      // labTitle: allLabsData[i].experimentName,
      caseName: allLabsData[i].experimentCaseName,
      desc: allLabsData[i].experimentCaseDescription,
      status: 0,
      startTime: allLabsData[i].caseStartTimestamp,
      endTime: allLabsData[i].caseEndTimestamp,
    })
  }
  return formattedLabList
}

const AllLabCase = ({ lab }) => ({
  isSuccess: lab.isSuccess,
  allLabsData: lab.allLabCaseList,
})

const TableList = ({ allLabsData = [], dispatch = () => {} }) => {
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);

  const columns  = [
    {
      title: '实验名称',
      dataIndex: 'labTitle',
      fieldProps: {
        rules: [
          {
            required: true,
            message: '规则名称为必填项',
          },
        ],
      },
      // <Link to={`/labs/lab?course=${item.courseId}&case=${item.courseCaseId}`}> {item.name}</Link>
      render: (_, row) => row?.labTitle?.map(
        (item) => <Link to={`/labs/lab/${item.courseId}/${item.courseCaseId}`}> {item.name}</Link>
      ),

      align:'center',
    },
    {
      title: '案例名称',
      dataIndex: 'caseName',
      valueType: 'textarea',
      ellipsis: true,
      search: false,
      align:'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '未开始',
          status: 'Default',
        },
        1: {
          text: '进行中',
          status: 'Processing',
        },
        2: {
          text: '已完成',
          status: 'Success',
        },
        3: {
          text: '已批改',
          status: 'Warning',
        },
        4: {
          text: '未提交',
          status: 'Error',
        },
      },
      align:'center',
    },
    {
      title: '开始时间',
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
      title: '结束时间',
      dataIndex: 'endTime',
      sorter: true,
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'labTitle',
      valueType: 'option',
      search: false,
      render: (_, row) => row?.labTitle?.map(
        (item) => <Link to={`/labs/lab/${item.courseId}/${item.courseCaseId}`}> 进入实验</Link>
      ),
    },
  ]

  useMount(() => {
    dispatch({
      type: 'lab/fetchAllLabCase',
      //  api/v1/experiment/course-cases/list/1
      payload: 1,
      onError: (err) => {
        notification.error({
          message: '获取实验列表失败',
          description: err.message,
        })
      },
    })
  })

  return (
    <PageContainer title={false}>
      <Authorized authority={['student']} noMatch={noMatch}>
      <ProTable
        actionRef={actionRef}
        rowKey='key'
        dataSource={FormatData(allLabsData)}
        columns={columns}
      />
      </Authorized>

      <Authorized authority={['teacher']} noMatch={noMatch}>
      <ProTable
        actionRef={actionRef}
        rowKey='key'
        // pagination={false}
        toolBarRender={() => [
          <Button key="publish"
            // onClick={() => handleJumpLab(true)}
          >
            <Link to="/labs/all">发布实验</Link>
          </Button>
        ]}
        dataSource={FormatData(allLabsData)}
        columns={columns}
        // 删除选中实验
        rowSelection={{onChange: (_, selectedRows) => setSelectedRows(selectedRows),}}
      />

      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            type="primary"
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      </Authorized>
    </PageContainer>
  )
}

export default connect(AllLabCase)(TableList)