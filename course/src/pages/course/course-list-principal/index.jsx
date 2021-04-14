import React, { useState, useRef, useCallback } from 'react'
import { useMount } from 'react-use'
import ProCard from '@ant-design/pro-card'
import ProTable from '@ant-design/pro-table'
import { PlusOutlined } from '@ant-design/icons'
import ProDescriptions from '@ant-design/pro-descriptions'
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout'
import { StepsForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form'
import { Button, Divider, Drawer, message, DatePicker, TimePicker } from 'antd'
import FormItem from 'antd/lib/form/FormItem'
import CreateForm from './components/CreateForm'
import { connect } from 'umi'
import onError from '@/utils/onError'
import { value } from 'numeral'

const { RangePicker } = DatePicker

const mapStateToProps = ({ Course }) => ({
  currentCourseInfo: Course.currentCourseInfo,
  courseList: Course.courseList,
})

const course_list = ({ currentCourseInfo = {}, courseList = [], dispatch = () => {} }) => {
  /**
   * 设置当前课程
   * @param courseID
   */
  const setCurrentCourse = useCallback(
    (index) => {
      console.log(index)
      dispatch({
        type: 'Course/getCurrentCourseInfo',
        payload: index,
        onError,
      })
    },
    [currentCourseInfo, dispatch],
  )

  useMount(() => {
    console.log('准备接受数据')
    dispatch({
      type: 'Course/getAllCourse',
      onError,
      onFinish: setCurrentCourse(0),
    })
  })

  /**
   * 格式化课程数据
   * @param courseList
   */
  const FormatData = (courseList) => {
    const formattedCourseList = []
    for (let i = 0; i < courseList.length; i++) {
      formattedCourseList.push({
        key: i,
        courseID: courseList[i].courseId,
        courseName: courseList[i].courseName,
        courseCredit: courseList[i].courseCredit,
        courseStudyTimeNeeded: courseList[i].courseStudyTimeNeeded,
        courseType: courseList[i].courseType,
        courseDescription: courseList[i].courseDescription,
        courseStartTime: courseList[i].courseStartTime,
        courseEndTime: courseList[i].courseEndTime,
        courseCreatorSchoolId: courseList[i].courseCreatorSchoolId,
        courseIsScorePublic: courseList[i].courseIsScorePublic ? '公开' : '不公开',
      })
    }
    console.log(formattedCourseList)
    return formattedCourseList
  }

  /**
   * 添加课程信息
   * @param values
   */
  const addCourseInfo = useCallback(
    (values) => {
      dispatch({
        type: 'Course/createNewCourse',
        payload: values,
        onError,
        onFinish: () => {
          message.success('创建课程成功')
          console.log(courseList)
        },
      })
    },
    [dispatch],
  )

  const removeCourseInfo = useCallback(
    (value) => {
      dispatch({
        type: 'Course/deleteCourseInfo',
        payload: value,
        onError,
      })
    },
    [dispatch],
  )

  const [createModalVisible, handleModalVisible] = useState(false)
  const actionRef = useRef()
  const [row, setRow] = useState()
  const [selectedRowsState, setSelectedRows] = useState([])

  const columns = [
    {
      title: '课程ID',
      dataIndex: 'courseID',
      hideInForm: true,
      fixed: 'left',
      width: 100,
      formItemProps: { rules: [{ required: true, message: '课程ID是必须项' }] },
      sorter: (a, b) => a.courseID - b.courseID,
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
      fixed: 'left',
      width: 150,
      formItemProps: { rules: [{ required: true }] },
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              // console.log(entity)
              setRow(entity)
            }}
          >
            {dom}
          </a>
        )
      },
    },
    {
      title: '课程学分',
      dataIndex: 'courseCredit',
      width: 100,
      formItemProps: { rules: [{ required: true }] },
      sorter: (a, b) => a.courseCredit - b.courseCredit,
    },
    {
      title: '课程学时',
      dataIndex: 'courseStudyTimeNeeded',
      width: 100,
      formItemProps: { rules: [{ required: true }] },
      sorter: (a, b) => a.courseStudyTimeNeeded - b.courseStudyTimeNeeded,
    },
    {
      title: '课程类型',
      dataIndex: 'courseType',
      width: 100,
      formItemProps: { rules: [{ required: true }] },
    },
    {
      title: '课程描述',
      dataIndex: 'courseDescription',
      valueType: 'textarea',
      ellipsis: true,
      width: 250,
      formItemProps: { rules: [{ required: true, max: 50 }] },
    },
    {
      title: '开课学校',
      width: 150,
      dataIndex: 'courseCreatorSchoolId',
    },
    // {
    //   title: '课程开始时间',
    //   width: 250,
    //   detaIndex: 'courseStartTime',
    // },
    // {
    //   title: '课程结束时间',
    //   width: 250,
    //   detaIndex: 'courseEndTime',
    // },
    {
      title: '理论课次数',
      width: 150,
      dataIndex: 'lectureCount',
    },
    {
      title: '实验课次数',
      width: 150,
      dataIndex: 'experimentCount',
    },
    {
      title: '作业次数',
      width: 150,
      dataIndex: 'homeworkCount',
    },
    {
      title: '对抗练习次数',
      width: 150,
      dataIndex: 'contestCount',
    },
    {
      title: '课程分数是否公开',
      width: 150,
      dataIndex: 'courseIsScorePublic',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <>
          <a
            onClick={async () => {
              await setCurrentCourse(record.key)
              message.success('切换当前课程成功')
            }}
          >
            切换
          </a>
          <Divider type='vertical' />
          <a
            onClick={async () => {
              await removeCourseInfo(record.courseID)
              message.success('删除课程信息成功')
            }}
          >
            删除
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
      title: '开课学校',
      dataIndex: 'courseCreatorSchoolId',
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
      title: '课程分数是否公开',
      dataIndex: 'courseIsScorePublic',
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
        headerTitle='所有课程'
        actionRef={actionRef}
        rowKey='key'
        // search={{
        //   labelWidth: 120,
        // }}
        search={false}
        toolBarRender={() => [
          <Button key='primary' type='primary' onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        dataSource={FormatData(courseList)}
        columns={columns}
        scroll={{ x: 1450 }}
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
                initialValue='必修'
                options={[
                  { value: '必修', label: '必修' },
                  { value: '选修', label: '选修' },
                ]}
              />
            </StepsForm.StepForm>
            <StepsForm.StepForm name='createStep3'>
              <FormItem name='course_time' label='课程开始结束时间' rules={[{ required: true }]}>
                <RangePicker
                  showTime
                  format={'YYYY/MM/DD HH:mm'}
                  placeholder={['开始时间', '结束时间']}
                />
              </FormItem>
            </StepsForm.StepForm>
          </StepsForm>
        </ProCard>
      </CreateForm>

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
            // dataSource={row}
            params={{
              id: row?.courseID,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  )
}

export default connect(mapStateToProps)(course_list)
