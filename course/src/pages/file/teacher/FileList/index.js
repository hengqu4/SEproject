import React, { useRef, useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Input, Button, Table, Modal, Space, Upload, message } from 'antd'
import formatTime from '@/utils/formatTime'
import {connect} from 'umi'
import { useMount } from 'react-use';
import onError from '@/utils/onError';
import ProTable from '@ant-design/pro-table';
import { UploadOutlined } from '@ant-design/icons'

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
  const [ modalVisible, setModalVisible ] = useState(false)
  const ref = useRef()
  const [fileInfo, setFileInfo] = useState({
    fileDisplayName: "test",
    fileComment: "test",
    fileUploader: currentUser,
  })

  //获得当前文件列表
  const getFileList = () => {
    dispatch({
      type: 'file/fetchFileList',
      payload: {
        courseId,
      },
      onError,
      onFinish: setLoading.bind(this, false),
    })
  }

  //删除某文件
  const deleteFile = () => {
    console.log(fileId)
    dispatch({
      type: 'file/deleteFile',
      payload: {
        courseId, fileId,
      },
      onError,
      onFinish: setLoading.bind(this, false),
    })
  }

  //上传某文件
  const addFile = () => {
    dispatch({
      type: 'file/addFile',
      payload: {
        courseId, fileInfo,
      }
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
    },
    {
      title: '操作',
      dataIndex: 'opr',
      width: '15%',
      render: (_, record) => (
        <>
          <Button 
            type='link' 
            onClick={() => {
              setModalVisible(true)
              setFileId(record.key)
            }}
            style={{padding: '0'}}
          >删除</Button>
        </>
      )
    }
  ]
  
  // const beforeUpload = async (file) => {
  //     fileInfo.fileDisplayName = file.name
  //     await addFile()
  // }

  //这里修改传给后端的数据，但我尝试的form-data转binary的方法都还不对，回宿舍了
  const transformFile = (file) => {
    // console.log(file)
    // let formData = new FormData()
    // formData.append('file', file)
    // console.log(formData)
    // return formData
  }

  const props = {
    action: url,
    method: 'PUT',
    maxCount: 1,
    showUploadList: false,
    onChange(info) {
      console.log('2nd url', url)
      console.log('status', info.file.status)
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        
        console.log(fileInfo.fileDisplayName)
        message.success(`${info.file.name} 上传成功！`);
      }
      else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败！`);
      }
    },
    // beforeUpload: beforeUpload
    beforeUpload(file) {
      fileInfo.fileDisplayName = file.name
    },
    transformFile,
  };

  return (
    <PageContainer>
      <ProTable
        headerTitle='文件列表'
        toolBarRender={() => [
          <Upload {...props}>
            {/* <Button icon={<UploadOutlined />}> */}
            <Button icon={<UploadOutlined />} onClick={() => { addFile() }}>
              上传文件
            </Button>
          </Upload>,
        ]}
        // actionRef={ref}
        search={false}
        dataSource={FormatData(fileList)}
        columns={columns}
      />
      <Modal 
        visible={modalVisible}
        title='提示'
        onOk={() => {
          setModalVisible(false)
          deleteFile()
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

export default connect(mapStateToProps)(FileList)