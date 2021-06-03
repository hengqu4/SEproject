import { notification } from 'antd'

const onError = (err) => {
  notification.error({
    description: err?.error?.message || '未知错误',
  })
}

export default onError
