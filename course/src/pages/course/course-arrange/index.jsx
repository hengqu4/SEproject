/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { connect } from 'umi'
import ProTable from '@ant-design/pro-table'
import { Button, Table } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

export default connect(({ Course }) => ({
  curCourseInfo: Course.currentCourseInfo,
  courseStudentMap: Course.courseStudentMap,
}))(({ curCourseInfo = {}, courseStudentMap = new Map(), dispatch = () => {} }) => {
  useEffect(() => {
    console.log('initial')
    dispatch({
      type: 'Course/fetchCourseStudentRelation',
    })
  }, [])
  const [test, st] = useState([])
  const defaultData = [
    {
      email: '1853401@tongji.edu.cn',
      key: 0,
      realname: '123',
      studentId: 'Test',
    },
    {
      email: '1853401@tongji.edu.cn',
      key: 1,
      realname: '123',
      studentId: 'Test',
    },
  ]
  const columns = [
    {
      title: 'Id',
      dataIndex: 'studentId',
    },
    {
      title: 'Name',
      dataIndex: 'realname',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
  ]
  return (
    <Table dataSource={defaultData} colomns={columns} />
    // rowKey='key'
    // search={false}
    // toolBarRender={() => [
    //   <Button
    //     key='primary'
    //     type='primary'
    //     onClick={() => {
    //       console.log(
    //         courseStudentMap.get(curCourseInfo.courseId)?.map((r, i) => ({
    //           ...r,
    //           key: i,
    //           studentId: r.email.indexOf('tongji') === -1 ? r.email.slice(0, 7) : '测试号',
    //         })),
    //       )
    //     }}
    //   >
    //     <PlusOutlined /> 导入
    //   </Button>,
    // ]}
    // headerTitle={`${curCourseInfo.courseName}选课名单`}
    // dataSource={courseStudentMap.get(curCourseInfo.courseId)?.map((r) => ({
    //   ...r,
    //   key: r.email,
    //   studentId: r.email.indexOf('tongji') !== -1 ? r.email.slice(0, 7) : '测试号',
    // }))}
  )
})
