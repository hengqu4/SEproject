import React, {useState} from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Upload, Tag, Button, Divider } from 'antd';
import { connect, useParams } from 'umi'
import { useMount } from 'react-use';
import {Link} from 'react-router-dom'
import onError from '@/utils/onError';
import { values } from 'lodash';
import formatTime from '@/utils/formatTime'
import { UploadOutlined } from '@ant-design/icons';

const mapStateToProps = ({ homework, Course, user, file }) => ({
  hwList: homework.hwList,
  info: homework.hwInfo,
  courseId: Course.currentCourseInfo.courseId,
  currentUser: user.currentUser,
  url: file.url,
})

const FormatDataInfo = (info) => {
  const formattedHwInfo = {
    homeworkTitle: "",
    homeworkDescription: "",
    startTime: "",
    endTime: "",
    url:'',
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

  //上传某文件
  const addFile = () => {
    dispatch({
      type: 'file/addFile',
      payload: {
        courseId, fileInfo,
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
    endTime: formatTime(FormatDataInfo(info).homeworkEndTime),
    startTime: formatTime(FormatDataInfo(info).homeworkStartTime),
    owner: FormatDataInfo(info).homeworkDescription,
  }

  const props = {
    action: url,
    method: 'PUT',
    maxCount: 1,
    showUploadList: false,
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        // console.log(url)
        // console.log(fileInfo.fileDisplayName)
        message.success(`${info.file.name} 上传成功！`);
        location.reload(false)
      }
      else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败！`);
      }
    },
    beforeUpload(file) {
      // fileInfo.fileDisplayName = file.name
    },
  };

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
        <div style={{ paddingLeft: '60px', paddingTop: '100px' }}>
          <Divider />
          <Upload {...props}>
            {/* <Button icon={<UploadOutlined />}> */}
            <Button icon={<UploadOutlined />} onClick={() => { addFile() }}>
              上传文件
            </Button>
          </Upload>,
        </div>
        
      </div>
    </PageContainer>
  )
}

export default connect(mapStateToProps)(HwInfo)