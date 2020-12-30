import React, {useState} from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Form, Tag, Button, } from 'antd';
import { connect, useParams } from 'umi'
import { useMount } from 'react-use';
import {Link} from 'react-router-dom'
import onError from '@/utils/onError';
import { values } from 'lodash';
import formatTime from '@/utils/formatTime'

const mapStateToProps = ({ homework, Course, user }) => ({
  hwList: homework.hwList,
  info: homework.hwInfo,
  courseId: Course.currentCourseInfo.courseId,
  currentUser: user.currentUser,
})

const FormatDataInfo = (info) => {
  const formattedHwInfo = {
    homeworkTitle: "",
    homeworkDescription: "",
    startTime: "",
    endTime: "",
  }
  formattedHwInfo.homeworkTitle = info.homeworkTitle
  formattedHwInfo.homeworkDescription = info.homeworkDescription
  formattedHwInfo.startTime = info.homeworkStartTimestamp
  formattedHwInfo.endTime = info.homeworkEndTimestamp
  return formattedHwInfo
}

const HwInfo = ({ info = {}, hwList = [], dispatch = () => {}, courseId = courseId, currentUser = [] }) => {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [homeworkId, setHomeworkId ] = useState(params.homeworkId)


  //获得当前作业列表
  const getHwList = () => {
    dispatch({
      type: 'homework/fetchHwList',
      payload: {
        courseId,
      },
      onError,
      onFinish: setLoading.bind(this, false),
    })
  }

  //获得某作业信息
  const getHwInfo = () => {
    dispatch({
      type: 'homework/fetchHwInfo',
      payload: {
        courseId, homeworkId,
      }
    })
  }
  
  useMount(() => {
    // getHwList()
    getHwInfo()
  })
  
  const data = {
    title: FormatDataInfo(info).homeworkTitle,
    des: FormatDataInfo(info).homeworkDescription,
    startTime: formatTime(FormatDataInfo(info).homeworkStartTime),
    endTime: formatTime(FormatDataInfo(info).homeworkEndTime),
    owner: FormatDataInfo(info).homeworkDescription,
  }

  return (
    <PageContainer>
      <div
        style={{
          height: '100vh',
          background: '#fff',
        }}
      >
        <div style={{width: '90%', margin: 'auto'}}>
          <h1 style={{paddingTop: '20px', fontSize: '20px', fontWeight: 'bold'}}>
            {data.title}
          </h1>
          <Tag color="blue">开始日期 {data.startTime}</Tag>
          <Tag color="blue">截止日期 {data.endTime}</Tag>
          <p style={{marginTop: '30px'}}>
            {data.des}
          </p>
        </div>
        
      </div>
    </PageContainer>
  )
}

export default connect(mapStateToProps)(HwInfo)