import React, { useRef, useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Input, Button, Table, Modal, Space, Upload, message } from 'antd'
import formatTime from '@/utils/formatTime'
import {connect} from 'umi'
import {Link} from 'react-router-dom'
import { useMount } from 'react-use';
import onError from '@/utils/onError';
import ProTable from '@ant-design/pro-table';

const mapStateToProps = ({ file, Course, user }) => ({
  fileList: file.fileList,
  url: file.url,
  courseId: Course.currentCourseInfo.courseId,
  currentUser: user.currentUser.name,
})

const FormatData = (fileList) => {
  const formattedFileList = []
  for (let i = 0; i < fileList.length; i++) {
    formattedFileList.push({
      key: fileList[i].fileCourseDocumentId,
      name: fileList[i].fileDisplayName,
      com: fileList[i].fileComment,
      createTime: formatTime(fileList[i].fileCreateTimestamp),
      updateTime: formatTime(fileList[i].fileUpdateTimestamp),
      creator: fileList[i].fileUploader,
    })
  }
  return formattedFileList
}

const FileList = ({
  fileList = [],
  dispatch = () => { },
  courseId = courseId,
  url = '',
  currentUser = currentUser
}) => {
  const [loading, setLoading] = useState(true)
  const [fileId, setFileId ] = useState()
  const ref = useRef()
  const [fileInfo, setFileInfo] = useState({
    fileDisplayName: "test",
    fileComment: "test",
    fileUploader: currentUser,
  })

  //获得当前文件列表
  const getFileList = () => {
    console.log('test')
    dispatch({
      type: 'file/fetchFileList',
      payload: {
        courseId,
      },
      onError,
      onFinish: setLoading.bind(this, false),
    })
  }

  useMount(() => {
    getFileList()
  })
  
  const columns = [
    {
      title: '文件名称',
      dataIndex: 'name',
      width: '15%',
      render: (_, record) => {
        var addr='http://localhost:8000/api/v1/course-database/course-file-database/course/' + courseId + '/' + record.key + '/file'
        return <a href={addr}
        >{record.name}</a>
      },
    },
    {
      title: '上传者',
      dataIndex: 'creator',
      width: '10%',
    },
    {
      title: '上传日期',
      dataIndex: 'createTime',
      width: '15%',
    }
  ]

  return (
    <PageContainer>
      <ProTable
        headerTitle='文件列表'
        toolBarRender={() => [
        ]}
        // actionRef={ref}
        search={false}
        dataSource={FormatData(fileList)}
        columns={columns}
      />
    </PageContainer>
  )
}

export default connect(mapStateToProps)(FileList)