import React, { useCallback, useRef, useState } from 'react'
import {connect} from 'umi'
import { PageContainer } from '@ant-design/pro-layout';
import {Input, Button, Modal, Space} from 'antd'
import { useMount } from 'react-use';
import onError from '@/utils/onError';
import ProTable from '@ant-design/pro-table';

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
      render: (text, index) => {
        return <a>{text}</a>
      },
    },
    {
      title: '小节链接',
      dataIndex: 'link',
      render: (text, index) => {
        return <a href={text}>{text}</a>
      },
    },
    {
      title: '操作',
      dataIndex: 'opr',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Button type='link'>编辑</Button>
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
        // actionRef={ref}
        // search={false}
        dataSource={FormatData(lecList)}
        columns={columns}
      />
      <Modal 
        visible={modalVisible}
        title='确认删除'
        onOk={() => {
          setModalVisible(false)
          deleteLecInfo(1)
          
        }}
        onCancel={() => {
          setModalVisible(false)
        }}
      />
    </PageContainer>
  )
}

export default connect(mapStateToProps)(LecList)