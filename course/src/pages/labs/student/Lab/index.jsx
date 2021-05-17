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
  message
} from 'antd'
import { ClockCircleOutlined, UserOutlined, EditTwoTone, RollbackOutlined} from '@ant-design/icons'
import ProForm, { ProFormUploadDragger } from '@ant-design/pro-form'
import { PageContainer } from '@ant-design/pro-layout'
import { useMount } from 'react-use'
import { connect, useParams, useRouteMatch, useLocation, Link, history } from 'umi'
import styles from './style.less'

const FormItem = Form.Item
const { TextArea } = Input
const { Paragraph } = Typography
const { Countdown } = Statistic;

const FormatData = (courseCaseId,fileUpload, courseId) => {
  const formattedLab = {
    courseCaseId: courseCaseId,
    submissionFileName: "student submit fake token",
    courseId
  }
  return formattedLab
}

const LabCase = ({ lab,user, Course }) => ({
  isSuccess: lab.isSuccess,
  labData: lab.labCaseList,
  currentUser: user.currentUser,
  courseId: Course.currentCourseInfo.courseId
})

const Lab = ({ props, labData = [], currentUser = [], courseId, dispatch = () => {} }) => {
  const params = useParams()
  const [form] = Form.useForm()
  const [showPublicUsers, setShowPublicUsers] = React.useState(false)
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 4,
      },
    },
    wrapperCol: {
      xs: {
        span: 16,
      },
    },
  }
  const submitFormLayout = {
    wrapperCol: {
      xs: {
        span: 0,
        offset: 10,
      },
    },
  }
  const columns = [
    {
      title: '名称',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '日期',
      dataIndex: 'fileDate',
      key: 'fileDate',
    },
    {
      title: '大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
    },
    {
      title: '操作',
      key: 'fileAction',
      render: (text, record) => (
        <span>
          <a
            style={{
              marginRight: 16,
            }}
          >
            下载
          </a>
        </span>
      ),
    },
  ]
  const data = [
    {
      key: '1',
      fileName: '实验说明书.jpg',
      fileDate: '2020-5-7',
      fileSize: '167 KB',
    },
  ]

  const onFinish = (form) => {
    console.log(params.courseCaseId,currentUser.id,form.fileUpload)
    const submitData = FormatData(params.courseCaseId,currentUser.id,form.fileUpload, courseId)
    console.log("FSS")
    console.log(submitData)
    dispatch({
      type: 'lab/submitLabCase',
      payload: submitData,
      onError: (err) => {
        notification.error({
          message: '学生提交实验案例失败',
          description: err.message,
        })
      },
    }).then(
      message.success('提交成功'),
      history.push('/labs/list')
    )
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
        <Countdown 
          title="倒计时" 
          style={{position:'flxed',float:'right'}}
          value={Date.parse(labData.caseEndTimestamp)}
          onFinish={onFinish} 
        />
        <div style={{textAlign:'center', width:'80%', paddingLeft:'12%',margin:'20px'}}>
          <h2>{labData.experimentName}</h2>
          <h3>{labData.experimentCaseName}</h3>
          <Paragraph>{labData.experimentCaseDescription}</Paragraph>
          <div>
            <Tag icon={<ClockCircleOutlined />}>
              截止时间：{labData.endTime}
            </Tag>
          
            <Button key='edit' type='link' icon={<EditTwoTone />}>
              编辑
            </Button>
            <Button key='back' type='link' icon={<RollbackOutlined />} onClick={() => window.history.back()}>
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
            <Table pagination={false} columns={columns} dataSource={data} />
          </FormItem>
          <FormItem>
            <ProFormUploadDragger {...formItemLayout} max={4} label='提交报告' name='fileUpload' disabled={Date.now()<Date.parse(labData.caseStartTimestamp)||Date.now()>Date.parse(labData.caseEndTimestamp) || labData.isSubmit}/>
          </FormItem>

          {labData.isPublicScore?(
          <FormItem {...formItemLayout} label='实验得分' name='labScore'>
            <Statistic value={5} suffix='/ 100' />
          </FormItem>
          ):null}
          
          {labData.isPublicScore?(
          <FormItem {...formItemLayout} label='教师评语' name='submissionComments'>
            <TextArea
              style={{
                minHeight: 32,
              }}
              rows={4}
              readOnly="readOnly"
              defaultValue={"comment"}
            />
          </FormItem>
          ):null}

          {/*
          <FormItem
            {...submitFormLayout}
            style={{
              marginTop: 48,
            }}
          >*/}
          {Date.now()>Date.parse(labData.caseStartTimestamp)&&Date.now()<Date.parse(labData.caseEndTimestamp) && !labData.isSubmit?(
            <Button
              style={{
                marginLeft: 16,
              }}
              type='primary'
              htmlType='submit'
              // loading={submitting}
            >
              提交作业
            </Button>
          ):<p>本实验尚未开始进行或您已提交过实验报告</p>
          }
          
          {/*</FormIm>*/}
        </Form>
      </Card>
    </PageContainer>
  )
}

export default connect(LabCase)(Lab)