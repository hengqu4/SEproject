import { PlusOutlined } from '@ant-design/icons'
import { Button, Divider, message, Input, Drawer, notification } from 'antd'
import React, { useState, useRef } from 'react'
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout'
import { useMount } from 'react-use'
import ProTable from '@ant-design/pro-table'
import ProDescriptions from '@ant-design/pro-descriptions'
import { Link } from 'react-router-dom'
import { connect } from 'umi'
import { removeRule } from './service'
import PublishMoal from './components/Publish'
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

const FormatData = (allLabList) => {
  const formattedLabList = []
  for (let i = 0; i < allLabList.length; i++) {
    formattedLabList.push({
      key: allLabList[i].experiment_case_id,
      name: allLabList[i].experiment_case_name,
      desc: allLabList[i].experiment_case_description,
      updatedAt: allLabList[i].case_created_timestamp,
      status: 0,
    })
  }
  return formattedLabList
}

const LabDatabase = ({ labDatabase }) => ({
  isSuccess: labDatabase.isSuccess,
  allLabList: labDatabase.allLabList,
})

const TableList = ({ allLabList = [], dispatch = () => {} }) => {
  const [createModalVisible, handleModalVisible] = useState(false)
  const [updateModalVisible, handleUpdateModalVisible] = useState(false)
  const [publishModalVisible, handlePublishModalVisible] = useState(false)
  const actionRef = useRef()
  const [row, setRow] = useState()
  const [selectedRowsState, setSelectedRows] = useState([])
  const columns = [
    {
      title: '实验名称',
      dataIndex: 'name',
      tip: '规则名称是唯一的 key',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '规则名称为必填项',
          },
        ],
      },
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>
      },
      align: 'center',
    },
    {
      title: '描述',
      dataIndex: 'desc',
      valueType: 'textarea',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
      hideInForm: true,
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
      valueEnum: {
        0: {
          text: '未发布',
          status: 'Default',
        },
        1: {
          text: '已发布',
          status: 'Warning',
        },
      },
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true)
            }}
          >
            查看
          </a>
          <Divider type='vertical' />
          <a href=''>删除</a>
          <Divider type='vertical' />
          <a
            onClick={() => {
              handlePublishModalVisible(true)
              console.log(record.key)
            }}
          >
            发布
          </a>
        </>
      ),
      align: 'center',
    },
  ]

  const handlePublish = (value) => {
    // TODO: publish
    console.log(value.[0].format())
    handlePublishModalVisible(false)
  }

  const [loading, setLoading] = useState(true)
  useMount(() => {
    dispatch({
      type: 'labDatabase/fetchLabDatabase',
      payload: {
        allLabList,
      },
      onError: (err) => {
        notification.error({
          message: '获取资料库实验列表失败',
          description: err.message,
        })
      },
      onFinish: setLoading.bind(this, false),
    })
  })

  return (
    <PageContainer>
      <ProTable
        headerTitle='所有实验'
        actionRef={actionRef}
        rowKey='key'
        search={false}
        toolBarRender={() => [
          <Button type='primary' onClick={() => handleModalVisible(true)}>
            <Link to='/labs/create' target='_blank'>
              <PlusOutlined /> 新建
            </Link>
          </Button>,
        ]}
        dataSource={FormatData(allLabList)}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
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
            onClick={async () => {
              await handleRemove(selectedRowsState)
              setSelectedRows([])
              actionRef.current?.reloadAndRest?.()
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined)
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions
            column={2}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
      <PublishMoal
        modelVisible={publishModalVisible}
        handleOk={(value) => {
          handlePublish(value)
        }}
        handleCancel={() => {
          handlePublishModalVisible(false)
        }}
      />
    </PageContainer>
  )
}

export default connect(LabDatabase)(TableList)
