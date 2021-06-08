import React, { useEffect, useRef, useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Input, Button, Table, Modal, Space, Upload, message, notification } from 'antd'
import formatTime from '@/utils/formatTime'
import {connect} from 'umi'
import { useMount } from 'react-use';
import onError from '@/utils/onError';
import ProTable from '@ant-design/pro-table';
import axios from 'axios';
import fileUrl from '@/utils/fileUrl';

const mapStateToProps = ({ file, Course, user }) => ({
  fileList: file.fileList,
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
  var fileName
  var binary

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

  const handleChange = event => {
    fileName = event.target.value
    // 因为这样获取到的 fileName 包含路径，所以要对fileName进行切割
    // "/" 和 "\" 都有可能
    var tempFileNameList = fileName.split("\\")
    var tempFileName = tempFileNameList.pop()
    tempFileNameList = tempFileName.split("/")
    tempFileName = tempFileNameList.pop()
    fileName = tempFileName

    const reader = new FileReader();
    var inputBox = document.getElementById("inputbox");
    reader.readAsArrayBuffer(inputBox.files[0]);
    reader.onload = function(){
      // 读取完成后，数据保存在对象的result属性中
      // console.log(this.result)
      binary = this.result
    }
  }

  const handleSubmit = event => {
    event.preventDefault();
    var firstResponse
    var putUrl
    axios.post(`http:///${fileUrl()}/api/v1/course-database/course-file-database/course/${courseId}`, {
        fileDisplayName: fileName,
        fileComment: "no comment",
        fileUploader: currentUser,
    })
      .then(res => {
        console.log(res);
        console.log(res.data);
        firstResponse = res.data
        putUrl = firstResponse.FILE_PUT_URL
        console.log(putUrl);
        axios({
          method: "put",
          url: putUrl,
          data: binary,
          headers: { "Content-Type": `application/octet-stream`, }
        })
          .then(
            ()=>{
              notification.success({
                message: "文件上传成功"
              })
              return getFileList()
            }

          )
      })
  }

  useMount(() => {
    if(courseId != -1){
      getFileList()
    }
    console.log(fileUrl())
  })
  
  useEffect(() => {
    getFileList()
  }, [courseId])

  const columns = [
    {
      title: '文件名称',
      dataIndex: 'name',
      width: '15%',
      render: (_, record) => {
        var addr=`http://${fileUrl()}/api/v1/course-database/course-file-database/course/${courseId}/${record.key}/file`
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

  return (
    <PageContainer>
      <ProTable
        headerTitle='文件列表'
        toolBarRender={() => [
          <form onSubmit={handleSubmit}>
            <input type="file" name="name" id="inputbox" onChange={handleChange} />
            <input type="submit"/>
          </form>
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