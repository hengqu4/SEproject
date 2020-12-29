import React, { useRef, useState } from 'react'
import {connect} from 'umi'
import { PageContainer } from '@ant-design/pro-layout';
import {Button, Modal} from 'antd'
import {Link} from 'react-router-dom'
import { useMount } from 'react-use';
import onError from '@/utils/onError';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons'

const mapStateToProps = ({ lecture }) => ({
  lecList: lecture.lecList,
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
  dispatch = () => {}
}) => {
  const [loading, setLoading] = useState(true)
  const [id, setId ] = useState()
  const [ modalVisible, setModalVisible ] = useState(false)
  const ref = useRef()

  //获得当前小节信息列表
  const getLecList = (courseId) => {
    dispatch({
      type: 'lecture/fetchLecList',
      payload: {
        courseId,
      },
      onError,
      onFinish: setLoading.bind(this, false),
    })
  }

  //删除某小节信息
  const deleteLecInfo = (courseId) => {
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
    getLecList(1)
  })
  
  const columns = [
    {
      title: '小节名称',
      dataIndex: 'title',
      width: '20%',
      render: (text, index) => {
        return <a>{text}</a>
      },
    },
    {
      title: '小节链接',
      dataIndex: 'link',
      width: '60%',
      render: (text, index) => {
        return <a href={text} target="_blank">{text}</a>
      },
    },
    {
      title: '操作',
      dataIndex: 'opr',
      width: '20%',
      // valueType: 'option',
      render: (_, record) => (
        <>
          <Link to="/course/chap-edit">编辑</Link>
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
        headerTitle='小节信息'
        search={false}
        toolBarRender={() => [
          <Button type='primary'>
            <Link to='/course/chap-edit'>
              <PlusOutlined />添加
            </Link>
          </Button>,
        ]}
        dataSource={FormatData(lecList)}
        columns={columns}
      />
      <Modal 
        visible={modalVisible}
        title='提示'
        onOk={() => {
          setModalVisible(false)
          deleteLecInfo(1)
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