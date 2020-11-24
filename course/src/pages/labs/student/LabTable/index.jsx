import { PlusOutlined } from '@ant-design/icons'
import { Button, Divider, message, Input } from 'antd'
import React, { useState, useRef } from 'react'
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import CreateForm from './components/CreateForm'
import UpdateForm from './components/UpdateForm'
import { queryRule, updateRule, addRule, removeRule } from './service'
/**
 * 添加节点
 * @param fields
 */

// const handleAdd = async (fields) => {
//   const hide = message.loading('正在添加');

//   try {
//     await addRule({ ...fields });
//     hide();
//     message.success('添加成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('添加失败请重试！');
//     return false;
//   }
// };
/**
 * 更新节点
 * @param fields
 */

const handleUpdate = async (fields) => {
  const hide = message.loading('正在配置')

  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    })
    hide()
    message.success('配置成功')
    return true
  } catch (error) {
    hide()
    message.error('配置失败请重试！')
    return false
  }
}
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
  const [createModalVisible, handleModalVisible] = useState(false)
  const [updateModalVisible, handleUpdateModalVisible] = useState(false)
  const [stepFormValues, setStepFormValues] = useState({})
  const actionRef = useRef()
  // const [selectedRowsState, setSelectedRows] = useState([]);
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
    },
    {
      title: '实验描述',
      dataIndex: 'desc',
      valueType: 'textarea',
      ellipsis: true,
      search: false,
      // copyable: true,
    },
    // {
    //   title: '次数',
    //   dataIndex: 'callNo',
    //   sorter: true,
    //   hideInForm: true,
    //   search: false,
    //   renderText: (val) => `${val} 万`,
    // },
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
          status: 'Processing',
        },
        2: {
          text: '已完成',
          status: 'Success',
        },
        // 3: {
        //   text: '异常',
        //   status: 'Error',
        // },
      },
    },
    {
      title: '开始时间',
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
      width: 250,
      search: false,
      render: (_, record) => (
        <>
          <a href=''>进入实验</a>
          <Divider type='vertical' />
          <a href=''>查看成绩</a>
          <Divider type='vertical' />
          <a
            onClick={() => {
              handleUpdateModalVisible(true)
              setStepFormValues(record)
            }}
          >
            配置
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
        pagination={false}
        toolBarRender={() => [
          // eslint-disable-next-line react/jsx-key
          <Button
            type='primary'
            // onClick={() => handleModalVisible(true)}
          >
            <PlusOutlined /> 编辑实验表格
          </Button>,
        ]}
        request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
        columns={columns}
        // rowSelection={{onChange: (_, selectedRows) => setSelectedRows(selectedRows),}}
      />
      {/*
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable
          onSubmit={async (value) => {
            const success = await handleAdd(value);

            if (success) {
              handleModalVisible(false);

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="key"
          type="form"
          columns={columns}
          rowSelection={{}}
        />
      </CreateForm>
      */}
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value)

            if (success) {
              handleUpdateModalVisible(false)
              setStepFormValues({})

              if (actionRef.current) {
                actionRef.current.reload()
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false)
            setStepFormValues({})
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
    </PageContainer>
  )
}

export default TableList
