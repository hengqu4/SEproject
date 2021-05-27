import React, { useRef, useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { Input, Button, Table, Modal, Space } from 'antd'
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
  const [homeworkId, setHomeworkId ] = useState(params.homeworkId)
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
      width: '60%',
    },
    {
      title: '操作',
      dataIndex: 'opr',
      width: '25%',
      render: (_, record) => (
        <>
          <Link to={`/homework/hw-list/hw-info/${record.key}`}>详情&nbsp;&nbsp;&nbsp;&nbsp;</Link>
          <Link to={`/homework/hw-list/hw-edit/${record.key}`}>编辑</Link>
          <Button
            type='link'
            onClick={() => {
              setModalVisible(true)
              setHomeworkId(record.key)
            }}
          >
            删除
          </Button>
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
