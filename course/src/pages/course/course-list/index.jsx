import { PlusOutlined } from '@ant-design/icons'
import { Button, Divider, message, Drawer, DatePicker } from 'antd'
import React, { useState, useRef, useCallback } from 'react'
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import { StepsForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form'
import ProCard from '@ant-design/pro-card'
import ProDescriptions from '@ant-design/pro-descriptions'
import CreateForm from './components/CreateForm'
import UpdateForm from './components/UpdateForm'
// import { queryCourseList, updateCourseList, addCourseList, removeCourseList } from './service'
import { parse } from 'url'
import FormItem from 'antd/lib/form/FormItem'
import connect from 'dva'

const { RangePicker } = DatePicker

const mapStateToProps = ({ Course }) => ({
  courseList: Course.courseList,
  newCourseInfo: Course.newCourseInfo,
})

const course_list = (courseList = [], newCourseInfo = {}, status, dispatch = () => {}) => {
  /**
   * 获取课程列表
   */
  const getCourseList = useCallback((req, res, u) => {
    dispatch({
      type: 'Course/getAllCourse',
      onError: (err) => {
        notification.error({
          message: '获取课程列表失败',
          description: err.message,
        })
      },
    })

    let realUrl = u

    if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
      realUrl = req.url
    }

    const { current = 1, pageSize = 10 } = req.query
    const params = parse(realUrl, true).query
    let dataSource = [...courseList].slice((current - 1) * pageSize, current * pageSize)
    const sorter = JSON.parse(params.sorter)

    if (sorter) {
      dataSource = dataSource.sort((prev, next) => {
        let sortNumber = 0
        Object.keys(sorter).forEach((key) => {
          if (sorter[key] === 'descend') {
            if (prev[key] - next[key] > 0) {
              sortNumber += -1
            } else {
              sortNumber += 1
            }

            return
          }

          if (prev[key] - next[key] > 0) {
            sortNumber += 1
          } else {
            sortNumber += -1
          }
        })
        return sortNumber
      })
    }

    if (params.filter) {
      const filter = JSON.parse(params.filter)

      if (Object.keys(filter).length > 0) {
        dataSource = dataSource.filter((item) => {
          return Object.keys(filter).some((key) => {
            if (!filter[key]) {
              return true
            }

            if (filter[key].includes(`${item[key]}`)) {
              return true
            }

            return false
          })
        })
      }
    }

    if (params.name) {
      dataSource = dataSource.filter((data) => data.name.includes(params.name || ''))
    }

    const result = {
      data: dataSource,
      total: courseListDataSource.length,
      success: true,
      pageSize,
      current: parseInt(`${params.currentPage}`, 10) || 1,
    }
    return res.json(result)
  }, [courseList, dispatch])

  /**
   * 添加课程信息
   * @param values
   */
  const addCourseInfo = useCallback((values) => {
    dispatch({
      type: 'Course/createNewCourse',
      payload: values,
      onError: (err) => {
        notification.error({
          message: '创建课程失败',
          description: err.message,
        })
      },
      onFinish: () => {
        message.success('创建课程成功')
      },
    })
  }, [dispatch])

  const [createModalVisible, handleModalVisible] = useState(false)
  const [updateModalVisible, handleUpdateModalVisible] = useState(false)
  const [stepFormValues, setStepFormValues] = useState({})
  const actionRef = useRef()
  const [row, setRow] = useState()
  const [selectedRowsState, setSelectedRows] = useState([])
  const columns = [
    {
      title: '课程ID',
      dataIndex: 'courseID',
      hideInForm: true,
      formItemProps: { rules: [{ required: true, message: '课程ID是必须项' }] },
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
      formItemProps: { rules: [{ required: true }] },
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>
      },
    },
    {
      title: '课程学分',
      dataIndex: 'courseCredit',
      formItemProps: { rules: [{ required: true }] },
    },
    {
      title: '课程学时',
      dataIndex: 'courseStudyTimeNeeded',
      formItemProps: { rules: [{ required: true }] },
    },
    {
      title: '课程类型',
      dataIndex: 'courseType',
      formItemProps: { rules: [{ required: true }] },
    },
    {
      title: '课程描述',
      dataIndex: 'courseDescription',
      valueType: 'textarea',
      formItemProps: { rules: [{ required: true, max: 50 }] },
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
            切换
          </a>
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
      title: '课程类型',
      dataIndex: 'courseType',
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
          <a>作业管理</a>
          <Divider type='vertical' />
          <a>实验管理</a>
          <Divider type='vertical' />
          <a>对抗练习</a>
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
        request={(params, sorter, filter) => getCourseList({ ...params, sorter, filter })}
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
        <ProCard>
          <StepsForm
            onFinish={async (values) => {
              // console.log(values)
              addCourseInfo(values)
              handleModalVisible(false)
            }}
            formProps={{
              validateMessages: {
                required: '此项为必填项',
              },
            }}
          >
            <StepsForm.StepForm name='createStep1'>
              <ProFormText
                name='course_name'
                label='课程名称'
                width='m'
                placeholder='请输入课程名称'
                rules={[{ required: true }]}
              />
              <ProFormTextArea
                name='course_description'
                label='课程描述'
                width='m'
                placeholder='请输入课程描述'
                rules={[{ required: true }]}
              />
            </StepsForm.StepForm>
            <StepsForm.StepForm name='createStep2'>
              <ProFormText
                name='course_credit'
                label='课程学分'
                width='m'
                placeholder='请输入课程学分'
                rules={[{ required: true }]}
              />
              <ProFormText
                name='course_study_time_needed'
                label='课程学时'
                width='m'
                placeholder='请输入课程学时'
                rules={[{ required: true }]}
              />
              <ProFormSelect
                name='course_type'
                label='课程类型'
                width='m'
                rules={[{ required: true }]}
                initialValue='1'
                options={[
                  { value: '1', label: '必修' },
                  { value: '2', label: '选修' },
                ]}
              />
            </StepsForm.StepForm>
            <StepsForm.StepForm name='createStep3'>
              <FormItem name='course_time' label='课程开始结束时间' rules={[{ required: true }]}>
                <RangePicker showTime />
              </FormItem>
            </StepsForm.StepForm>
          </StepsForm>
        </ProCard>
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

export default React.memo(connect(mapStateToProps)(course_list))
// export default course_list
