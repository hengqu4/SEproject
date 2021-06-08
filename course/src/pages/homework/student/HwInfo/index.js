import React, {useState} from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Upload, Tag, Button, Divider, Form, Input, notification } from 'antd';
import { connect, useParams } from 'umi'
import { useMount } from 'react-use';
import onError from '@/utils/onError';
import formatTime from '@/utils/formatTime'
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';
import fileUrl from '@/utils/fileUrl';

const mapStateToProps = ({ homework, Course, user, file }) => ({
  homeworkInfo: homework,
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

const HwInfo = ({ dispatch = () => {}, courseId = courseId, studentId = studentId, homeworkInfo = homeworkInfo }) => {
  const params = useParams()
  const [ homeworkId, setHomeworkId ] = useState(params.homeworkId)
  const [ uploadDisable, setUploadDisable ] = useState(false)
  const [ uploadFile, setUploadFile ] = useState()

  var addr=`http://${fileUrl()}/api/v1/lecture/course-homework/${courseId}/homework/${homeworkId}/file/${homeworkInfo.hwFile.fileHomeworkId}`

  //获得某作业信息
  const getHwInfo = () => {
    dispatch({
      type: 'homework/fetchHwInfo',
      payload: {
        courseId, homeworkId,
      }
    })
  }

  const getGrade = () => {
    dispatch({
      type: 'homework/fetchGrade',
      payload: {
        courseId, homeworkId, studentId,
      },
      onSuccess: () => {
        setUploadDisable(true)
      },
      onError: () => {
        setUploadDisable(false)
        dispatch({
          type:'homework/setGradeToDefault'
        })
      }
    })
  }

  const getFile = () => {
    var fileUploader = studentId
    dispatch({
      type: 'homework/fetchHwFile',
      payload: {
        courseId, homeworkId, fileUploader,
      },
    })
  }
  
  useMount(() => {
    getHwInfo()
    getGrade()
    getFile()
  }) 
  
  const data = {
    title: FormatDataInfo(homeworkInfo.hwInfo).homeworkTitle,
    des: FormatDataInfo(homeworkInfo.hwInfo).homeworkDescription,
    endTime: formatTime(FormatDataInfo(homeworkInfo.hwInfo).endTime),
    startTime: formatTime(FormatDataInfo(homeworkInfo.hwInfo).startTime),
    owner: FormatDataInfo(homeworkInfo.hwInfo).homeworkDescription,
  }

  const onFormFinish = (val) => {
    axios.put(`http://${fileUrl()}/api/v1/lecture/course-homework/${courseId}/homework/${homeworkId}/file`, {
        homeworkFileDisplayName: val,
        homeworkFileComment: "no comment",
    })
      .then(res => {
        const firstResponse = res.data
        const putUrl = firstResponse.FILE_PUT_URL
        console.log(putUrl);
        axios({
          method: "put",
          url: putUrl,
          data: uploadFile,
          headers: { "Content-Type": `application/octet-stream`, }
        })
          .then(res => {
            notification.success({
              message: '作业上传成功!'
            })
          })
      })
      .catch(res =>{
        notification.error({
          message: res,
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
          <Form>
            <Form.Item
              label="您的分数："
            >
              <Input
                style={{
                  width: '60px'
                }}
                value={homeworkInfo.hwGradeInfo.homeworkScore}
                readOnly={true}
              />
            </Form.Item>
          </Form>
          <Form
            layout = "horizontal"
            onFinish={(val) => {onFormFinish(val.homework.file.name)}}
          >
            <Form.Item
              name="homework"
            >
              <Upload
                multiple={false}
                maxCount={1}
                showUploadList={{
                  showDownloadIcon:true,
                }}
                disabled = {uploadDisable || data.endTime <= formatTime(new Date())}
                action={(v) => setUploadFile(v)}
              >
                <Button 
                  disabled={uploadDisable || data.endTime <= formatTime(new Date())}
                  icon={<UploadOutlined />}
                >
                  Click to Upload
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                disabled = {uploadDisable || data.endTime <= formatTime(new Date())}
              >
                提交
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </PageContainer>
  )
}

export default connect(mapStateToProps)(HwInfo)