import { notification } from 'antd'

const onError = (err) => {
  notification.error({
    description: err.message,
  })
}

export default onError
