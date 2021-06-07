import React, { useState, useMemo, useCallback, useRef } from 'react'
import {
  Button,
  Card,
  DatePicker,
  Input,
  Form,
  InputNumber,
  Radio,
  Select,
  Statistic,
  Tooltip,
  Table,
  Tabs,
  Tag,
  PageHeader,
  Typography,
  notification,
  message,
} from 'antd'
import ProTable from '@ant-design/pro-table'
import { ClockCircleOutlined, UserOutlined, EditTwoTone, RollbackOutlined } from '@ant-design/icons'
import ProForm, { ProFormUploadDragger } from '@ant-design/pro-form'
import { PageContainer } from '@ant-design/pro-layout'
import { useMount } from 'react-use'
import { connect, useParams, useRouteMatch, useLocation, Link, history } from 'umi'
import styles from './style.less'
import axios from 'axios'
import Authorized from '@/components/Authorized/Authorized';

const FormItem = Form.Item
const { TextArea } = Input
const { Paragraph } = Typography
const { Countdown } = Statistic
const PORT = SERVER_PORT

// const FormatData = (courseCaseId, fileUpload, courseId) => {
//   const formattedLab = {
//     courseCaseId,
//     submissionFileName: 'student submit fake token',
//     courseId,
//   }
//   return formattedLab
// }

const LabCase = ({ lab, user, Course }) => ({
  isSuccess: lab.isSuccess,
  labData: lab.labCaseList,
  currentUser: user.currentUser,
  courseId: Course.currentCourseInfo.courseId,
})

const FormatTime = (endTime) => {
  // let time = endTime.slice(0,-6)
  // const time = endTime[0,9]+" "+ endTime[11,19]
  console.log(typeof(endTime))
  // let time = endTime.slice(0,-6)
  let time = endTime
  return time
}

const FormatDownload = (LabData) => {
  console.log("FormatDownload")
  console.log(LabData)
  // console.log(LabData.CASE_FILE_DOWNLOAD_URL)
  const download = []
  download.push({
    key:1,
    fileName:'实验手册',
    fileUrl:LabData.CASE_FILE_DOWNLOAD_URL
  })
  download.push({
    key:2,
    fileName:'参考答案',
    fileUrl:LabData.ANSWER_FILE_DOWNLOAD_URL
  })
  console.log(download)
  return download
}

const noMatch = <div />;

