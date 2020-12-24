import React, { Component } from 'react'
import { Form, Input, Button, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { connect } from 'dva'
import { Link } from 'umi'
import styles from './index.less'

const namespace = 'login'

const mapStateToProps = (state) => {
  const _ = state[namespace]
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onFinish: (values) => {
      // eslint-disable-next-line no-console
      console.log('Received values of form: ', values)
      dispatch({
        type: `${namespace}/login`,
        payload: { ...values },
      })
    },
  }
}

const NormalLoginForm = (props) => {
  return (
    <div className={styles.main}>
      <h3>登录</h3>
      <Form
        name='normal_login'
        className='login-form'
        initialValues={{
          remember: true,
        }}
        onFinish={props.onFinish}
      >
        <Form.Item
          name='user_id'
          rules={[
            {
              required: true,
              message: '请输入用户名！',
            },
          ]}
        >
          <Input
            size='large'
            placeholder='用户名'
            prefix={<UserOutlined className='site-form-item-icon' />}
          />
        </Form.Item>
        <Form.Item
          name='password'
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        >
          <Input
            size='large'
            placeholder='密码'
            prefix={<LockOutlined className='site-form-item-icon' />}
            type='password'
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name='remember' valuePropName='checked' noStyle>
            <Checkbox>记住我</Checkbox>
          </Form.Item>

          {/* <a className='login-form-forgot' href=''>
          Forgot password
        </a> */}
        </Form.Item>

        <Form.Item>
          <Button size='large' type='primary' htmlType='submit' className={styles.submit}>
            登录
          </Button>
          {/* Or{' '} */}
          <Link className={styles.login} to='/user/register'>
            现在就去注册！
          </Link>
        </Form.Item>
      </Form>
    </div>
  )
}

@connect(mapStateToProps, mapDispatchToProps)
class LoginForm extends Component {
  render() {
    return (
      <div>
        <div id='components-form-demo-normal-login'>
          <NormalLoginForm onFinish={this.props.onFinish} />
        </div>
      </div>
    )
  }
}

export default LoginForm
