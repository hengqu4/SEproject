import React, { useState, useRef, useCallback } from 'react'
import { useMount } from 'react-use'
import ProTable from '@ant-design/pro-table'
import ProDescriptions from '@ant-design/pro-descriptions'
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout'
import { Button, Divider, Drawer, message, DatePicker } from 'antd'
import { connect } from 'umi'
import onError from '@/utils/onError'

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
      // onFinish: setCurrentCourse(0),
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
      })
    }
    return formattedCourseList
  }

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
      ellipsis: true,
      formItemProps: { rules: [{ required: true, max: 50 }] },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
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
        dataSource={FormatData(courseList)}
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
            columns={columnsPlus}
          />
        )}
      </Drawer>
    </PageContainer>
  )
}

export default connect(mapStateToProps)(course_list)
