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
        span: 2,
      },
    },
    wrapperCol: {
      xs: {
        span: 21,
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

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction

    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ['clean'], // remove formatting button
  ]
  return (
    <PageContainer content='表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。'>
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
              rows={2}
            />
          </FormItem>
          {/*
          <FormItem
            {...formItemLayout}
            style={{ height: 350 }}
            label='实验内容'
            name='content'
            rules={[
              {
                required: true,
                message: '请输入实验内容',
              },
            ]}
          >
            <ReactQuill
              id='labContent'
              style={{
                minHeight: 32,
                height: 300,
              }}
              placeholder='请输入实验内容'
            />
          </FormItem>
          */}
          <FormItem
            {...formItemLayout}
            label='起止日期'
            name='date'
            rules={[
              {
                required: true,
                message: '请选择起止日期',
              },
            ]}
          >
            <RangePicker
              style={{
                width: '100%',
              }}
              placeholder={['开始日期', '结束日期']}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={
              <span>
                是否公开
                <em className={styles.optional}>
                  <Tooltip title='公开则学生可见'>
                    <InfoCircleOutlined
                      style={{
                        marginRight: 4,
                      }}
                    />
                  </Tooltip>
                </em>
              </span>
            }
            name='publicType'
            rules={[
              {
                required: true,
                message: '请选择是否公开',
              },
            ]}
          >
            <div>
              <Radio.Group>
                <Radio value='yes'>是</Radio>
                <Radio value='no'>否</Radio>
              </Radio.Group>
            </div>
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
