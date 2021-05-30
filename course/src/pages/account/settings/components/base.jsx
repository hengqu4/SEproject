import { UploadOutlined } from '@ant-design/icons'
import { Button, Input, Select, Upload, Form, message, InputNumber } from 'antd'
import { connect, FormattedMessage, formatMessage } from 'umi'
import React, { Component } from 'react'
import GeographicView from './GeographicView'
import PhoneView from './PhoneView'
import styles from './BaseView.less'
import FormItem from 'antd/lib/form/FormItem'

const checkPassword = (_, value, callback) => {
  if (value.length < 6) {
    callback('请输入密码！')
  }

  callback()
}

const { Option } = Select // 头像组件 方便以后独立，增加裁剪之类的功能

const AvatarView = ({ avatar }) => (
  <>
    <div className={styles.avatar_title}>头像</div>
    <div className={styles.avatar}>
      <img src={avatar} alt='avatar' />
    </div>
    <Upload showUploadList={false}>
      <div className={styles.button_view}>
        <Button>
          <UploadOutlined />
          更换头像
        </Button>
      </div>
    </Upload>
  </>
)

class BaseView extends Component {
  view = undefined

  getAvatarURL() {
    const { currentUser } = this.props

    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar
      }

      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
      return url
    }

    return ''
  }

  getViewDom = (ref) => {
    this.view = ref
  }

  handleFinish = () => {
    message.success('更新基本信息成功')
  }

  render() {
    const { currentUser } = this.props
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form
            layout='vertical'
            onFinish={this.handleFinish}
            initialValues={currentUser}
            hideRequiredMark
          >
            <FormItem
              name="id"
              label="用户ID"
            >
              <Input readOnly={true} />
            </FormItem>
            {/* <Form.Item
              name='email'
              label='邮箱'
              rules={[
                {
                  required: true,
                  message: '请输入您的邮箱!',
                },
              ]}
            >
              <Input />
            </Form.Item> */}
            <Form.Item
              name='name'
              label='真实姓名'
              rules={[
                {
                  required: true,
                  message: '请输入您的昵称!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            {/* <Form.Item
              name='password'
              label='新密码'
              rules={[
                {
                  validator: checkPassword,
                },
              ]}
            >
              <Input size='large' type='password' placeholder='至少6位密码，区分大小写' />
            </Form.Item>
            <Form.Item>
              <Button htmlType='submit' type='primary'>
                更新基本信息
              </Button>
            </Form.Item> */}
          </Form>
        </div>
        {/* <div className={styles.right}>
          <AvatarView avatar={this.getAvatarURL()} />
        </div> */}
      </div>
    )
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(BaseView)
