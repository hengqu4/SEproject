import React, { useState, useRef, useCallback } from 'react'
import { useMount } from 'react-use'
import ProCard from '@ant-design/pro-card'
import ProTable from '@ant-design/pro-table'
import { PlusOutlined } from '@ant-design/icons'
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout'
import { Button, message, Form, DatePicker, Input } from 'antd'
import CreateForm from './components/CreateForm'
import FormItem from 'antd/lib/form/FormItem'
import { connect } from 'umi'
import onError from '@/utils/onError'

const mapStateToProps = ({ Course }) => ({
  courseStudentList: Course.courseStudentList,
})

const course_student_list = ({ courseStudentList = [], dispatch = () => {} }) => {
  const [createModalVisible, handleModalVisible] = useState(false)
  const actionRef = useRef()
  const [row, setRow] = useState()
  const [selectedRowsState, setSelectedRows] = useState([])

  const columns = [
    {
      title: '绑定ID',
      dataIndex: 'courseStudentID',
      sorter: (a, b) => a.courseStudentID - b.courseStudentID,
    },
    {
      title: '课程ID',
      dataIndex: 'courseID',
      formItemProps: { rules: [{ required: true, message: '课程ID是必须项' }] },
      sorter: (a, b) => a.courseID - b.courseID,
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
    },
    {
      title: '学生ID',
      dataIndex: 'studentID',
      formItemProps: { rules: [{ required: true, message: '学生ID是必须项' }] },
      sorter: (a, b) => a.studentID - b.studentID,
    },
    {
      title: '学生姓名',
      dataIndex: 'studentName',
    },
    {
      title: '课程学分',
      dataIndex: 'courseCredit',
      sorter: (a, b) => a.courseCredit - b.courseCredit,
    },
    {
      title: '课程描述',
      dataIndex: 'courseDescription',
      ellipsis: true,
      formItemProps: { rules: [{ max: 50 }] },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={async() => {
              await removeCourseStudent(record.courseStudentID)
              message.success('删除课程绑定成功')
            }}
          >
            {' '}
            删除绑定{' '}
          </a>
        </>
      ),
    },
  ]

  useMount(() => {
    console.log('准备接受数据')
    dispatch({
      type: 'Course/getAllCourseStudent',
      onError,
    })
  })

  /**
   * 格式化课程绑定数据
   * @param courseStudentList
   */
  const FormatData = (courseStudentList) => {
    const formattedCourseStudentList = []
    for (let i = 0; i < courseStudentList.length; i++) {
      formattedCourseStudentList.push({
        key: i,
        courseStudentID: courseStudentList[i].courseStudentId,
        courseID: courseStudentList[i].courseId,
        studentID: courseStudentList[i].studentId,
        courseName: courseStudentList[i].courseName,
        studentName: courseStudentList[i].studentName,
        courseCredit: courseStudentList[i].courseCredit,
        courseDescription: courseStudentList[i].courseDescription,
      })
    }
    return formattedCourseStudentList
  }

  /**
   * 添加课程绑定信息
   * @param values
   */
  const addCourseStudentInfo = useCallback(
    (values) => {
      // console.log(values)
      dispatch({
        type: 'Course/createNewCourseStudent',
        payload: values,
        onError: () => {
          message.error('创建课程绑定失败')
        },
        onFinish: () => {
          message.success('创建课程绑定成功')
          console.log(courseStudentList)
        },
      })
    },
    [dispatch],
  )

  /**
   * 删除课程绑定信息
   * @param value
   */
  const removeCourseStudent = useCallback((value) => {
    dispatch({
      type: 'Course/deleteCourseStudent',
      payload: value,
      onError,
    })
  }, [dispatch])

  const handleRemove = (selectedRows) => {
    console.log(selectedRows)
    for (let i = 0; i < selectedRows.length; i++){
      dispatch({
        type: 'Course/deleteCourseStudent',
        payload: selectedRows[i].courseStudentID,
      })
    }
  }

  return (
    <PageContainer>
      <ProTable
        headerTitle='所有学生选课信息'
        actionRef={actionRef}
        rowKey='key'
        search={false}
        toolBarRender={() => [
          <Button key='primary' type='primary' onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        dataSource={FormatData(courseStudentList)}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState)
              setSelectedRows([])
              actionRef.current?.reloadAndRest?.()
              message.success('批量删除成功')
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}

      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProCard>
          <Form
            onFinish={async (values) => {
              // console.log(values)
              addCourseStudentInfo(values)
              handleModalVisible(false)
            }}
          >
            <FormItem label='课程ID' name='courseID' rules={[{ required: true }]}>
              <Input placeholder='请输入课程ID' />
            </FormItem>
            <FormItem label='学生ID' name='studentID' rules={[{ required: true }]}>
              <Input placeholder='请输入所要选课的学生ID' />
            </FormItem>
            <FormItem style={{ marginTop: 32 }}>
              <Button type='primary' htmlType='submit'>
                提交
              </Button>
            </FormItem>
          </Form>
        </ProCard>
      </CreateForm>
    </PageContainer>
  )
}

export default connect(mapStateToProps)(course_student_list)
