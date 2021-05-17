import React, {useState} from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Form, Input, Button, DatePicker, notification } from 'antd';
import { connect, history } from 'umi'
import { useMount } from 'react-use';
import {Link} from 'react-router-dom'
import onError from '@/utils/onError';
import { values } from 'lodash';
import moment from 'moment';

const { TextArea } = Input

const mapStateToProps = ({ homework, Course, user }) => ({
  hwList: homework.hwList,
  courseId: Course.currentCourseInfo.courseId,
  currentUser: user.currentUser,
})

const FormatData = (hwList) => {
  const formattedHwList = []
  for (let i = 0; i < hwList.length; i++) {
    formattedHwList.push({
      key: hwList[i].homeworkId,
      title: hwList[i].homeworkTitle,
      des: hwList[i].homeworkDescription,
      createTime: hwList[i].homeworkCreateTimestamp,
      updateTime: hwList[i].homeworkUpdateTimestamp,
      startTime: hwList[i].homeworkStartTimestamp,
      endTime: hwList[i].homeworkEndTimestamp,
      creator: hwList[i].homeworkCreator,
    })
  }
  return formattedHwList
}


const HwInfo = ({ hwList = [], dispatch = () => {}, courseId = courseId, currentUser = [] }) => {
  const [hwInfo, setLecInfo] = useState({
    homeworkTitle: "",
    homeworkDescription: "",
    homeworkStartTime: "",
    homeworkEndTime: "",
  })
  const [loading, setLoading] = useState(true)
  const [form] = Form.useForm()
  const [startTime, setStartTime] = useState(null)

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


  const checkDeadline = (_, value) => {
    const promise = Promise
    if(startTime == null){
      return promise.resolve
    }

    if(value.startOf('day') <= startTime.startOf('day')){
      return promise.reject('请选择有效的截止日期')
    }
  
    return promise.resolve()
  
  }
  

  //新建某作业信息
  const addHwInfo = () => {
    dispatch({
      type: 'homework/addHwInfo',
      payload: {
        courseId, hwInfo,
      },
      onFinish:() => {
        setLoading.bind(this, false)
      },
      onSuccess: () => {
        notification.success({
          message: '布置成功',
        })
        history.goBack()
      }
    })
  }

  useMount(() => {
    getHwList()
  })

  const onChange = (value) => {
    console.log(value)
    lecInfo.courseChapterTitle = value
  }

  const handleHwInfo = () => {
    hwInfo.homeworkTitle = form.getFieldValue('title')
    hwInfo.homeworkDescription = form.getFieldValue('des')
    hwInfo.homeworkStartTime = new Date(form.getFieldValue('startTime')).toISOString()
    hwInfo.homeworkEndTime = new Date(form.getFieldValue('endTime')).toISOString()
    addHwInfo();
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
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={handleHwInfo}
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
              <TextArea />
          </Form.Item>
          <Form.Item
            label="开始日期"
            name="startTime"
            style={{width: '80%'}}
            rules={[{ required: true, message: '请输入日期！' }]}
          >
            <DatePicker 
              disabledDate={(current)=>(current < moment().startOf('day'))}
              onChange={(date)=>{setStartTime(date)}}
            />
          </Form.Item>
          <Form.Item
            label="截止日期"
            name="endTime"
            style={{width: '80%'}}
            rules={[
              { required: true, message: '请输入日期！' },
              { validator: checkDeadline },
            ]}
          >
            <DatePicker
              disabledDate={(current)=>(current.startOf('day') <= form.getFieldValue('startTime'))}
            />
          </Form.Item>
          {/* </Form><Form.Item {...tailLayout}> */}
          <Form.Item>
            <Button>
              <Link to='/homework/hw-list'>
                取消
              </Link>
            </Button>&nbsp;&nbsp;&nbsp;
            <Button 
              type="primary"
              htmlType="submit"
            >
              保存
            </Button>
          </Form.Item>
        </Form>
        </div>
      </div>
    </PageContainer>
  )
}

export default connect(mapStateToProps)(HwInfo)