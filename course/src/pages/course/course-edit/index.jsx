import React from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { Button, Card, DatePicker, Input, Form, message, InputNumber, Select } from 'antd'
import { connect } from 'umi'
import UploadAvatar from './UploadAvatar'

const FormItem = Form.Item
const { RangePicker } = DatePicker
const { TextArea } = Input

const CourseEdit = ({ currentCourseInfo = {}, dispatch = () => {} }) => {
  const [form] = Form.useForm()
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 7,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 12,
      },
      md: {
        span: 10,
      },
    },
  }
  const submitFormLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 10,
        offset: 7,
      },
    },
  }

  const onFinish = (values) => {
    values.courseID = currentCourseId
    console.log('准备更新数据')
    // console.log(values)
    dispatch({
      type: 'Course/updateSomeCourse',
      payload: values,
      onFinish: () => {
        message.success('课程编辑成功')
      },
    })
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const currentCourseId = currentCourseInfo.courseId

  // console.log(currentCourseId)

  return (
    <PageContainer>
      <Card bordered={false}>
        <Form
          hideRequiredMark
          style={{ marginTop: 8 }}
          form={form}
          name='editCourse'
          initialValues={{ public: '1' }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <FormItem {...formItemLayout} label='课程ID' name='courseID'>
            <span>{currentCourseId}</span>
          </FormItem>
          {/*<FormItem {...formItemLayout} label='课程头像' name='courseAvatar'>
            <UploadAvatar />
          </FormItem>*/}
          <FormItem {...formItemLayout} label='课程名称' name='courseName'>
            <Input placeholder='请输入新的课程名称' />
          </FormItem>
          <FormItem {...formItemLayout} label='课程学分' name='courseCredit'>
            <Input placeholder='请输入新的课程学分' />
          </FormItem>
          <FormItem {...formItemLayout} label='课程学时' name='courseStudyTimeNeeded'>
            <Input placeholder='请输入新的课程学时' />
          </FormItem>
          <FormItem {...formItemLayout} label='课程类型' name='courseType'>
            <Select
              placeholder='请选择课程类型'
              options={[
                { value: '必修', label: '必修' },
                { value: '选修', label: '选修' },
              ]}
            />
          </FormItem>
          <FormItem {...formItemLayout} label='课程描述' name='courseDescription'>
            <TextArea
              style={{ minHeight: 32 }}
              placeholder='请输入新的课程描述(不超过50个字)'
              rows={4}
              maxLength={50}
            />
          </FormItem>
          <FormItem {...formItemLayout} label='课程起止时间' name='courseTime'>
            <RangePicker
              style={{ width: '100%' }}
              showTime
              format={'YYYY/MM/DD HH:mm'}
              placeholder={['开始时间', '结束时间']}
            />
          </FormItem>
          {/*
          <FormItem {...formItemLayout} label='理论课次数' name='lectureCount'>
            <InputNumber
              style={{ width: '70%' }}
              placeholder='请输入理论课次数'
              initialValues={0}
              min={0}
              max={60}
            />
          </FormItem>
          <FormItem {...formItemLayout} label='实验课次数' name='experimentCount'>
            <InputNumber
              style={{ width: '70%' }}
              placeholder='请输入实验课次数'
              initialValues={0}
              min={0}
              max={60}
            />
          </FormItem>
          <FormItem {...formItemLayout} label='作业次数' name='homeworkCount'>
            <InputNumber
              style={{ width: '70%' }}
              placeholder='请输入作业次数'
              initialValues={0}
              min={0}
              max={60}
            />
          </FormItem>
          <FormItem {...formItemLayout} label='对抗练习次数' name='contestCount'>
            <InputNumber
              style={{ width: '70%' }}
              placeholder='请输入对抗练习次数'
              initialValues={0}
              min={0}
              max={60}
            />
          </FormItem>
          */}
          <FormItem {...formItemLayout} label='课程分数是否公开' name='courseIsScorePublic'>
            <Select
              placeholder='请选择课程分数是否公开'
              options={[
                { value: true, label: '公开' },
                { value: false, label: '不公开' },
              ]}
            />
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type='primary' htmlType='submit'>
              提交
            </Button>
            <Button style={{ marginLeft: 16 }}>保存</Button>
          </FormItem>
        </Form>
      </Card>
    </PageContainer>
  )
}

export default connect(({ Course }) => ({ currentCourseInfo: Course.currentCourseInfo }))(
  CourseEdit,
)
