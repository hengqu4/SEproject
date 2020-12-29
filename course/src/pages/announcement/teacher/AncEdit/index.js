import React, { useRef, useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Input, Button, Form, Modal, Space } from 'antd'
import formatTime from '@/utils/formatTime'
import {connect, useParams} from 'umi'
import {Link} from 'react-router-dom'
import { useMount } from 'react-use';
import onError from '@/utils/onError';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons'

const { TextArea } = Input

const mapStateToProps = ({ announcement, Course }) => ({
  ancList: announcement.ancList,
  info: announcement.ancInfo,
  courseId: Course.currentCourseInfo.courseId,
})

const FormatDataInfo = (info) => {
  const formattedAncList = {
    announcementTitle: "",
    announcementContents: "",
    announcementIsPinned: null,
  }
  formattedAncList.announcementTitle = info.announcementTitle
  formattedAncList.announcementContents = info.announcementContents
  formattedAncList.announcementIsPinned = info.announcementIsPinned
  return formattedAncList
}

const AncInfo = ({
  info = {},
  ancList = [],
  dispatch = () => { },
  courseId = courseId
}) => {
  const params = useParams()
  const [ancInfo, setAncInfo] = useState({
    announcementTitle: "",
    announcementContents: "",
    announcementIsPinned: true,
  })
  const [loading, setLoading] = useState(true)
  const [announcementId, setAnnouncementId ] = useState(params.announcementId)
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

  //修改某公告
  const modifyAncInfo = () => {
    dispatch({
      type: 'announcement/modifyAncInfo',
      payload: {
        courseId, announcementId, ancInfo,
      },
      onError,
      onFinish: setLoading.bind(this, false),
    })
  }

  //获得某公告信息
  const getAncInfo = () => {
    dispatch({
      type: 'homework/fetchAncInfo',
      payload: {
        courseId, announcementId,
      }
    })
  }

  useMount(() => {
    // getAncList()
    getAncInfo()
    //console.log(hwList)
  })

  const handleAncInfo = (values) => {
    ancInfo.announcementTitle = form.getFieldValue('title')
    ancInfo.announcementContents = form.getFieldValue('des')
    // console.log(hwInfo.homeworkCreateTime)
    // console.log(hwList)
    modifyAncInfo();
  }
 
  const data = {
    title: FormatDataInfo(info).announcementTitle,
    des: FormatDataInfo(info).announcementContents,
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
              des: data.des,
            }}
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

export default connect(mapStateToProps)(AncInfo)