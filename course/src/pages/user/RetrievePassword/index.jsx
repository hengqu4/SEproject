import { Form, Input, Popover, Progress, Button, notification } from 'antd'
import React, { useState, useEffect } from 'react'
import { Link } from 'umi'
import styles from './style.less'
import CountDown from 'ant-design-pro/lib/CountDown';
import { connect, history } from 'umi'

const FormItem = Form.Item
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

const ResetPassWord = ({dispatch = () => {}}) =>{
  const [status, setStatus] = useState('initial invalid sent reset')

  const [visible, setvisible] = useState(false)
  const [popover, setpopover] = useState(false)
  const [emailForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [checkForm] = Form.useForm()
  const [buttonDisable, setButtonDisable] = useState(false)
  const [sendCheck, setSendCheck] = useState("发送验证码")
  const [checkNumber, setCheckNumber] = useState()
  const [email, setEmail] = useState()

  const getPasswordStatus = () => {
    const value = passwordForm.getFieldValue('password')
    if (value && value.length > 9) {
      return 'ok'
    }
    if (value && value.length > 5) {
      return 'pass'
    }
    return 'poor'
  }
  const renderPasswordProgress = () => {
    const value = passwordForm.getFieldValue('password')
    console.log(value)
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

    // if (value && confirmDirty) {
    //   form.validateFields(['confirm'])
    // }

    return promise.resolve()
  }

  const onEmailFinish = (values) =>{
    setEmail(values.email)
    setButtonDisable(true)
    const targetTime = new Date().getTime() + 30000;
    setSendCheck(<CountDown 
                    style={{ fontSize: 20 }} 
                    target={targetTime} 
                    onEnd={() => {
                      setButtonDisable(false)
                      setSendCheck("发送验证码")
                    }} 
                  />)
    dispatch({
      type: 'account/sendEmailAddress',
      payload: values,
      onError: (err) => {
        notification.error({
          message: '验证码发送失败',
          description: err.message
        })
      },
      onSuccess: () => {
        notification.success({
          message: '发送成功，请检查邮箱',
        })
      }
    })
  }

  const checkConfirm = (_, value) => {
    const promise = Promise

    if (value && value !== passwordForm.getFieldValue('password')) {
      return promise.reject('两次输入的密码不匹配!')
    }

    return promise.resolve()
  }
  const onMailValidate = () => {
    setStatus('sent')
  }

  const onNewPasswordFinished = (values) => {
    setStatus('sent')
    const data = {
      email,
      new_password: values.password,
      token: values.checkNumber
    }    
    console.log(data)
    // history.goBack()
    dispatch({
      type: 'account/resetPassword',
      payload: values,
      onError: (err) => {
        notification.error({
          message: '修改失败，请检查验证码是否正确',
          description: err.message
        })
      },
      onSuccess: () => {
        notification.success({
          message: '修改成功',
        })
        history.goBack()
      }
    })
  }

  return (
    <div className={styles.main}>
      <Form form={emailForm} name='UserEmail' onFinish={(values) => {onEmailFinish(values)}}>
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
        <FormItem>
          <Button className={styles.send} type='primary' htmlType='submit' disabled={buttonDisable}>
            {sendCheck}
          </Button>
        </FormItem>
      </Form>
      <Form form={passwordForm} name='NewPassword' onFinish={(values) => {onNewPasswordFinished(values)}}>
      <div className={styles.valiCode}>
          <FormItem
            name='checkNumber'
            rules={[
              {
                required: true,
                message: '请输入验证码',
              },
            ]}
          >
            <Input
              style={{width:'150px'}}
              size='large' 
              placeholder='请输入验证码' 
              onChange={(value)=>console.log(value)}
            />
          </FormItem>
        </div>
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
              passwordForm.getFieldValue('password') &&
              passwordForm.getFieldValue('password').length > 0 &&
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
        <FormItem>
          <Button className={styles.reset} type='primary' htmlType='submit'>
            确认提交
          </Button>
        </FormItem>

      </Form>
    </div>
  )
}

export default connect()(ResetPassWord)
