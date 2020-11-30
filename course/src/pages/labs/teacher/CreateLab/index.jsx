import { InfoCircleOutlined } from '@ant-design/icons'
import { Button, Card, DatePicker, Input, Form, InputNumber, Radio, Select, Tooltip } from 'antd'
import ProForm, { ProFormUploadDragger } from '@ant-design/pro-form'
import { connect, FormattedMessage, formatMessage } from 'umi'
import React from 'react'
import { PageContainer } from '@ant-design/pro-layout'
// import ReactQuill from 'react-quill'
import styles from './style.less'
import 'react-quill/dist/quill.snow.css'

const FormItem = Form.Item
const { Option } = Select
const { RangePicker } = DatePicker
const { TextArea } = Input

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

  const onFinish = (values) => {
    const { dispatch } = props
    dispatch({
      type: 'labsAndCreateLab/submitRegularForm',
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

  return (
    <PageContainer>
      <Card bordered={false}>
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
            name='title'
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
            label='实验描述'
            name='description'
            rules={[
              {
                required: true,
                message: '请输入实验描述',
              },
            ]}
          >
            <TextArea
              style={{
                minHeight: 32,
              }}
              placeholder='请输入实验描述'
              rows={3}
            />
          </FormItem>
          <FormItem>
            <ProFormUploadDragger {...formItemLayout} max={4} label='上传附件' name='upload' />
          </FormItem>
          <FormItem
            {...submitFormLayout}
            style={{
              marginTop: 48,
            }}
          >
            <Button>取消创建</Button>
            <Button
              style={{
                marginLeft: 16,
              }}
              type='primary'
              htmlType='submit'
              loading={submitting}
            >
              创建实验
            </Button>
          </FormItem>
        </Form>
      </Card>
    </PageContainer>
  )
}

export default connect(({ loading }) => ({
  submitting: loading.effects['labsAndCreateLab/submitRegularForm'],
}))(CreateLab)
