import React from 'react'
import { Modal } from 'antd'

const SubmitRemark = (props) => {
  const { modelVisible } = props
  const { handleOk, handleCancel } = props

  const ok = () => {
    handleOk()
  }
  return (
    <Modal title='发布成绩' visible={modelVisible} onOk={ok} onCancel={handleCancel}>
      <p>确定要进行成绩发布吗?</p>
    </Modal>
  )
}

export default SubmitRemark
