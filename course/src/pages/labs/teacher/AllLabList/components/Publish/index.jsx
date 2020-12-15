import React, { useState } from 'react'
import { Modal, DatePicker, Space } from 'antd'
import moment from 'moment'

const PublishMoal = (props) => {
  const { modelVisible } = props
  const { handleOk, handleCancel } = props
  const { RangePicker } = DatePicker
  const [okButtonDisable, setOkButtonDisable] = useState(true)
  const [timeValue, setTimeValue] = useState()

  const ok = () => {
    handleOk(timeValue)
    setOkButtonDisable(true)
  }

  const onRangePickFinished = (value) => {
    if (value[0] != null && value[1] != null) {
      setTimeValue(value)
      setOkButtonDisable(false)
    }
  }

  const disabledRangeDate = (current) => current < moment().startOf('day')

  return (
    <Modal
      title='发布实验'
      visible={modelVisible}
      onOk={ok}
      onCancel={handleCancel}
      okButtonProps={{ disabled: okButtonDisable }}
    >
      <p>请选择开始日期和截止日期</p>
      <Space direction='vertical' size={12}>
        <RangePicker
          showTime={{
            inputReadOnly: true,
          }}
          onOk={onRangePickFinished}
          disabledDate={disabledRangeDate}
        />
      </Space>
    </Modal>
  )
}

export default PublishMoal
