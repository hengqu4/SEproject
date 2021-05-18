import { Form, Input, Popover, Progress, Button } from 'antd'
import React, { useState, useEffect } from 'react'
import { Link } from 'umi'
import styles from './style.less'

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
export default () => {
  const [status, setStatus] = useState('initial invalid sent reset')

  const [visible, setvisible] = useState(false)
  const [popover, setpopover] = useState(false)
  const [emailForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
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
  return (
    <div className={styles.main}>
      <Form form={emailForm} name='UserEmail' onFinish={() => {}}>
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
          <Button className={styles.send} type='primary' htmlType='submit'>
            发送验证码
          </Button>
        </FormItem>
      </Form>
      <div className={styles.valiCode}>
        <Input size='large' placeholder='请输入验证码' />
        <Button
          className={styles.submit}
          onClick={() => {
            setStatus('reset')
          }}
        >
          提交
        </Button>
      </div>
      <Form hidden={status !== 'reset'} form={passwordForm} name='NewPassword' onFinish={() => {}}>
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
          <Link className={styles.login} to='/user/login'>
            使用已有账户登录
          </Link>
        </FormItem>
      </Form>
    </div>
  )
}
