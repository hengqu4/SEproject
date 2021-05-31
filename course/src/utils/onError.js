import { notification } from 'antd'

const onError = (err) => {
  notification.error({
    description: err.error.message,
  })
}

export default onError
