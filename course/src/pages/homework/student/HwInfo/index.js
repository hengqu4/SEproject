import React, {useState} from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Upload, Tag, Button, Divider, Col } from 'antd';
import { connect, useParams } from 'umi'
import { useMount } from 'react-use';
import {Link} from 'react-router-dom'
import onError from '@/utils/onError';
import { values } from 'lodash';
import formatTime from '@/utils/formatTime'
import axios from 'axios';

const PORT = 8000

const mapStateToProps = ({ homework, Course, user, file }) => ({
  hwList: homework.hwList,
  info: homework.hwInfo,
  grade: homework.grade,
  hwFile: homework.hwFile,
  courseId: Course.currentCourseInfo.courseId,
  studentId: user.currentUser.id,
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

const HwInfo = ({ info = {}, hwList = [], grade = '', hwFile = {}, dispatch = () => {}, courseId = courseId, url='', studentId = studentId }) => {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [homeworkId, setHomeworkId ] = useState(params.homeworkId)
  var fileName
  var binary

  var addr=`http://localhost:${PORT}/api/v1/lecture/course-homework/${courseId}/homework/${homeworkId}/file/${hwFile.fileHomeworkId}`

  //获得某作业信息
  const getHwInfo = () => {
    dispatch({
      type: 'homework/fetchHwInfo',
      payload: {
        courseId, homeworkId,
      }
    })
    console.log(info.homeworkStartTimestamp)
    console.log(formatTime(info.homeworkStartTimestamp))
  }

  const getGrade = () => {
    dispatch({
      type: 'homework/fetchGrade',
      payload: {
        courseId, homeworkId, studentId,
      }
    })
  }

  const getFile = () => {
    var fileUploader = studentId
    dispatch({
      type: 'homework/fetchHwFile',
      payload: {
        courseId, homeworkId, fileUploader,
      }
    })
  }
  
  useMount(() => {
    getHwInfo()
    getGrade()
    getFile()
  }) 
  
  const data = {
    title: FormatDataInfo(info).homeworkTitle,
    des: FormatDataInfo(info).homeworkDescription,
    endTime: formatTime(FormatDataInfo(info).endTime),
    startTime: formatTime(FormatDataInfo(info).startTime),
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
    axios.put(`http://localhost:${PORT}/api/v1/lecture/course-homework/${courseId}/homework/${homeworkId}/file`, {
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
          <p>分数：{grade}</p>
          <form onSubmit={handleSubmit}>
            <input type="file" name="name" id="inputbox" onChange={handleChange} />
            <input type="submit"/>
          </form>
          <div style={{ marginTop: '20px' }}>
            <a href={addr}>{hwFile.fileDisplayName}</a>
          </div>
        </div>
        
      </div>
    </PageContainer>
  )
}

export default connect(mapStateToProps)(HwInfo)