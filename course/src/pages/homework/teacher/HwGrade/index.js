import React, { useRef, useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { InputNumber, Button, Table, Modal, Space } from 'antd'
import formatTime from '@/utils/formatTime'
import { connect, useParams } from 'umi'
import { Link } from 'react-router-dom'
import { useMount } from 'react-use'
import onError from '@/utils/onError'
import ProTable from '@ant-design/pro-table'
import { PlusOutlined } from '@ant-design/icons'

const mapStateToProps = ({ homework, Course }) => ({
  hwFileList: homework.hwFileList,
  courseId: Course.currentCourseInfo.courseId,
})

const FormatData = (hwFileList) => {
  const formattedHwFileList = []
  for (let i = 0; i < hwFileList.length; i++) {
    formattedHwFileList.push({
      key: hwFileList[i].fileHomeworkId,
      title: hwFileList[i].fileDisplayName,
      name: hwFileList[i].fileUploader,
    })
  }
  return formattedHwFileList
}

const HwGrade = ({ hwFileList = [], dispatch = () => { }, courseId = courseId }) => {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [homeworkId, setHomeworkId] = useState(params.homeworkId)
  const [grade, setGrade] = useState()
  const ref = useRef()

  // 获得当前作业列表
  const getHwFileList = () => {
    dispatch({
      type: 'homework/fetchHwFileList',
      payload: {
        courseId, homeworkId,
      },
      onError,
      onFinish: setLoading.bind(this, false),
    })
  }

  const getGrade = (homeworkFileId) => {
    dispatch({
      type: 'homework/fetchGrade',
      payload: {
        courseId, homeworkId, homeworkFileId,
      }
    })
  }

  const onChange = (value, key) => {
    const data = {
      courseId: courseId.toString(),
      homeworkId: homeworkId,
      homeworkScore: value,
    }
    var homeworkFileId = key
    dispatch({
      type: 'homework/addGrade',
      payload: {
        courseId, homeworkId, homeworkFileId, data,
      },
      onError,
      onFinish: setLoading.bind(this, false),
    })
  }

  useMount(() => {
    getHwFileList()
  })

  const columns = [
    {
      title: '学生名称',
      dataIndex: 'name',
      width: '15%',
      render: (text, index) => {
        return <a>{text}</a>
      },
    },
    {
      title: '作业文件',
      dataIndex: 'title',
      width: '55%',
      render: (_, record) => {
        var addr='http://localhost/api/v1/lecture/course-homework/' + courseId + '/homework/' + homeworkId + '/file/' + record.key
        return <a href={addr}
        >{record.title}</a>
      },
    },
    {
      title: '分数',
      dataIndex: 'grade',
      width: '15%',
      render: (_, record) => {
        return <p>{getGrade(record.key)}</p>
      },
    },
    {
      title: '评分',
      dataIndex: 'opr',
      width: '15%',
      render: (_, record) => (
        <>
          <InputNumber
            min={0} defaultValue={0} onChange={value => onChange(value, record.key)} />
        </>
      ),
    },
  ]

  return (
    <PageContainer>
      <ProTable
        headerTitle='作业文件列表'
        // actionRef={ref}
        search={false}
        dataSource={FormatData(hwFileList)}
        columns={columns}
      />
    </PageContainer>
  )
}

export default connect(mapStateToProps)(HwGrade)
