import React, {useState} from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Upload, Tag, Button, Divider, message } from 'antd';
import { connect, useParams } from 'umi'
import { useMount } from 'react-use';
import {Link} from 'react-router-dom'
import onError from '@/utils/onError';
import { values } from 'lodash';
import formatTime from '@/utils/formatTime'
import axios from 'axios';

const mapStateToProps = ({ homework, Course, user, file }) => ({
  hwList: homework.hwList,
  info: homework.hwInfo,
  courseId: Course.currentCourseInfo.courseId,
  currentUser: user.currentUser.name,
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

const HwInfo = ({ info = {}, hwList = [], dispatch = () => {}, courseId = courseId, url='', currentUser = currentUser }) => {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [homeworkId, setHomeworkId ] = useState(params.homeworkId)
  var fileName
  var binary

  const host = 'localhost'

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
    endTime: formatTime(FormatDataInfo(info).homeworkEndTime),
    startTime: formatTime(FormatDataInfo(info).homeworkStartTime),
    owner: FormatDataInfo(info).homeworkDescription,
  }

  const handleChange = event => {
    fileName = event.target.value
    // 因为这样获取到的 fileName 包含路径，所以要对fileName进行切割
    // "/" 和 "\" 都有可能
    var tempFileNameList = fileName.split("\\")
    var tempFileName = tempFileNameList.pop()
    tempFileNameList = tempFileName.split("/")
    tempFileName = tempFileNameList.pop()
    fileName = tempFileName

    const reader = new FileReader();
    var inputBox = document.getElementById("inputbox");
    reader.readAsArrayBuffer(inputBox.files[0]);
    reader.onload = function(){
      // 读取完成后，数据保存在对象的result属性中
      // console.log(this.result)
      binary = this.result
    }
  }

  const handleSubmit = event => {
    event.preventDefault();
    var firstResponse
    var putUrl
    axios.put(`http://${host}:8000/api/v1/lecture/course-homework/${courseId}/homework/${homeworkId}/file`, {
        homeworkFileDisplayName: fileName,
        homeworkFileComment: "no comment",
    })
      .then(res => {
        console.log(res);
        console.log(res.data);
        firstResponse = res.data
        putUrl = firstResponse.FILE_PUT_URL
        console.log(putUrl);
        axios({
          method: "put",
          url: putUrl,
          data: binary,
          headers: { "Content-Type": `application/octet-stream`, }
        })
      })
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
        <div style={{ paddingLeft: '60px', paddingTop: '100px' }}>
          <Divider />
          <form onSubmit={handleSubmit}>
            <input type="file" name="name" id="inputbox" onChange={handleChange} />
            <input type="submit"/>
          </form>
        </div>
        
      </div>
    </PageContainer>
  )
}

export default connect(mapStateToProps)(HwInfo)