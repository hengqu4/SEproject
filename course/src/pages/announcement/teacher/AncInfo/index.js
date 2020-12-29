import React, { useRef, useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Input, Button, Table, Modal, Space } from 'antd'
import formatTime from '@/utils/formatTime'
import {connect, useParams} from 'umi'
import {Link} from 'react-router-dom'
import { useMount } from 'react-use';
import onError from '@/utils/onError';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons'

const mapStateToProps = ({ announcement, Course }) => ({
  ancList: announcement.ancList,
  info: announcement.ancInfo,
  courseId: Course.currentCourseInfo.courseId,
})

const FormatDataInfo = (info) => {
  const formattedHwInfo = {
    announcementTitle: "",
    announcementContents: "",
    announcementIsPinned: true,
  }
  formattedHwInfo.announcementTitle = info.announcementTitle
  formattedHwInfo.announcementContents = info.announcementContents
  formattedHwInfo.isPinned = info.isPinned
  console.log(formattedHwInfo)
  return formattedHwInfo
}

const AncInfo = ({
  info = {},
  ancList = [],
  dispatch = () => { },
  courseId = courseId
}) => {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [announcementId, setAnnouncementId ] = useState(params.announcementId)

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

   //获得某公告信息
   const getAncInfo = () => {
    dispatch({
      type: 'announcement/fetchAncInfo',
      payload: {
        courseId, announcementId,
      }
    })
  }

  useMount(() => {
    // getAncList()
    getAncInfo()
  })

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
        <div style={{width: '90%', margin: 'auto'}}>
          <h1 style={{paddingTop: '20px', fontSize: '20px', fontWeight: 'bold'}}>
            {data.title}
          </h1>
          <p style={{marginTop: '30px'}}>
            {data.des}
          </p>
        </div>
        
      </div>
    </PageContainer>
  )
}

export default connect(mapStateToProps)(AncInfo)