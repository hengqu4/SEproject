import React, { useMemo } from 'react'
import { Form, Input, Button, DatePicker, InputNumber } from 'antd'
import moment from 'moment'

const { RangePicker } = DatePicker

const disableDate = (currDate) => {
  return currDate && currDate < moment().endOf('day')
}

const ContestBasicInfo = ({ onNextStep = () => {}, contest, ...restProps }, ref) => {
  const [form] = Form.useForm(null)

  React.useImperativeHandle(ref, () => ({
    validateFileds: form.validateFields,
    setFieldsValue: form.setFieldsValue,
  }))

  const defaultValues = useMemo(() => {
    const res = { ...contest }
    if (contest.startTime && contest.endTime) {
      res.time = [moment(contest.startTime), moment(contest.endTime)]
    }
    return res
  }, [contest])

  return (
    <article>
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        initialValues={defaultValues}
      >
        <Form.Item
          name='title'
          label='比赛名称'
          rules={[
            {
              required: true,
              message: '请填写比赛名称',
            },
          ]}
        >
          <Input placeholder='请填写比赛名称' />
        </Form.Item>
        <Form.Item
          name='participantNumber'
          label='参赛人数'
          rules={[
            {
              required: true,
              message: '请填写参赛人数',
            },
          ]}
        >
          <InputNumber style={{ width: '100%' }} min={1} placeholder='请填写参赛人数' />
        </Form.Item>
        <Form.Item
          name='chapter'
          label='比赛章节'
          rules={[
            {
              required: true,
              message: '请填写比赛章节',
            },
          ]}
        >
          <InputNumber style={{ width: '100%' }} min={1} placeholder='请填写比赛章节' />
        </Form.Item>
        <Form.Item
          name='time'
          label='时间'
          rules={[
            {
              required: true,
              message: '请选择开始时间及结束时间',
            },
          ]}
        >
          <RangePicker
            style={{ width: '100%' }}
            placeholder={['开始时间', '截至时间']}
            disabledDate={disableDate}
            showTime={{
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
            }}
          />
        </Form.Item>
        <Form.Item name='description' label='比赛描述'>
          <Input.TextArea placeholder='请输入比赛描述' />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
          <Button type='primary' onClick={onNextStep}>
            下一步
          </Button>
        </Form.Item>
      </Form>
    </article>
  )
}

export default React.memo(React.forwardRef(ContestBasicInfo))
