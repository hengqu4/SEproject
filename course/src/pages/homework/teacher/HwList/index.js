import React, { useRef, useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import {Input, Button, Table, Modal, Space} from 'antd'
import {connect} from 'umi'
import {Link} from 'react-router-dom'
import { useMount } from 'react-use';
import onError from '@/utils/onError';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons'

const mapStateToProps = ({ homework }) => ({
  hwList: homework.hwList,
})

const FormatData = (hwList) => {
  const formattedHwList = []
  for (let i = 0; i < hwList.length; i++) {
    formattedHwList.push({
      key: hwList[i].homeworkUuid,
      title: hwList[i].homeworkTitle,
      des: hwList[i].homeworkDescription,
      createTime: hwList[i].homeworkCreateTime,
      updateTime: hwList[i].homeworkUpdateTime,
      startTime: hwList[i].homeworkStartTime,
      endTime: hwList[i].homeworkEndTime,
      creator: hwList[i].homeworkCreatorId,
    })
  }
  return formattedHwList
}

const HwList = ({
  hwList = [],
  dispatch = () => {}
}) => {
  const [loading, setLoading] = useState(true)
  const [id, setId ] = useState()
  const [ modalVisible, setModalVisible ] = useState(false)
  const ref = useRef()

  //获得当前作业列表
  const getHwList = (courseId) => {
    dispatch({
      type: 'homework/fetchHwList',
      payload: {
        courseId,
      },
      onError,
      onFinish: setLoading.bind(this, false),
    })
  }

  //删除某作业
  const deleteHwInfo = (courseId) => {
    dispatch({
      type: 'homework/deleteHwInfo',
      payload: {
        courseId, id,
      },
      onError,
      onFinish: setLoading.bind(this, false),
    })
  }

  useMount(() => {
    getHwList(1)
  })
  
  const columns = [
    {
      title: '作业名称',
      dataIndex: 'title',
      // width: '20%',
      render: (text, index) => {
        return <a>{text}</a>
      },
    },
    {
      title: '作业内容',
      dataIndex: 'des',
      // width: '60%',
    },
    {
      title: '发布者',
      dataIndex: 'creator',
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
    },
    {
      title: '截止日期',
      dataIndex: 'endTime'
    },
    {
      title: '操作',
      dataIndex: 'opr',
      // width: '20%',
      render: (_, record) => (
        <>
          <Link to="/homework/hw-list/hw-info">详情</Link>
          <Link to="/homework/hw-list/hw-edit">编辑</Link>
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
        headerTitle='作业列表'
        toolBarRender={() => [
          <Button type='primary'>
            <Link to='/homework/hw-list/hw-edit'>
              <PlusOutlined />添加
            </Link>
          </Button>,
        ]}
        // actionRef={ref}
        // search={false}
        dataSource={FormatData(hwList)}
        columns={columns}
      />
      <Modal 
        visible={modalVisible}
        title='提示'
        onOk={() => {
          setModalVisible(false)
          deleteHwInfo(1)
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

export default connect(mapStateToProps)(HwList)