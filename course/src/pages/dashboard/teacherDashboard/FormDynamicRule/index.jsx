import styles from './index.less'
import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Checkbox } from 'antd'
import { connect } from 'umi'
import { useMount } from 'react-use'
import onError from '@/utils/onError'

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 8,
  },
}
const formTailLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 8,
    offset: 4,
  },
}

const DynamicRule = (props) => {
  const [form] = Form.useForm()
  const { Course } = props

  const onCheck = async () => {
    const { dispatch } = props
    try {
      const values = await form.validateFields()
      console.log('Success:', values)
      dispatch({
        type: 'teacherDashboard/updateWeight',
        payload: { courseId: Course.currentCourseInfo.courseId, form: values },
        callback: () => {
          dispatch({
            type: 'teacherDashboard/fetch',
            payload: { courseId: Course.currentCourseInfo.courseId },
            onError,
            callback: (res) => {
              console.log(res)
              form.setFieldsValue(res)
            },
          })
        },
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  useMount(() => {
    const { dispatch, Course } = props
    dispatch({
      type: 'teacherDashboard/fetch',
      payload: { courseId: Course.currentCourseInfo.courseId },
      onError,
      callback: (res) => {
        console.log(res)
        form.setFieldsValue(res)
      },
    })
  })

  return (
    <div className={styles.container}>
      <div id='components-form-demo-dynamic-rule'>
        <Form form={form} name='dynamic_rule'>
          <Form.Item
            {...formItemLayout}
            label='作业成绩权重'
            name='assignment'
            rules={[
              {
                required: true,
                message: '请输入作业成绩权重',
              },
            ]}
          >
            <Input placeholder='请输入作业成绩权重' />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='考勤成绩权重'
            name='attendance'
            rules={[
              {
                required: true,
                message: '请输入考勤成绩权重',
              },
            ]}
          >
            <Input placeholder='请输入考勤成绩权重' />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='对抗实验权重'
            name='contest'
            rules={[
              {
                required: true,
                message: '请输入对抗实验权重',
              },
            ]}
          >
            <Input placeholder='请输入对抗实验权重' />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='期中考试权重'
            name='exam1'
            rules={[
              {
                required: true,
                message: '请输入期中考试权重',
              },
            ]}
          >
            <Input placeholder='请输入期中考试权重' />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='期末考试权重'
            name='exam2'
            rules={[
              {
                required: true,
                message: '请输入期末考试权重',
              },
            ]}
          >
            <Input placeholder='请输入期末考试权重' />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='实验成绩权重'
            name='experiment'
            rules={[
              {
                required: true,
                message: '请输入实验成绩权重',
              },
            ]}
          >
            <Input placeholder='请输入实验成绩权重' />
          </Form.Item>
          <Form.Item {...formTailLayout}>
            <Button type='primary' onClick={onCheck}>
              更新权重
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default connect(({ Course, user, teacherDashboard }) => ({
  Course,
  user,
  teacherDashboard,
}))(DynamicRule)
