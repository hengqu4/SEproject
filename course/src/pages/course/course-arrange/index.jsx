/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { connect } from 'umi'
import ProTable from '@ant-design/pro-table'
import { Button, Divider, Popconfirm, Modal, Form, notification, Upload, message } from 'antd'
import { PlusOutlined, InboxOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-layout'
import axios from 'axios'
import { uploadStudentsOfCourseFile } from '@/services/course'

const FormItem = Form.Item
const { Dragger } = Upload
export default connect(({ Course }) => ({
  curCourseInfo: Course.currentCourseInfo,
  courseStudentMap: Course.courseStudentMap,
}))(({ curCourseInfo = {}, courseStudentMap = new Map(), dispatch = () => {} }) => {
  useEffect(() => {
    console.log('initial')
    dispatch({
      type: 'Course/fetchCourseStudentRelation',
    })
  }, [])
  const [importModalVis, setImportModalVis] = useState(false)
  const [form] = Form.useForm()
  const [file, setFile] = useState(null)
  const [uploadedFile, setUploadedFile] = useState()

  const columns = [
    {
      title: '学号',
      dataIndex: 'studentId',
      key: 'studentId',
    },
    {
      title: '姓名',
      key: 'realname',
      dataIndex: 'realname',
    },
    {
      title: '邮箱',
      key: 'email',
      dataIndex: 'email',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <>
          <Popconfirm
            title='确定从课程中移除学生？'
            onConfirm={() => {
              // removeCourseInfo(record.courseId)
            }}
            onCancel={() => {}}
            okText='确定'
            cancelText='取消'
          >
            <a href='#'>移除</a>
          </Popconfirm>
        </>
      ),
    },
  ]
  const fileValidator = () => {
    const promise = Promise
    if (file == null) {
      notification.error({
        message: '请先上传文件',
      })
      return promise.reject()
    }
    return promise.resolve()
  }
  const onFinish = () => {
    const fdata = new FormData()
    fdata.append('student-course-list-file', uploadedFile)
    console.log(fdata.get('student-course-list-file'))

    uploadStudentsOfCourseFile(fdata)
      .then(() => {
        notification.success({
          message: '导入成功!',
        })
      })
      .catch((err) => {
        notification.error({
          message: '导入失败',
          description: err.toString(),
        })
      })
  }
  return (
    <PageContainer>
      <ProTable
        rowKey='key'
        search={false}
        toolBarRender={() => [
          <Button
            key='primary'
            type='primary'
            onClick={() => {
              setImportModalVis(true)
              console.log(
                courseStudentMap.get(curCourseInfo.courseId)?.map((r, i) => ({
                  ...r,
                  key: i,
                  studentId: r.email.indexOf('tongji') !== -1 ? r.email.slice(0, 7) : '测试号',
                })),
              )
            }}
          >
            <PlusOutlined /> 导入
          </Button>,
        ]}
        headerTitle={
          <span>
            <span>{curCourseInfo.courseName}</span>
            <Divider type='vertical' />
            学生名单
          </span>
        }
        dataSource={courseStudentMap.get(curCourseInfo.courseId)?.map((r, i) => ({
          ...r,
          key: i,
          studentId: r.email.indexOf('tongji') !== -1 ? r.email.slice(0, 7) : '测试号',
        }))}
        columns={columns}
      />
      <Modal
        destroyOnClose
        title='导入学生信息'
        visible={importModalVis}
        onCancel={() => {
          setImportModalVis(false)
        }}
        footer={null}
      >
        <Form hideRequiredMark form={form} onFinish={onFinish}>
          <Form
            name='student_list_file'
            rules={[
              {
                validator: fileValidator,
              },
            ]}
          >
            <Dragger
              name='file'
              multiple={false}
              maxCount={1}
              data={(f) => setUploadedFile(f)}
              onChange={(info) => {
                const { status } = info.file
                if (status === 'removed') {
                  setFile(null)
                }
                if (status !== 'uploading') {
                  console.log(info.file)
                }
                if (status === 'done') {
                  message.success(`${info.file.name} 上传成功!`)
                } else if (status === 'error') {
                  message.error(`${info.file.name} 上传失败！`)
                }
              }}
            >
              <p className='ant-upload-drag-icon'>
                <InboxOutlined />
              </p>
              <p className='ant-upload-text'>点击或拖动文件至此处以上传</p>
            </Dragger>
          </Form>
          <FormItem>
            <Button type='primary' htmlType='submit'>
              确定上传
            </Button>
          </FormItem>
        </Form>
      </Modal>
    </PageContainer>
  )
})
