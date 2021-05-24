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
  courseTeachList: Course.courseTeachList,
})

const CourseBind = ({ courseTeachList = [], dispatch = () => {} }) => {
  const [createModalVisible, handleModalVisible] = useState(false)
  const actionRef = useRef()
  const [row, setRow] = useState()
  const [selectedRowsState, setSelectedRows] = useState([])
  /**
   * 添加课程绑定信息
   * @param values
   */
  const addCourseTeachInfo = useCallback(
    (values) => {
      // console.log(values)
      dispatch({
        type: 'Course/createNewCourseTeach',
        payload: values,
        errorHandler: (e) => {
          if (e.status === 400) {
            message.error('创建课程绑定失败,重复绑定或不存在的课程id！')
          } else if (e.status === 404) {
            message.error('创建课程绑定失败,不存在的教师id')
          }
        },
        successHandler: () => {
          message.success('创建课程绑定成功')
        },
      })
    },
    [dispatch],
  )
  /**
   * 删除课程绑定信息
   * @param value
   */
  const removeCourseTeach = useCallback(
    (value) => {
      dispatch({
        type: 'Course/deleteCourseTeach',
        payload: value,
        onError,
      })
    },
    [dispatch],
  )
  const columns = [
    {
      title: '绑定ID',
      dataIndex: 'courseTeachId',
      sorter: (a, b) => a.courseTeachId - b.courseTeachId,
    },
    {
      title: '课程ID',
      dataIndex: 'courseId',
      formItemProps: { rules: [{ required: true, message: '课程ID是必须项' }] },
      sorter: (a, b) => a.courseId - b.courseId,
    },
    {
      title: '教师ID',
      dataIndex: 'teacherId',
      formItemProps: { rules: [{ required: true, message: '教师ID是必须项' }] },
      sorter: (a, b) => a.teacherId - b.teacherId,
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
    },
    {
      title: '课程学分',
      dataIndex: 'courseCredit',
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
            onClick={() => {
              removeCourseTeach(record.courseTeachId)
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
      type: 'Course/getAllCourseTeach',
      onError,
    })
  })

  const handleRemove = (selectedRows) => {
    console.log(selectedRows)
    for (let i = 0; i < selectedRows.length; i++) {
      dispatch({
        type: 'Course/deleteCourseTeach',
        payload: selectedRows[i].courseTeachId,
      })
    }
  }

  return (
    <PageContainer>
      <ProTable
        headerTitle='所有课程绑定信息'
        actionRef={actionRef}
        rowKey='key'
        search={false}
        toolBarRender={() => [
          <Button key='primary' type='primary' onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        dataSource={courseTeachList.map((t, i) => ({ ...t, key: i }))}
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
            onClick={() => {
              handleRemove(selectedRowsState)
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
            onFinish={(values) => {
              addCourseTeachInfo(values)
              handleModalVisible(false)
            }}
          >
            <FormItem label='课程ID' name='courseId' rules={[{ required: true }]}>
              <Input placeholder='请输入课程ID' />
            </FormItem>
            <FormItem label='教师ID' name='teacherId' rules={[{ required: true }]}>
              <Input placeholder='请输入想要与之绑定的教师ID' />
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

export default connect(mapStateToProps)(CourseBind)
