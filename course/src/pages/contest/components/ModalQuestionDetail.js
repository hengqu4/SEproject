import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Modal, Form, Input, Radio, Checkbox, message } from 'antd'

const options = ['A', 'B', 'C', 'D']

const transformValues = (values) => {
  const res = { ...values }
  res.questionChapter = +res.questionChapter

  if (res.questionType === 1) {
    res.questionAnswer = res.questionAnswer.join('')
  }

  return res
}

const defaultQuestionDetail = {
  questionContent: null,
  questionAnswer: null,
  questionType: 0,
  questionChapter: null,
  questionChoiceAContent: null,
  questionChoiceBContent: null,
  questionChoiceCContent: null,
  questionChoiceDContent: null,
}

const ModalQuestionDetail = ({ mode = 'readonly', question = {}, ...restProps }, ref) => {
  const [visible, setVisible] = useState(false)
  const [okBtnLoading, setOkBtnLoading] = useState(false)
  const [questionType, setQuestionType] = useState(0)

  const [form] = Form.useForm()

  const open = () => {
    setVisible(true)
  }

  useEffect(() => {
    if (mode === 'edit' || mode === 'readonly') {
      setQuestionType(question.questionType)
      form.setFieldsValue(question)
    } else if (mode === 'create') {
      setQuestionType(0)
      form.setFieldsValue(defaultQuestionDetail)
    }
  }, [mode, form, question])

  React.useImperativeHandle(ref, () => ({ open }))

  const closeModal = useCallback(() => {
    setOkBtnLoading(false)
    setVisible(false)
  }, [])

  const onOk = useCallback(async () => {
    setOkBtnLoading(true)
    try {
      const values = await form.validateFields()
      restProps.onOk && restProps.onOk(transformValues(values), closeModal)
    } catch (err) {
      err.errorFields && message.error('请正确输入表单项')
      setOkBtnLoading(false)
    }
  }, [restProps, form, closeModal])

  const onCancel = useCallback(() => {
    setVisible(false)
  }, [])

  const handleQuestionDetailChange = useCallback(
    (changedValues, values) => {
      if ('questionType' in changedValues) {
        setQuestionType(changedValues.questionType)

        if (values.questionType === 0) {
          form.setFields([{ name: 'questionAnswer', value: null }])
        } else {
          form.setFields([{ name: 'questionAnswer', value: [] }])
        }
      }
    },
    [form],
  )

  const title = useMemo(() => {
    switch (mode) {
      case 'readonly':
        return '查看题目详情'
      case 'edit':
        return '编辑题目'
      case 'create':
        return '新增题目'
    }

    return ''
  }, [mode])

  const disabled = mode === 'readonly'

  let questionAnswerDom = null

  if (questionType === 1) {
    questionAnswerDom = (
      <Checkbox.Group disabled={disabled}>
        {options.map((op) => (
          <Checkbox key={op} value={op}>
            {op}
          </Checkbox>
        ))}
      </Checkbox.Group>
    )
  } else {
    questionAnswerDom = (
      <Radio.Group disabled={disabled}>
        {options.map((op) => (
          <Radio key={op} value={op}>
            {op}
          </Radio>
        ))}
      </Radio.Group>
    )
  }

  const choiceContentsDom = options.map((op) => (
    <Form.Item
      key={op}
      label={`选项 ${op}`}
      name={`questionChoice${op}Content`}
      rules={[
        {
          required: true,
          message: '请输入选项内容',
        },
      ]}
    >
      <Input.TextArea rows={2} placeholder={`请输入选项 ${op} 内容`} disabled={disabled} />
    </Form.Item>
  ))

  return (
    <Modal
      width={800}
      visible={visible}
      title={title}
      okText='确认'
      cancelText='取消'
      okButtonProps={{ loading: okBtnLoading }}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        form={form}
        onValuesChange={handleQuestionDetailChange}
      >
        <Form.Item
          label='题目内容'
          name='questionContent'
          rules={[
            {
              required: 'true',
              message: '请填写题目内容',
            },
          ]}
        >
          <Input.TextArea disabled={disabled} rows={4} placeholder='请填写题目内容' />
        </Form.Item>
        <Form.Item
          label='题目类型'
          name='questionType'
          rules={[
            {
              required: 'true',
              message: '请选择题目类型',
            },
          ]}
        >
          <Radio.Group disabled={disabled || mode === 'edit'}>
            <Radio value={0}>单选</Radio>
            <Radio value={1}>多选</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label='所属章节'
          name='questionChapter'
          rules={[
            {
              required: 'true',
              message: '请输入题目章节',
            },
          ]}
        >
          <Input type='number' placeholder='请输入题目章节' disabled={disabled} />
        </Form.Item>
        {choiceContentsDom}
        <Form.Item
          label='题目答案'
          name='questionAnswer'
          rules={[
            {
              required: true,
              message: '请选择',
            },
          ]}
        >
          {questionAnswerDom}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(React.forwardRef(ModalQuestionDetail))
