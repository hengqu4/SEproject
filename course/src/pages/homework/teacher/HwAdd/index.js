import React, {useState} from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Form, Input, Button, } from 'antd';
import { connect } from 'umi'
import { useMount } from 'react-use';
import {Link} from 'react-router-dom'
import onError from '@/utils/onError';
import { values } from 'lodash';

const mapStateToProps = ({ homework, Course, user }) => ({
  hwList: homework.hwList,
  courseId: Course.currentCourseInfo.courseId,
  currentUser: user.currentUser,
})

const FormatData = (hwList) => {
  const formattedLecList = []
  for (let i = 0; i < hwList.length; i++) {
    formattedLecList.push({
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
  return formattedLecList
}

const HwInfo = ({ hwList = [], dispatch = () => {}, courseId = courseId, currentUser = [] }) => {
  const [hwInfo, setLecInfo] = useState({
    homeworkTitle: "",
    homeworkDescription: "",
    homeworkStartTime: "",
    homeworkEndTime: "",
  })
  const [loading, setLoading] = useState(true)

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

  //新建某作业信息
  const addHwInfo = () => {
    console.log(hwInfo)
    console.log(currentUser)
    dispatch({
      type: 'homework/addHwInfo',
      payload: {
        courseId, hwInfo,
      },
      onFinish: setLoading.bind(this, false),
    })
  }

  useMount(() => {
    getHwList()
  })

  const onChange = (value) => {
    console.log(value)
    lecInfo.courseChapterTitle = value
  }

  const handleHwInfo = (values) => {
    var id = 1;
    const list = FormatData(hwList);
    for (let i = 0; i < list.length; i++) {
      if(id <= list[i].key)
        id = list[i].key + 1
    }
    hwInfo.homeworkTitle = "早点回家"
    hwInfo.homeworkDescription = "安慰水电费感觉开了花"
    hwInfo.homeworkStartTime = "2020-12-30T00:59:05.092+08:00"
    hwInfo.homeworkEndTime = "2020-12-31T00:59:05.092+08:00"
    // console.log(hwInfo.homeworkCreateTime)
    // console.log(hwList)
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
        name="basic"
        initialValues={{ remember: true }}
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