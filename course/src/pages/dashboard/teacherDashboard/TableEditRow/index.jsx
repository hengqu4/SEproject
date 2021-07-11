import styles from './index.less'
import React, { useState, useEffect } from 'react'
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd'
import { connect } from 'umi'
import { useMount } from 'react-use'

const originData = []

for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
  })
}

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

const EditableTable = (props) => {
  const [form] = Form.useForm()
  const [data, setData] = useState(originData)
  const [editingKey, setEditingKey] = useState('')

  const isEditing = (record) => record.key === editingKey

  const edit = (record) => {
    form.setFieldsValue({ ...record })
    setEditingKey(record.key)
  }

  const cancel = () => {
    setEditingKey('')
  }

  const save = async (key) => {
    const { dispatch, Course } = props
    const row = await form.validateFields()
    console.log(key, row)
    dispatch({
      type: 'teacherDashboard/setBonus',
      payload: {
        courseId: Course.currentCourseInfo.courseId,
        studentId: key,
        bonus_point: row['bonusPoint'],
      },
      callback: () => {
        let studentMap = Course.courseStudentMap
        dispatch({
          type: 'teacherDashboard/getGrade',
          payload: {
            courseId: Course.currentCourseInfo.courseId,
            studentMap: studentMap.get(Course.currentCourseInfo.courseId),
          },
        })
        setEditingKey('')
      },
    })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'studentId',
      width: '8%',
      editable: false,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: '8%',
      editable: false,
    },
    {
      title: '学号',
      dataIndex: 'm_id',
      width: '8%',
      editable: false,
    },
    {
      title: '总分',
      dataIndex: 'totalPoint',
      width: '8%',
      editable: false,
    },
    {
      title: '作业',
      dataIndex: 'assignmentPoint',
      width: '8%',
      editable: false,
    },
    {
      title: '期中',
      dataIndex: 'exam1Point',
      width: '8%',
      editable: false,
    },
    {
      title: '期末',
      dataIndex: 'exam2Point',
      width: '8%',
      editable: false,
    },
    {
      title: '实验',
      dataIndex: 'experimentPoint',
      width: '8%',
      editable: false,
    },
    {
      title: '对抗',
      dataIndex: 'contestPoint',
      width: '8%',
      editable: false,
    },
    {
      title: '出勤',
      dataIndex: 'attendancePoint',
      width: '8%',
      editable: false,
    },
    {
      title: '加分',
      dataIndex: 'bonusPoint',
      width: '8%',
      editable: true,
    },
    {
      title: '操作',
      width: '12%',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <a
              href='javascript:;'
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              存储
            </a>
            <Popconfirm title='确定取消?' onConfirm={cancel}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <a disabled={editingKey !== ''} onClick={() => edit(record)}>
            编辑
          </a>
        )
      },
    },
  ]
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'name' ? 'text' : 'number',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  useMount(() => {
    const { dispatch, Course } = props
    let studentMap = Course.courseStudentMap
    if (Course.courseStudentMap.size === 0)
      dispatch({
        type: 'Course/fetchCourseStudentRelation',
        callback: (res) => {
          studentMap = res
          dispatch({
            type: 'teacherDashboard/getGrade',
            payload: { courseId: Course.currentCourseInfo.courseId, studentMap },
          })
        },
      })
    else
      dispatch({
        type: 'teacherDashboard/getGrade',
        payload: {
          courseId: Course.currentCourseInfo.courseId,
          studentMap: studentMap.get(Course.currentCourseInfo.courseId),
        },
      })
  })

  // TODO: wait for backend bug fix
  // useEffect(() => {
  //   const { dispatch, Course } = props
  //   let studentMap = Course.courseStudentMap
  //   if (studentMap.size === 0) return
  //   console.log(props.Course.currentCourseInfo)
  //   dispatch({
  //     type: 'teacherDashboard/getGrade',
  //     payload: {
  //       courseId: Course.currentCourseInfo.courseId,
  //       studentMap: studentMap.get(Course.currentCourseInfo.courseId),
  //     },
  //   })
  // }, [props.Course.currentCourseInfo])

  return (
    <div className={styles.container}>
      <div id='components-table-demo-edit-row'>
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={props.teacherDashboard.gradeData}
            columns={mergedColumns}
            rowClassName='editable-row'
            pagination={{
              onChange: cancel,
            }}
          />
        </Form>
      </div>
    </div>
  )
}

export default connect(({ Course, user, teacherDashboard }) => ({
  Course,
  user,
  teacherDashboard,
}))(EditableTable)
