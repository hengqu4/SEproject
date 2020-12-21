import React from 'react'
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
} from 'antd'

import { ClockCircleOutlined, UserOutlined, EditTwoTone, RollbackOutlined } from '@ant-design/icons'
import ProForm, { ProFormUploadDragger } from '@ant-design/pro-form'
import { PageContainer } from '@ant-design/pro-layout'
import { useMount } from 'react-use'
import { connect, useParams, useRouteMatch, useLocation, Link, history } from 'umi'
import styles from './style.less'

const FormItem = Form.Item
const { TextArea } = Input
const { Paragraph } = Typography
const { Countdown } = Statistic;

const LabCase = ({ lab }) => ({
  isSuccess: lab.isSuccess,
  labsData: lab.labCaseList,
})

// const Lab = ({ labsData = [], dispatch = () => {} }) => {
export const Lab = ({
  labsData = [],
  dispatch = () => {}
}) => {
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

  const onFinish = (values) => {
    const { dispatch } = props
    dispatch({
      type: 'labsAndLab/submitRegularForm',
      payload: values,
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
    dispatch({
      type: 'lab/fetchLabCase',
      //  /api/v1/experiment/experiment-database/detail/7
      payload: params,
      onError: (err) => {
        notification.error({
          message: '获取实验列表失败',
          description: err.message,
        })
      },
    })
  })
    
  const experimentName = "实验1"
  const experimentCaseName = "案例名称案例名称"
  const experimentCaseDescription = "这是一段实验描述这是一段实验描述这是一段实验描述这是一段实验描述这是一段实验描述这是一段实验描述这是一段实验描述这是一段实验描述这是一段实验描述这是一段实验描述"
  const comment = "真不戳!真不戳!真不戳!真不戳!真不戳!"
  const caseEndTimestamp = "2020-12-22T09:00:00+08:00"
  const endTime = Date.parse(caseEndTimestamp); 

  return (
    <PageContainer title={false}>
      <Card bordered={false}>
        <li>{deadline}</li>
        <Countdown 
          title="倒计时" 
          style={{position:'flxed',float:'right'}}
          value={endTime}
          onFinish={onFinish} 
        />
        <div style={{textAlign:'center', width:'80%', paddingLeft:'12%',margin:'20px'}}>
          <h2>{experimentName}</h2>
          <h3>{experimentCaseName}</h3>
          <Paragraph>{experimentCaseDescription}</Paragraph>
          <div>
            <Tag icon={<ClockCircleOutlined />}>
              截止时间：{endTime}
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
          <FormItem {...formItemLayout} label='下载附件' name='goal'>
            <Table pagination={false} columns={columns} dataSource={data} />
          </FormItem>
          <FormItem>
            <ProFormUploadDragger {...formItemLayout} max={4} label='提交报告' name='upload' />
          </FormItem>
          <FormItem {...formItemLayout} label='实验得分' name='labScore'>
            <Statistic value={5} suffix='/ 100' />
          </FormItem>
          <FormItem {...formItemLayout} label='教师评语' name='labReview'>
            <TextArea
              style={{
                minHeight: 32,
              }}
              rows={4}
              readOnly="readOnly"
              defaultValue={comment}
            />
          </FormItem>
          {/*
          <FormItem
            {...submitFormLayout}
            style={{
              marginTop: 48,
            }}
          >*/}
            <Button>保存草稿</Button>
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
            {/*
          </FormItem>*/}
        </Form>
      </Card>
    </PageContainer>
  )
}


export default connect(LabCase)(Lab)
// export default connect(({ loading }) => ({
//   submitting: loading.effects['labsAndLab/submitRegularForm'],
// }))(Lab)

