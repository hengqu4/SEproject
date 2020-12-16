import React, { Component } from 'react'
import styles from './index.less'
import { Form, Input, Button, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { connect } from 'dva'

const namespace = 'login'

const mapStateToProps = (state) => {
  const _ = state[namespace]
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onFinish: (values) => {
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
            message: 'Please input your Username!',
          },
        ]}
      >
        <Input prefix={<UserOutlined className='site-form-item-icon' />} placeholder='Username' />
      </Form.Item>
      <Form.Item
        name='password'
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className='site-form-item-icon' />}
          type='password'
          placeholder='Password'
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name='remember' valuePropName='checked' noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <a className='login-form-forgot' href=''>
          Forgot password
        </a>
      </Form.Item>

      <Form.Item>
        <Button type='primary' htmlType='submit' className='login-form-button'>
          Log in
        </Button>
        Or <a href=''>register now!</a>
      </Form.Item>
    </Form>
  )
}

@connect(mapStateToProps, mapDispatchToProps)
class LoginForm extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div id='components-form-demo-normal-login'>
          <NormalLoginForm onFinish={this.props.onFinish} />
        </div>
      </div>
    )
  }
}

export default LoginForm
