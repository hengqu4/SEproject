import { PlusOutlined } from '@ant-design/icons'
import { Button, Divider, message, Input, Drawer } from 'antd'
import React, { useState, useRef } from 'react'
import routerRedux from 'dva/router'
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import ProDescriptions from '@ant-design/pro-descriptions'
import CreateForm from './components/CreateForm'
import UpdateForm from './components/UpdateForm'
import { queryCourseList, updateCourseList, addCourseList, removeCourseList } from './service'
import { fetchAllCourseInfo } from '@/services/course'
/**
 * 添加节点
 * @param fields
 */

const handleAdd = async (fields) => {
  const hide = message.loading('正在添加')

  try {
    await addCourseList({ ...fields })
    hide()
    message.success('添加成功')
    return true
  } catch (error) {
    hide()
    message.error('添加失败请重试！')
    return false
  }
}
/**
 * 更新节点
 * @param fields
 */

const handleUpdate = async (fields) => {
  const hide = message.loading('正在配置')

  try {
    await updateCourseList({
      courseID: fields.courseID,
      courseName: fields.courseName,
      courseCredit: fields.courseCredit,
      courseStudyTimeNeeded: fields.courseStudyTimeNeeded,
      courseDescription: fields.courseDescription,
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
    await removeCourseList({
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

// const handleEdit = (toEditCourse) => {
//   this.props.dispatch(routerRedux.push({
//     pathname: '/course-setting/course-edit',
//     query: {
//       courseID: toEditCourse.courseID,
//       courseName: toEditCourse.courseName,
//     }
//   }));
// }

const TableList = () => {
  const [createModalVisible, handleModalVisible] = useState(false)
  const [updateModalVisible, handleUpdateModalVisible] = useState(false)
  const [toDeleteRowValue, setToDeleteRowValue] = useState({})
  const [stepFormValues, setStepFormValues] = useState({})
  const actionRef = useRef()
  const [row, setRow] = useState()
  const [selectedRowsState, setSelectedRows] = useState([])
  const columns = [
    {
      title: '课程ID',
      dataIndex: 'courseID',
      hideInForm: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '课程ID是必须项',
          }
        ]
      },
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
      formItemProps: {
        rules: [
          {
            required: true,
          }
        ]
      },
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>
      },
    },
    {
      title: '教师姓名',
      dataIndex: 'teacherName',
      hideInForm: true,
    },
    {
      title: '课程学分',
      dataIndex: 'courseCredit',
      formItemProps: {
        rules: [
          {
            required: true,
          }
        ]
      },
    },
    {
      title: '课程学时',
      dataIndex: 'courseStudyTimeNeeded',
      formItemProps: {
        rules: [
          {
            required: true,
          }
        ]
      },
    },
    {
      title: '课程描述',
      dataIndex: 'courseDescription',
      valueType: 'textarea',
      formItemProps: {
        rules: [
          {
            required: true,
            max: 50,
          }
        ]
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            // onClick={ () => { handleEdit(record) } }
          >
            切换</a>
          <Divider type='vertical' />
          <a
            onClick={async () => {
              setToDeleteRowValue(record);
              await handleRemove([toDeleteRowValue]);
              actionRef.current.reloadAndRest();
            }}
          >
            删除</a>
        </>
      ),
    },
  ]
  const columnsPlus = [
    {
      title: '课程ID',
      dataIndex: 'courseID',
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
    },
    {
      title: '教师ID',
      dataIndex: 'teacherID',
    },
    {
      title: '教师姓名',
      dataIndex: 'teacherName',
    },
    {
      title: '课程学分',
      dataIndex: 'courseCredit',
    },
    {
      title: '课程学时',
      dataIndex: 'courseStudyTimeNeeded',
    },
    {
      title: '课程描述',
      dataIndex: 'courseDescription',
    },
    {
      title: '课程开始时间',
      detaIndex: 'courseStartTime',
    },
    {
      title: '课程结束时间',
      detaIndex: 'courseEndTime',
    },
    {
      title: '理论课次数',
      dataIndex: 'lectureCount',
    },
    {
      title: '实验课次数',
      dataIndex: 'experimentCount',
    },
    {
      title: '作业次数',
      dataIndex: 'homeworkCount',
    },
    {
      title: '对抗练习次数',
      dataIndex: 'contestCount',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            
          >
            作业管理</a>
          <Divider type='vertical' />
          <a
            
          >
            实验管理</a>
          <Divider type='vertical' />
          <a
            
          >
            对抗练习</a>
        </>
      ),
    },
  ]
  return (
    <PageContainer>
      <ProTable
        headerTitle='查询课程'
        actionRef={actionRef}
        rowKey='key'
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type='primary' onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={(params, sorter, filter) => queryCourseList({ ...params, sorter, filter })}
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
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable
          onSubmit={async (value) => {
            const success = await handleAdd(value)

            if (success) {
              handleModalVisible(false)

              if (actionRef.current) {
                actionRef.current.reload()
              }
            }
          }}
          rowKey='key'
          type='form'
          columns={columns}
        />
      </CreateForm>
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

      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined)
        }}
        closable={false}
      >
        {row?.courseID && (
          <ProDescriptions
            column={1}
            title={row?.courseName}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.courseID,
            }}
            columns={columnsPlus}
          />
        )}
      </Drawer>
    </PageContainer>
  )
}

export default TableList
