import { Badge, Card, Descriptions, Popover, Table } from 'antd'
import { GridContent, PageContainer, RouteContext } from '@ant-design/pro-layout'
import React, { useState, useRef, useCallback } from 'react'
import { useMount } from 'react-use'
import { connect } from 'umi'
import onError from '@/utils/onError'
import styles from './style.less'
import ProTable from '@ant-design/pro-table'

const mapStateToProps = ({ Course }) => ({
  currentCourseInfo: Course.currentCourseInfo,
  courseList: Course.courseList,
})

// FIXME : cant set currentCourseId properly using students' account
// TODO: modify index(payload)
const course_info = ({ currentCourseInfo = {}, courseList = [], dispatch = () => {} }) => {
  /**
   * 设置当前课程
   * @param courseID
   */
  const setCurrentCourse = useCallback(
    (index) => {
      dispatch({
        type: 'Course/getCurrentCourseInfoStudent',
        payload: {
          courseId: index,
        },
        onError,
      })
    },
    [currentCourseInfo, dispatch],
  )

  useMount(() => {
    console.log('准备接受数据')
    dispatch({
      type: 'Course/getAllCourses',
      onError,
      onFinish: () => {
        // setCurrentCourse(0)
        console.log(courseList)
      },
    })
  })

  const tempData = {
    courseID: '1111',
    courseName: '计算机网络',
    courseCreatorSchoolId: '同济大学',
    courseCredit: '3',
    courseStudyTimeNeeded: '51',
    courseType: '理论课',
    courseDescription: '这是一门好课！！',
    courseStartTime: '2020-9-14',
    courseEndTime: '2021-1-22',
    lectureCount: '25',
    experimentCount: '17',
    homeworkCount: '2',
    contestCount: '2',
  }

  const columns = [
    {
      title: '课程ID',
      dataIndex: 'courseId',
      hideInForm: true,
      fixed: 'left',
      width: 100,
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
      fixed: 'left',
      width: 150,
    },
    {
      title: '课程学分',
      dataIndex: 'courseCredit',
      width: 100,
      formItemProps: { rules: [{ required: true }] },
    },
    {
      title: '课程学时',
      dataIndex: 'courseStudyTimeNeeded',
      width: 100,
      formItemProps: { rules: [{ required: true }] },
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
  ]

  return (
    <PageContainer>
      <div className={styles.main}>
        <ProTable
          columns={columns}
          dataSource={courseList}
          search={false}
        >
        </ProTable>
      </div>
    </PageContainer>
  )
}

export default connect(mapStateToProps)(course_info)