const Lab = ({ props, labData = [], currentUser = [], courseId, dispatch = () => {} }) => {
  const actionRef = useRef();
  const params = useParams()
  const [form] = Form.useForm()
  const [showPublicUsers, setShowPublicUsers] = React.useState(false)
  const [uploadFile, setUploadFile] = useState()

  const columns  = [
    {
      title: '名称',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text,record,index) => 
        <a href={record.fileUrl}  target="_blank" rel="noopener noreferrer" >{text}</a>
    },
    // {
    //   title: '下载地址',
    //   dataIndex: 'fileUrl',
    //   key: 'fileUrl',
    //   // ellipsis: true,
    //   render: (text) =><span >{text}</span>
    // },
    {
      title: '操作',
      key: 'fileAction',
      render: (text,record,index) => <span>
      <a href={record.fileUrl}  target="_blank" rel="noopener noreferrer" >下载</a>
      </span>
    },
  ]
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 7,
      },
    },
    wrapperCol: {
      xs: {
        span: 10,
      },
    },
  }
  const submitFormLayout = {
    wrapperCol: {
      xs: {
        span: 6,
        offset:11
      },
    },
  }
  const uploadReport = (val) => {
    return axios.post(`http://localhost:${PORT}/api/v1/experiment/assignments/student/list/`, {
      courseId,
      courseCaseId: params.courseCaseId,
      submissionUploader: currentUser.id,
      submissionFileName: val.fileUpload.file.name,
    })
  }

  const modifyReport = (val) => {
    return axios.put(`http://localhost:${PORT}/api/v1/experiment/assignments/student/list/`, {
      courseId,
      courseCaseId: params.courseCaseId,
      submissionUploader: currentUser.id,
      submissionFileName: val.fileUpload.file.name,
    })
  }

  const onFinish = (val) => {
    console.log(courseId)
    console.log(params.courseCaseId)
    console.log(uploadFile)
    axios
      .post(`http://localhost:${PORT}/api/v1/experiment/assignments/student/list/`, {
        courseId,
        courseCaseId: params.courseCaseId,
        // submissionFileName: uploadFile.name,
        
        submissionFileName: "uploadFile.name",
      })
      .then((res) => {
        const firstResponse = res.headers
        const putUrl = firstResponse.submission_upload_url
        console.log(putUrl)
        axios({
          method: 'put',
          url: putUrl,
          data: uploadFile,
          headers: { 'Content-Type': `application/octet-stream` },
        }).then((res) => {
          notification.success({
            message: '上传成功!',
          })
          history.push('/labs/all')
        })
      })
      .catch((res) => {
        notification.error({
          message: res,
        })
      })
  }

  const onFinishFailed = (errorInfo) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo)
  }

  const onValuesChange = (changedValues) => {
    const { publicType } = changedValues
    if (publicType) setShowPublicUsers(publicType === '2')
  }

  useMount(() => {
    console.log(params)
    console.log(params.courseCaseId)

    dispatch({
      type: 'lab/fetchLabCase',
      payload: params.courseCaseId,
      onError: (err) => {
        notification.error({
          message: '获取实验详情失败',
          description: err.message,
        })
      },
    }).then(
      console.log(`labData`),
      console.log(labData)
    )
  })
  

  return (
    <PageContainer title={false}>
      <Card bordered={false}>
        <Countdown title='倒计时' style={{ position: 'flxed', float: 'right' }}
          value={Date.parse(labData.caseEndTimestamp)}
          onFinish={onFinish}
        />
        <div style={{ textAlign: 'center', width: '80%', paddingLeft: '12%', margin: '20px' }}>
          <h2>{labData.experimentName}</h2>
          <h3>{labData.experimentCaseName}</h3>
          <Paragraph>{labData.experimentCaseDescription}</Paragraph>
          <div>
            {/*<Tag icon={<ClockCircleOutlined />}>截止时间：{FormatTime(labData.caseEndTimestamp)}</Tag>
            <Tag icon={<ClockCircleOutlined />}>截止时间：{labData.caseEndTimestamp}</Tag>*/}

            <Button key='edit' type='link' icon={<EditTwoTone />}>编辑</Button>
            <Button key='back' type='link' icon={<RollbackOutlined />} onClick={() => window.history.back()} >
              返回
            </Button>
          </div>
        </div>

        <Form
          hideRequiredMark
          style={{
            marginTop: 8,
          }}
          form={form}
          name='basic'
          initialValues={{
            public: '1',
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onValuesChange={onValuesChange}
        >
          <FormItem {...formItemLayout} label='下载附件' name='fileUpload'>
            <Table pagination={false} columns={columns} dataSource={FormatDownload(labData)} />
          </FormItem>

          <Authorized authority={['student']} noMatch={noMatch}>
          <FormItem>
            <ProFormUploadDragger
              {...formItemLayout}
              max={4}
              label='提交报告'
              name='fileUpload'
              disabled={
                Date.now() < Date.parse(labData.caseStartTimestamp) ||
                Date.now() > Date.parse(labData.caseEndTimestamp) ||
                labData.isSubmit
              }
              action={(v) => setUploadFile(v)}
            />
          </FormItem>
          </Authorized>

          {labData.isPublicScore ? (
            <FormItem {...formItemLayout} label='实验得分' name='labScore'>
              <Statistic value={5} suffix='/ 100' />
            </FormItem>
          ) : null}{labData.isPublicScore ? (
            <FormItem {...formItemLayout} label='教师评语' name='submissionComments'>
              <TextArea
                style={{
                  minHeight: 32,
                }}
                rows={4}
                readOnly='readOnly'
                defaultValue={'comment'}
              />
            </FormItem>
          ) : null}

          <Authorized authority={['student']} noMatch={noMatch}>
          <FormItem
            {...submitFormLayout}
            style={{
              marginTop: 48,
            }}
          >
          {Date.now() > Date.parse(labData.caseStartTimestamp) &&
          Date.now() < Date.parse(labData.caseEndTimestamp) &&
          !labData.isSubmit ? (
            <Button
              type='primary'
              htmlType='submit'
              // loading={submitting}
            >
              提交作业
            </Button>
          ) : (
            // <h1>未在实验进行期间</h1>
            <div/>
          )}
          </FormItem>
          </Authorized>

        </Form>
      </Card>
    </PageContainer>
  )
}

export default connect(LabCase)(Lab)
