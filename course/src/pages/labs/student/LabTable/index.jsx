import { PlusOutlined } from '@ant-design/icons'
import { Button, Divider, message, Input } from 'antd'
import React, { useState, useRef } from 'react'
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import { queryRule, updateRule, addRule, removeRule } from './service'
import {Link} from 'react-router-dom'
import CreateForm from './components/CreateForm'

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

const TableList = () => {
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const columns = [
    {
      title: '实验名称',
      dataIndex: 'name',
      fieldProps: {
        rules: [
          {
            required: true,
            message: '规则名称为必填项',
          },
        ],
      },
      render: (dom) => {
        return <Link to="/labs/lab">{dom}</Link>;
      },
      align:'center',
    },
    {
      title: '实验描述',
      dataIndex: 'desc',
      valueType: 'textarea',
      ellipsis: true,
      search: false,
      // copyable: true,
      align:'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '进行中',
          status: 'Warning',
        },
        2: {
          text: '已完成',
          status: 'Success',
        },
        3: {
          text: '已批改',
          status: 'Processing',
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
      dataIndex: 'option',
      valueType: 'option',
      search: false,
      render: (_, record) => (
        <>
          <a 
            href=''
            // onClick={() => {
            //   setStepFormValues(record)
            // }}
          >
            <Link to="/labs/lab">
              进入实验
            </Link>
          </a>
        </>
      ),
    },
  ]
  return (
    <PageContainer>
      <ProTable
        headerTitle='查询表格'
        actionRef={actionRef}
        rowKey='key'
        // pagination={false}
        toolBarRender={() => [
          <Button
            // onClick={() => handleJumpLab(true)}
          >
            <Link to="/labs/all">发布实验</Link>
          </Button>,
          <Button
            type='primary'
            // onClick={() => handleJumpLab(true)}
          >
            删除实验
          </Button>,
        ]}
        request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
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
    </PageContainer>
  )
}

export default TableList
