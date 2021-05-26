import {Badge,Card,Descriptions,Popover,Table,} from 'antd';
import { GridContent, PageContainer, RouteContext } from '@ant-design/pro-layout';
import React, { useState, useRef, useCallback } from 'react'
import { useMount } from 'react-use'
import { connect } from 'umi';
import onError from '@/utils/onError'
import styles from './style.less';

const mapStateToProps = ({ Course }) => ({
  currentCourseInfo: Course.currentCourseInfo,
  courseList: Course.courseList,
})

//FIXME : cant set currentCourseId properly using students' account
//TODO: modify index(payload)
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
          courseId: 1
        },
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
      // onFinish:() => {
      //   setCurrentCourse(0)
      //   console.log(courseList)
      // },
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
    contestCount: '2'

  }

  return (
    <PageContainer>
      <div className={styles.main}>
        <Card>
          <Descriptions bordered>
            <Descriptions.Item label="课程ID">{ currentCourseInfo.courseId}</Descriptions.Item>
            <Descriptions.Item label="课程名称">{ currentCourseInfo.courseName}</Descriptions.Item>
            <Descriptions.Item label="开课学校">{ currentCourseInfo.courseCreatorSchoolId}</Descriptions.Item>
            <Descriptions.Item label="课程学分">{ currentCourseInfo.courseCredit}</Descriptions.Item>
            <Descriptions.Item label="课程学时">{ currentCourseInfo.courseStudyTimeNeeded}</Descriptions.Item>
            <Descriptions.Item label="课程类型">{ currentCourseInfo.courseType}</Descriptions.Item>
            <Descriptions.Item label="课程开始时间">{ currentCourseInfo.courseStartTime}</Descriptions.Item>
            <Descriptions.Item label="课程结束时间">{ currentCourseInfo.courseEndTime}</Descriptions.Item>
            <Descriptions.Item label="理论课次数">{ currentCourseInfo.lectureCount}</Descriptions.Item>
            <Descriptions.Item label="实验课次数">{ currentCourseInfo.experimentCount}</Descriptions.Item>
            <Descriptions.Item label="作业次数">{ currentCourseInfo.homeworkCount}</Descriptions.Item>
            <Descriptions.Item label="对抗练习次数">{ currentCourseInfo.contestCount}</Descriptions.Item>
            <Descriptions.Item label="课程描述">{ currentCourseInfo.courseDescription}</Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </PageContainer>
  );
}

export default connect(mapStateToProps)(course_info);
