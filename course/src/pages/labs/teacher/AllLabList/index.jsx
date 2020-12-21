import { PlusOutlined } from '@ant-design/icons'
import { Button, Divider, message, Input, Drawer, notification } from 'antd'
import React, { useState, useRef } from 'react'
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout'
import { useMount } from 'react-use'
import ProTable from '@ant-design/pro-table'
import ProDescriptions from '@ant-design/pro-descriptions'
import { Link } from 'react-router-dom'
import { connect } from 'umi'
import Modal from 'antd/lib/modal/Modal'
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
      key: allLabList[i].experimentCaseId,
      name: allLabList[i].experimentName,
      caseName: allLabList[i].experimentCaseName,
      desc: allLabList[i].experimentCaseDescription,
      updatedAt: allLabList[i].caseCreatedTimestamp,
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
  const [loading, setLoading] = useState(true)
  const [publishCaseId, setPublishCaseId] = useState()
  const [deleteCaseId, setDeleteCaseId] = useState()
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  const getLabDatabaseList = () => {
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
  }

  const publishLabCase = (payload) => {
    dispatch({
      type: 'lab/publishLabCase',
      payload,
      onError: (err) => {
        notification.error({
          message: '实验发布失败',
          description: err.message,
        })
      },
      onSuccess: () => {
        notification.success({
          message: '实验发布成功',
          description: '实验已发布',
        })
      },
    })
  }

  const handleDelete = () => {
    dispatch({
      type: 'lab/deleteLabCase',
      payload: deleteCaseId,
      onSuccess: () => {
        notification.success({
          message: '实验删除成功',
          description: '实验已删除',
        })
        getLabDatabaseList()
      },
      onError: (err) => {
        notification.error({
          message: '实验删除失败',
          description: err.message,
        })
      },
    })
  }

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
      title: '案例名称',
      dataIndex: 'caseName',
      valueType: 'textarea',
      ellipsis: true,
      search: false,
      align:'center',
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
          <a
            onClick={() => {
              setDeleteModalVisible(true)
              setDeleteCaseId(record.key)
            }}
          >
            删除
          </a>
          <Divider type='vertical' />
          <a
            onClick={() => {
              handlePublishModalVisible(true)
              setPublishCaseId(record.key)
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
    const payload = {
      caseId: publishCaseId,
      caseStartTimestamp: value[0].format(),
      caseEndTimestamp: value[1].format(),
      courseId: 1,
    }

    publishLabCase(payload)
    handlePublishModalVisible(false)
  }

  useMount(() => {
    getLabDatabaseList()
  })

  return (
    <PageContainer>
      <ProTable
        headerTitle='所有实验'
        actionRef={actionRef}
        rowKey='key'
        search={false}
        toolBarRender={() => [
          <Button key='create' type='primary' onClick={() => handleModalVisible(true)}>
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
      <Modal
        title='确认删除'
        visible={deleteModalVisible}
        onOk={() => {
          setDeleteModalVisible(false)
          handleDelete()
        }}
        onCancel={() => {
          setDeleteModalVisible(false)
        }}
      >
        <p>确认删除该实验吗?</p>
      </Modal>
    </PageContainer>
  )
}

export default connect(LabDatabase)(TableList)
