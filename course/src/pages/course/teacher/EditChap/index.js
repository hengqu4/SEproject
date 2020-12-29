import React, {useState} from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Form, Input, Button, } from 'antd';
import { connect, useParams } from 'umi'
import { useMount } from 'react-use';
import {Link} from 'react-router-dom'
import onError from '@/utils/onError';
import { values } from 'lodash';

const mapStateToProps = ({ lecture, Course }) => ({
  lecList: lecture.lecList,
  courseId: Course.currentCourseInfo.courseId,
  info: lecture.lecInfo,
})

const FormatDataInfo = (info) => {
  const formattedLecInfo = {
    courseChapterId: 0,
    courseChapterTitle: "",
    courseChapterMoocLink: "",
  }
  formattedLecInfo.courseChapterId = info.courseChapterId
  formattedLecInfo.courseChapterTitle = info.courseChapterTitle
  formattedLecInfo.courseChapterMoocLink = info.courseChapterMoocLink
  return formattedLecInfo
}

const LecInfo = ({ info = {}, lecList = [], dispatch = () => { }, courseId = courseId }) => {
  const params = useParams()
  const [lecInfo, setLecInfo] = useState({ courseChapterId: 0, courseChapterTitle: "string", courseChapterMoocLink: "string" })
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState(params.courseChapterId)
  const [form] = Form.useForm()

  //获得当前章节信息列表
  const getLecList = () => {
    dispatch({
      type: 'lecture/fetchLecList',
      payload: {
        courseId,
      },
      onError,
      onFinish: setLoading.bind(this, false),
    })
  }

  //修改某章节信息
  const modifyLecInfo = () => {
    dispatch({
      type: 'lecture/modifyLecInfo',
      payload: {
        courseId, id, lecInfo,
      }
    })
  }

  //获得某章节信息
  const getLecInfo = () => {
    dispatch({
      type: 'lecture/fetchLecInfo',
      payload: {
        courseId, id,
      }
    })
  }

  useMount(() => {
    // getLecList()
    getLecInfo()
  })

  const handleLecInfo = () => {
    lecInfo.courseChapterId = id
    lecInfo.courseChapterTitle = form.getFieldValue('title')
    lecInfo.courseChapterMoocLink = form.getFieldValue('link')
    modifyLecInfo();
  }

  const data = {
    title: FormatDataInfo(info).courseChapterTitle,
    link: FormatDataInfo(info).courseChapterMoocLink,
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
            initialValues={{
              remember: true,
              title: data.title,
              link: data.link,
            }}
        >
          <Form.Item
            label="章节名称"
            name="title"
            style={{width: '80%'}}
            rules={[{ required: true, message: '请输入名称！' }]}
          >
              <Input name="title" onChange={(value) => console.log(value)}/>
                {/* <Input placeholder={data.title}/> */}
          </Form.Item>
          <Form.Item
            label="章节链接"
            name="link"
            style={{ width: '80%' }}
            rules={[{ required: true, message: '请输入链接！' }]}
          >
            <Input />
                {/* <Input placeholder={data.link}/> */}
          </Form.Item>
          {/* </Form><Form.Item {...tailLayout}> */}
          <Form.Item>
            <Button>
              <Link to='/course/chap-list'>
                取消
              </Link>
            </Button>&nbsp;&nbsp;&nbsp;
            <Button 
              type="primary"
              htmlType="submit"
              onClick={() => {
                handleLecInfo()
              }}
            >
              <Link to='/course/chap-list'>
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

export default connect(mapStateToProps)(LecInfo)



const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};