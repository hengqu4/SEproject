import React, { useRef, useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Input, Button, Form, Modal, Space } from 'antd'
import formatTime from '@/utils/formatTime'
import {connect} from 'umi'
import {Link} from 'react-router-dom'
import { useMount } from 'react-use';
import onError from '@/utils/onError';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons'

const { TextArea } = Input

const mapStateToProps = ({ announcement, Course }) => ({
  ancList: announcement.ancList,
  courseId: Course.currentCourseInfo.courseId,
})

const FormatData = (ancList) => {
  const formattedAncList = []
  for (let i = 0; i < ancList.length; i++) {
    formattedAncList.push({
      key: ancList[i].announcementId,
      title: ancList[i].announcementTitle,
      des: ancList[i].announcementContents,
      isPinned: ancList[i].announcementIsPinned,
      createTime: formatTime(ancList[i].announcementPublishTime),
      updateTime: formatTime(ancList[i].announcementLastUpdateTime),
      creator: ancList[i].announcementSenderId,
    })
  }
  return formattedAncList
}

const AncList = ({
  ancList = [],
  dispatch = () => { },
  courseId = courseId
}) => {
  const [ancInfo, setAncInfo] = useState({
    announcementTitle: "",
    announcementContents: "",
    announcementIsPinned: true,
  })
  const [loading, setLoading] = useState(true)
  const [form] = Form.useForm()

  //获得当前公告列表
  const getAncList = () => {
    dispatch({
      type: 'announcement/fetchAncList',
      payload: {
        courseId,
      },
      onError,
      onFinish: setLoading.bind(this, false),
    })
  }

  //新建某公告
  const addAncInfo = () => {
    dispatch({
      type: 'announcement/addAncInfo',
      payload: {
        courseId, ancInfo,
      },
      onError,
      onFinish: setLoading.bind(this, false),
    })
  }

  useMount(() => {
    getAncList()
    //console.log(hwList)
  })

  const handleAncInfo = () => {
    ancInfo.announcementTitle = form.getFieldValue('title')
    ancInfo.announcementContents = form.getFieldValue('des')
    // console.log(hwInfo.homeworkCreateTime)
    // console.log(hwList)
    addAncInfo();
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
          form={form}
          initialValues={{ remember: true }}
        >
          <Form.Item
            label="公告名称"
            name="title"
            style={{width: '80%'}}
            rules={[{ required: true, message: '请输入名称！' }]}
          >
              <Input />
          </Form.Item>
          <Form.Item
            label="公告内容"
            name="des"
            style={{width: '80%'}}
            rules={[{ required: true, message: '请输入内容！' }]}
          >
              <TextArea />
          </Form.Item>
          <Form.Item>
            <Button>
              <Link to='/announcement/anc-list'>
                取消
              </Link>
            </Button>&nbsp;&nbsp;&nbsp;
            <Button 
              type="primary"
              htmlType="submit"
              onClick={() => {
                handleAncInfo()
              }}
            >
              <Link to='/announcement/anc-list'>
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

export default connect(mapStateToProps)(AncList)