import React, { useState, useRef, useCallback, useMemo } from 'react'
import { connect } from 'umi'
import { List, Avatar, Card, Space, message } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import onError from '@/utils/onError'
import { useMount } from 'react-use'
import ModalStudentMatches from '@/pages/contest/teacher/MatchHistory/components/ModalStudentMatches'
import classes from '@/pages/contest/teacher/MatchHistory/style.less'

const mapStateToProps = ({ Contest, Course }) => ({
  courseId: Course.currentCourseInfo.courseId,
  students: Contest.students,
  studentsPagination: Contest.studentsPagination,
  studentMatches: Contest.studentMatches,
})

const StudentMatches = ({
  courseId = -1,
  students = [],
  studentsPagination = {},
  studentMatches = [],
  dispatch = () => {},
}) => {
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [currStudent, setCurrStudent] = useState({})

  const modalRef = useRef(null)

  const getStudents = useCallback(
    (pageNum, pageSize) => {
      setStudentsLoading(true)

      dispatch({
        type: 'Contest/fetchStudents',
        payload: {
          pageNum,
          pageSize,
          courseId,
        },
        onError,
        onFinish: setStudentsLoading.bind(this, false),
      })
    },
    [dispatch, courseId],
  )

  useMount(() => {
    getStudents(1, 24)
  })

  const handleViewStudentMatches = useCallback(
    (student) => {
      const dismiss = message.info('正在加载该学生的比赛信息')
      setCurrStudent(student)
      dispatch({
        type: 'Contest/fetchStudentMatches',
        payload: {
          studentId: student.userId,
          courseId,
        },
        onError,
        onFinish: () => {
          dismiss()
          modalRef.current.open()
        },
      })
    },
    [dispatch, courseId],
  )

  const pagination = useMemo(
    () => ({
      ...studentsPagination,
      current: studentsPagination.pageNum,
      showSizeChanger: false,
      onChange: getStudents,
    }),
    [studentsPagination, getStudents],
  )

  const renderItem = useCallback(
    (student) => (
      <List.Item key={student.userId}>
        <Card
          actions={[
            <span key='matches' onClick={handleViewStudentMatches.bind(this, student)}>
              <Space>
                <CopyOutlined /> <span>查看比赛历史</span>
              </Space>
            </span>,
          ]}
        >
          <Card.Meta
            avatar={<Avatar src={student.avatar} />}
            title={student.realname}
            description={student.personalId}
          />
          <p className={classes.StudentCardDescription}>邮箱：{student.email}</p>
          <p className={classes.StudentCardDescription}>昵称：{student.nickname}</p>
        </Card>
      </List.Item>
    ),
    [handleViewStudentMatches],
  )

  return (
    <React.Fragment>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 6,
          xxl: 6,
        }}
        loading={studentsLoading}
        dataSource={students}
        pagination={pagination}
        renderItem={renderItem}
      />
      <ModalStudentMatches studentMatches={studentMatches} student={currStudent} ref={modalRef} />
    </React.Fragment>
  )
}

export default React.memo(connect(mapStateToProps)(StudentMatches))
