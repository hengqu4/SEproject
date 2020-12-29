import React, { useRef, useState } from 'react'
import {connect} from 'umi'
import { PageContainer } from '@ant-design/pro-layout';
import {Button, Modal} from 'antd'
import {Link} from 'react-router-dom'
import { useMount } from 'react-use';
import onError from '@/utils/onError';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons'

const mapStateToProps = ({ lecture, Course }) => ({
  lecList: lecture.lecList,
  courseId: Course.currentCourseInfo.courseId,
})

const FormatData = (lecList) => {
  const formattedLecList = []
  for (let i = 0; i < lecList.length; i++) {
    formattedLecList.push({
      key: lecList[i].courseChapterId,
      title: lecList[i].courseChapterTitle,
      link: lecList[i].courseChapterMoocLink,
    })
  }
  return formattedLecList
}

const LecList = ({
  lecList = [],
  dispatch = () => { },
  courseId = courseId
}) => {
  const [loading, setLoading] = useState(true)
  const [id, setId ] = useState()
  const [ modalVisible, setModalVisible ] = useState(false)
  const ref = useRef()

  //获得当前章节信息列表
  const getLecList = () => {
    dispatch({
      type: 'lecture/fetchLecList',
      payload: {
        courseId,
      },
      onError,
      onFinish: setLoading.bind(this, false),
    })
  }

  //删除某章节信息
  const deleteLecInfo = () => {
    dispatch({
      type: 'lecture/deleteLecInfo',
      payload: {
        courseId, id,
      },
      onError,
      onFinish: setLoading.bind(this, false),
    })
  }

  useMount(() => {
    getLecList()
  })
  
  const columns = [
    {
      title: '章节名称',
      dataIndex: 'title',
      width: '20%',
      render: (text, index) => {
        return <a>{text}</a>
      },
    },
    {
      title: '章节链接',
      dataIndex: 'link',
      width: '60%',
      render: (text, index) => {
        return <a href={text}>{text}</a>
      },
    },
    {
      title: '操作',
      dataIndex: 'opr',
      width: '20%',
      // valueType: 'option',
      render: (_, record) => (
        <>
          <Link to={`/course/chap-edit/${record.key}`}>编辑</Link>
          <Button 
            type='link' 
            onClick={() => {
              setModalVisible(true)
              setId(record.key)
            }}
          >删除</Button>
        </>
      )
    }
  ]

  return (
    <PageContainer>
      <ProTable
        headerTitle='章节信息'
        toolBarRender={() => [
          <Button type='primary'>
            <Link to='/course/chap-add'>
              <PlusOutlined />添加
            </Link>
          </Button>,
        ]}
        // actionRef={ref}
        // search={false}
        dataSource={FormatData(lecList)}
        columns={columns}
      />
      <Modal 
        visible={modalVisible}
        title='提示'
        onOk={() => {
          setModalVisible(false)
          deleteLecInfo()
        }}
        onCancel={() => {
          setModalVisible(false)
        }}
      >
        <p>确认删除吗？</p>
      </Modal>
    </PageContainer>
  )
}

export default connect(mapStateToProps)(LecList)