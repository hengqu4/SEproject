import { InfoCircleOutlined } from '@ant-design/icons'
import { Button, Card, DatePicker, Input, Form, InputNumber, Radio, Select, Tooltip, Modal } from 'antd'
import ProForm, { ProFormUploadDragger } from '@ant-design/pro-form'
import React from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { connect, history } from 'umi'
import { useMount } from 'react-use'
import styles from './style.less'
import { ExclamationCircleOutlined } from '@ant-design/icons';
// import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const FormItem = Form.Item
const { Option } = Select
const { RangePicker } = DatePicker
const { TextArea } = Input
const { confirm } = Modal;

const FormatData = (labCase) => {
  const formattedLab = {
    experimentName: labCase.expName,
    experimentCaseName: labCase.caseName,
    experimentCaseDescription: labCase.caseDesc,
    // FIXME: lack of experiment_case_file_name and answer_file_name
    experimentCaseFileToken:"fake file token",
    answerFileToken:"fake file token",
  }
  return formattedLab
}

const CreateLab = (props) => {
  const { submitting } = props
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

  const onFinish = (labCase) => {
    console.log(labCase)
    console.log(FormatData(labCase))
    
    const { dispatch } = props
    dispatch({
      type: 'lab/createLabCase',
      payload: FormatData(labCase),
      onError: (err) => {
        notification.error({
          message: '教师创建实验案例失败',
          description: err.message,
        })
      },
    }).then(
      history.push('/labs/all')
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

function showPromiseConfirm() {
  confirm({
    title: 'Do you want to delete these items?',
    icon: <ExclamationCircleOutlined />,
    content: 'When clicked the OK button, this dialog will be closed after 1 second',
    onOk() {
      return new Promise((resolve, reject) => {
        setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
      }).catch(() => console.log('Oops errors!'));
    },
    onCancel() {},
  });
}
  return (
    <PageContainer title={false}>
      <Card title="创建实验" bordered={false}>
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
          <FormItem
            {...formItemLayout}
            label='实验标题'
            name='expName'
            rules={[
              {
                required: true,
                message: '请输入实验标题',
              },
            ]}
          >
            <Input placeholder='请输入实验标题' />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='案例名称'
            name='caseName'
            rules={[
              {
                required: true,
                message: '请输入案例名称',
              },
            ]}
          >
            <Input placeholder='请输入案例名称' />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={
              <span>
                案例描述
                <br/><em className={styles.optional}>（选填）</em>
              </span>
            }
            name='caseDesc'
          >
            <TextArea
              style={{
                minHeight: 32,
              }}
              placeholder='请输入案例描述'
              rows={3}
            />
          </FormItem>

          <FormItem>
            <ProFormUploadDragger {...formItemLayout} max={4} label='实验附件' name='caseFile' />
          </FormItem>

          <FormItem>
            <ProFormUploadDragger {...formItemLayout} max={4} label='参考答案' name='answerFile' />
          </FormItem>

          {/*
          <FormItem
            {...submitFormLayout}
            style={{
              marginTop: 48,
            }}
          >*/}
          
            <Button
              style={{
                marginLeft: 16,
              }}
              type='primary'
              htmlType='submit'
            >
              创建实验
            </Button>
            
          {/*</FormItem>*/}
        </Form>
      </Card>
    </PageContainer>
  )
}

export default connect(null)(CreateLab)