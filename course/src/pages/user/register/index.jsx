import {
  Form,
  Button,
  Col,
  Input,
  Popover,
  Progress,
  Row,
  Select,
  message,
  notification,
} from 'antd'
import React, { useState, useEffect } from 'react'
import { Link, connect, history, FormattedMessage, formatMessage } from 'umi'
import styles from './style.less'

const namespace = 'register'

const FormItem = Form.Item
const { Option } = Select
const InputGroup = Input.Group
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

const Register = ({ submitting, dispatch, userAndregister }) => {
  const [count, setcount] = useState(0)
  const [visible, setvisible] = useState(false)
  const [prefix, setprefix] = useState('86')
  const [popover, setpopover] = useState(false)
  const [universityList, setUniveristyList] = useState([{ label: '同济大学', value: 1 }])
  const [schoolList, setSchoolList] = useState([{ label: '软件学院', value: 1 }])
  const confirmDirty = false
  let interval
  const [form] = Form.useForm()
  // useEffect(() => {
  //   if (!userAndregister) {
  //     return
  //   }

  //   const account = form.getFieldValue('mail')
  //   // eslint-disable-next-line no-console
  //   console.log('Received values of form: ', userAndregister)
  //   if (userAndregister.isSuccess) {
  //     message.success('注册成功！')
  //     history.push({
  //       pathname: '/user/register-result',
  //       state: {
  //         account,
  //       },
  //     })
  //   }
  // }, [userAndregister])

  useEffect(
    () => () => {
      clearInterval(interval)
    },
    [],
  )

  const getPasswordStatus = () => {
    const value = form.getFieldValue('password')

    if (value && value.length > 9) {
      return 'ok'
    }

    if (value && value.length > 5) {
      return 'pass'
    }

    return 'poor'
  }

  const onFinish = (values) => {
    dispatch({
      type: 'register/submit',
      payload: { ...values, prefix },
    }).then((response) => {
      console.log(response)
      if (response.isSuccess) {
        const account = response.data.userId
        message.success('注册成功！')
        history.push({
          pathname: '/user/register-result',
          state: {
            account,
          },
        })
      } else {
        const errorText = response.error.message
        notification.error({
          message: `注册失败`,
          description: errorText,
        })
      }
    })
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

  const changePrefix = (value) => {
    setprefix(value)
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

  return (
    <div className={styles.main}>
      <h3>注册</h3>
      <Form form={form} name='UserRegister' onFinish={onFinish}>
        <FormItem
          name='email'
          rules={[
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
          <Input size='large' placeholder='邮箱' />
        </FormItem>
        <FormItem
          name='realname'
          rules={[
            {
              required: true,
              message: '请输入真实姓名！',
            },
          ]}
        >
          <Input size='large' placeholder='真实姓名' />
        </FormItem>
        <FormItem
          name='school_id'
          rules={[
            {
              required: true,
              message: '请选择学校！',
            },
          ]}
        >
          <Select size='large' placeholder='所属学校' options={universityList} />
        </FormItem>
        <FormItem
          name='university_id'
          rules={[
            {
              required: true,
              message: '请选择学院！',
            },
          ]}
        >
          <Select size='large' placeholder='所属学院' options={schoolList} />
        </FormItem>
        <FormItem
          name='character'
          rules={[
            {
              required: true,
              message: '请选择账号类型！',
            },
          ]}
        >
          <Select size='large' placeholder='账号类型'>
            <Option value='1' disabled>
              责任教师
            </Option>
            <Option value='2' disabled>
              教师
            </Option>
            <Option value='3' disabled>
              助教
            </Option>
            <Option value='4'>学生</Option>
          </Select>
        </FormItem>
        <FormItem
          name='personal_id'
          rules={[
            {
              required: true,
              message: '请输入学号！',
            },
          ]}
        >
          <Input size='large' placeholder='学号' />
        </FormItem>
        <Popover
          getPopupContainer={(node) => {
            if (node && node.parentNode) {
              return node.parentNode
            }

            return node
          }}
          content={
            visible && (
              <div
                style={{
                  padding: '4px 0',
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
          placement='right'
          visible={visible}
        >
          <FormItem
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
            <Input size='large' type='password' placeholder='至少6位密码，区分大小写' />
          </FormItem>
        </Popover>
        <FormItem
          name='confirm'
          rules={[
            {
              required: true,
              message: '请确认密码！',
            },
            {
              validator: checkConfirm,
            },
          ]}
        >
          <Input size='large' type='password' placeholder='确认密码' />
        </FormItem>
        {/* <InputGroup compact>
          <Select
            size='large'
            value={prefix}
            onChange={changePrefix}
            style={{
              width: '20%',
            }}
          >
            <Option value='86'>+86</Option>
            <Option value='87'>+87</Option>
          </Select>
          <FormItem
            style={{
              width: '80%',
            }}
            name='mobile'
            rules={[
              {
                required: true,
                message: '请输入手机号！',
              },
              {
                pattern: /^\d{11}$/,
                message: '手机号格式错误！',
              },
            ]}
          >
            <Input size='large' placeholder='手机号' />
          </FormItem>
        </InputGroup> */}
        {/* <Row gutter={8}>
          <Col span={16}>
            <FormItem
              name='captcha'
              rules={[
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ]}
            >
              <Input size='large' placeholder='验证码' />
            </FormItem>
          </Col>
          <Col span={8}>
            <Button
              size='large'
              disabled={!!count}
              className={styles.getCaptcha}
              onClick={onGetCaptcha}
            >
              {count ? `${count} s` : '获取验证码'}
            </Button>
          </Col>
        </Row> */}
        <FormItem>
          <Button
            size='large'
            loading={submitting}
            className={styles.submit}
            type='primary'
            htmlType='submit'
          >
            注册
          </Button>
          <Link className={styles.login} to='/user/login'>
            使用已有账户登录
          </Link>
        </FormItem>
      </Form>
    </div>
  )
}

export default connect(({ userAndregister, loading }) => ({
  userAndregister,
  submitting: loading.effects['register/submit'],
}))(Register)
