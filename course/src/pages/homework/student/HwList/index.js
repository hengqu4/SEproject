import React, { useEffect, useRef, useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Input, Button, Table, Modal, Space, Select } from 'antd'
import formatTime from '@/utils/formatTime'
import {connect} from 'umi'
import {Link} from 'react-router-dom'
import { useMount } from 'react-use';
import onError from '@/utils/onError';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons'

const { Option } = Select

const mapStateToProps = ({ homework, Course }) => ({
  hwList: homework.hwList,
  courseId: Course.currentCourseInfo.courseId,
  courseList: Course.courseList
})

const FormatData = (hwList) => {
  const formattedHwList = []
  for (let i = 0; i < hwList.length; i++) {
    formattedHwList.push({
      key: hwList[i].homeworkId,
      title: hwList[i].homeworkTitle,
      des: hwList[i].homeworkDescription,
      createTime: formatTime(hwList[i].homeworkCreateTimestamp),
      updateTime: formatTime(hwList[i].homeworkUpdateTimestamp),
      startTime: formatTime(hwList[i].homeworkStartTimestamp),
      endTime: formatTime(hwList[i].homeworkEndTimestamp),
      creator: hwList[i].homeworkCreator,
    })
  }
  return formattedHwList
}

const HwList = ({
  hwList = [],
  dispatch = () => { },
  courseId = courseId,
  courseList = []
}) => {
  const [loading, setLoading] = useState(true)
  const [homeworkId, setHomeworkId ] = useState()
  const [ modalVisible, setModalVisible ] = useState(false)
  const ref = useRef()

  //获得当前作业列表
  const getHwList = (value) => {
    dispatch({
      type: 'homework/fetchHwList',
      payload: {
        courseId: value,
      },
      onError,
      onFinish: setLoading.bind(this, false),
    })
  }

  useMount(() => {
    if(courseId != -1){
      getHwList(courseId)
    }
    console.log(hwList)
  })

  useEffect(() => {
    getHwList(courseId)
  }, [courseId])

  const setCurrentCourse = (index) => (
    dispatch({
      type: 'Course/getCurrentCourseInfoStudent',
      payload: {
        courseId: index,
      },
      onError,
    })
  )

  const handleSelectOnChange = (value) => {
    setCurrentCourse(value)
    getHwList(value)
  }

  const data = {
    grade: 100
  }
  
  const columns = [
    {
      title: '作业名称',
      dataIndex: 'title',
      width: '15%',
      render: (text, index) => {
        return <a>{text}</a>
      },
    },
    {
      title: '作业内容',
      dataIndex: 'des',
      width: '30%',
    },
    {
      title: '发布者',
      dataIndex: 'creator',
      width: '10%',
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      width: '15%',
    },
    {
      title: '截止日期',
      dataIndex: 'endTime',
      width: '15%',
    },
    {
      title: '操作',
      dataIndex: 'opr',
      width: '15%',
      render: (_, record) => (
        <>
          <Link to={`/homework/hw-ls/hw-info/${record.key}`}>详情&nbsp;&nbsp;&nbsp;&nbsp;</Link>
        </>
      )
    }
  ]

  return (
    <PageContainer>
      <ProTable
        headerTitle='作业列表'
        // actionRef={ref}
        search={false}
        dataSource={FormatData(hwList)}
        columns={columns}
      />
    </PageContainer>
  )
}

export default connect(mapStateToProps)(HwList)