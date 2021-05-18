import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Input, Form, InputNumber, Radio, Select, Tooltip, Popover, Progress, notification } from 'antd';
import { connect, FormattedMessage, formatMessage } from 'umi';
import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>,
}

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
}

const ImportSingleAccount = (props) => {
  const { submitting } = props;
  const [form] = Form.useForm();
  const [visible, setvisible] = useState(false)
  const [popover, setpopover] = useState(false)
  const confirmDirty = false

  const [personalId, setPersonalId] = useState()
  const [password, setPassword] = useState()
  const [realname, setRealname] = useState()
  const [email, setEmail] = useState()
  const { dispatch } = props

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 7,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 12,
      },
      md: {
        span: 10,
      },
    },
  };
  const submitFormLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 10,
        offset: 7,
      },
    },
  };

  const onFinish = () => {
    const data = {
      personalId: personalId.toString(),
      realname,
      password,
      universityName: 'tj',
      schoolName: 'sse',
      university_id: '1',
      school_id: '1',
      character: '4',
      email,
      avatar: {},
    }
    dispatch({
      type: 'account/uploadSingleAccount',
      payload: data,
      onError: (err) => {
        notification.error({
          message: '导入失败',
          description: err.message,
        })
      },
      onSuccess: () => {
        notification.success({
          message: '导入成功',
        })
      }
    })
  };

  const onValuesChange = (_, allValues) => {
    setPassword(allValues.password)
    setRealname(allValues.realname)
    setPersonalId(allValues.personal_id)
    setEmail(allValues.email)
  };

  const getPasswordStatus = () =>{
    const value = form.getFieldValue('password')
    if (value && value.length > 9) {
      return 'ok'
    }

    if (value && value.length > 5) {
      return 'pass'
    }

    return 'poor'
  }

  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password')
    const passwordStatus = getPasswordStatus()
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null
  }

  const checkConfirm = (_, value) => {
    const promise = Promise

    if (value && value !== form.getFieldValue('password')) {
      return promise.reject('两次输入的密码不匹配!')
    }

    return promise.resolve()
  }

  const checkPassword = (_, value) => {
    const promise = Promise // 没有值的情况

    if (!value) {
      setvisible(!!value)
      return promise.reject('请输入密码！')
    } // 有值的情况

    if (!visible) {
      setvisible(!!value)
    }

    setpopover(!popover)

    if (value.length < 6) {
      return promise.reject('')
    }

    if (value && confirmDirty) {
      form.validateFields(['confirm'])
    }

    return promise.resolve()
  }

  return (
    <PageContainer
      content={<FormattedMessage id="导入单个学生账号" />}
    >
      <Card bordered={false}>
        <Form
          hideRequiredMark
          style={{
            marginTop: 8,
          }}
          form={form}
          name="basic"
          initialValues={{
            public: '1',
          }}
          onFinish={onFinish}
          onValuesChange={onValuesChange}
        >
          <FormItem
            {...formItemLayout}
            label = "邮箱"
            name = "email"
            rules = {[
              {
                required: true,
                message: '请输入邮箱地址！',
              },
              {
                type: 'email',
                message: '邮箱地址格式错误！',
              },
            ]}
          >
            <Input placeholder='邮箱'/>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label= '姓名'
            name='realname'
            rules={[
              {
                required: true,
                message: '请输入真实姓名！',
              },
            ]}
          >
            <Input placeholder='姓名' />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='学号'
            name='personal_id'
            rules={[
              {
                required: true,
                message: '请输入学号！'
              },
              {
                pattern: new RegExp(/^[1-9]\d*$/, "g"),
                message: '请输入纯数字组成的学号！'
              }
            ]}
          >
            <Input
              placeholder='学号'
            />
          </FormItem>
          <Popover
            getPopupContainer={(node)=>{
              if(node && node.parentNode){
                return node.parentNode
              }
              return node
            }}
            content={
              visible && (
                <div
                  style={{
                    padding: '4px 0'
                  }}
                >
                  {passwordStatusMap[getPasswordStatus()]}
                  {renderPasswordProgress()}
                  <div
                    style={{
                      marginTop: 10,
                    }}
                  >
                    请至少输入 6 个字符。请不要使用容易被猜到的密码。
                  </div>
                </div>
              )
            }
            overlayStyle={{
              width: 240,
            }}
            visible={visible}
          >
            <FormItem
              {...formItemLayout}
              label='密码'
              name='password'
              className={
                form.getFieldValue('password') &&
                form.getFieldValue('password').length > 0 &&
                styles.password
              }
              rules={[
                {
                  validator: checkPassword,
                },
              ]}
            >
              <Input type = 'password' placeholder = '至少6位密码，区分大小写' />
            </FormItem>
          </Popover>
          <FormItem
            {...formItemLayout}
            label='确认密码'
            name='confirm'
            rules={[
              {
                required: true,
                message: '请确认密码!',
              },
              {
                validator: checkConfirm
              },
            ]}
          >
            <Input type='password' placeholder='确认密码' />
          </FormItem>
          


          <FormItem
            {...submitFormLayout}
            style={{
              marginTop: 32,
            }}
          >
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={submitting}
              // onClick={onConfirmClicked()}
            >
              提交
            </Button>
          </FormItem>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default connect()(ImportSingleAccount)
