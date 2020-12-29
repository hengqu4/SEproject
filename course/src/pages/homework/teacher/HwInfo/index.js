import React, {useState} from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Form, Input, Button, } from 'antd';
import { connect, useParams } from 'umi'
import { useMount } from 'react-use';
import {Link} from 'react-router-dom'
import onError from '@/utils/onError';
import { values } from 'lodash';

const mapStateToProps = ({ homework, Course, user }) => ({
  hwList: homework.hwList,
  info: homework.hwInfo,
  courseId: Course.currentCourseInfo.courseId,
  currentUser: user.currentUser,
})

const FormatData = (hwList, homeworkId) => {
  const formattedLecInfo = {}
  for (let i = 0; i < hwList.length; i++) {
    if (hwList[i].homeworkId === homeworkId) {
      formattedLecInfo.homeworkTitle = hwList[i].homeworkTitle
      formattedLecInfo.homeworkDescription = hwList[i].homeworkDescription
      formattedLecInfo.startTime = hwList[i].startTime
      formattedLecInfo.endTime = hwList[i].endTime
      break
    }
  }
  return formattedLecInfo
}

const HwInfo = ({ hwList = [], dispatch = () => {}, courseId = courseId, currentUser = [] }) => {
  const params = useParams()
  const [hwInfo, setLecInfo] = useState({
    homeworkTitle: "",
    homeworkDescription: "",
    homeworkStartTime: "",
    homeworkEndTime: "",
  })
  const [loading, setLoading] = useState(true)
  const [homeworkId, setHomeworkId ] = useState(params.homeworkId)

  const info = FormatData(hwList, homeworkId)
  console.log(info)

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
    getHwList()
    getHwInfo()
    
    // console.log(params.courseChapterId)
    // console.log(courseId)
  })

  const handleHwInfo = (values) => {
    hwInfo.homeworkTitle = "早点回家"
    hwInfo.homeworkDescription = "安慰水电费感觉开了花"
    hwInfo.homeworkStartTime = "2020-12-30T00:59:05.092+08:00"
    hwInfo.homeworkEndTime = "2020-12-31T00:59:05.092+08:00"
    // console.log(list)
    modifyHwInfo();
  }

  return (
    <PageContainer>
      <div
        style={{
          height: '100vh',
          background: '#fff',
        }}
      >
      <div style={{ paddingTop: '40px', margin:'40px'}}>
        <Form
          name="basic"
          initialValues={{ remember: true, title: info.homeworkTitle }}
        >
          <Form.Item
            label="作业名称"
            name="title"
            style={{width: '80%'}}
            rules={[{ required: true, message: '请输入名称！' }]}
          >
              <Input />
          </Form.Item>
          <Form.Item
            label="作业内容"
            name="des"
            style={{width: '80%'}}
            rules={[{ required: true, message: '请输入内容！' }]}
          >
            <Input style={{height: '150px'}}/>
            </Form.Item>
            <Form.Item
            label="开始日期"
            name="startTime"
            style={{width: '80%'}}
            rules={[{ required: true, message: '请输入日期！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="截止日期"
            name="endTime"
            style={{width: '80%'}}
            rules={[{ required: true, message: '请输入日期！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button>
              <Link to='/homework/hw-list'>
                取消
              </Link>
            </Button>&nbsp;&nbsp;&nbsp;
            <Button 
              type="primary"
              htmlType="submit"
              onClick={() => {
                handleHwInfo()
              }}
            >
              <Link to='/homework/hw-list'>
                保存
              </Link>
            </Button>
          </Form.Item>
        </Form>
        </div>
      </div>
    </PageContainer>
  )
}

export default connect(mapStateToProps)(HwInfo)

const data = {
    key: '1',
    title: '第一次作业',
    content: '给妈妈洗脚并写一篇心得',
    date: '2020.11.24',
    owner: 'Dri',
  }

const MatchHistory = (props) => {
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
          <Tag color="blue">{data.date}</Tag>
          <Tag color="blue">{data.owner}</Tag>
          <Button size='small' style={{fontSize: '10px', color: '#019cea'}}>编辑</Button>
          {/* <a style={{fontSize: '10px'}}>编辑</a> */}
          <p style={{marginTop: '30px'}}>
            {data.content}
          </p>
        </div>
        
      </div>
    </PageContainer>
  )
}