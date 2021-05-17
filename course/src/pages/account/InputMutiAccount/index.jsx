import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Upload, message, Card, Button } from 'antd';
import styles from './index.less';
import { InboxOutlined } from '@ant-design/icons';
import { useModel } from 'umi'
import testState from '@/models/course'

const { Dragger } = Upload

const InputMutiAccount = () => {

  
  const props = {
    name: 'file',
    multiple: false,
    action: (file, _) => onUpload(file),
    maxCount: 1,
    width: 300,
    onChange(info){
      const {status} = info.file
      if (status !== 'uploading'){
        console.log(info.file)
      }
      if(status === 'done'){
        message.success(`${info.file.name} 上传成功!`)
      }else if (status === 'error'){
        message.error(`${info.file.name} 上传失败！`)
      }
    }
  }

  const uploadFile = (payload) =>{
  }

  const onClicked = () => {
    //TODO: modify upload request
    // console.log(file)
    console.log(testState.state.currentCourseInfo.courseId)

  }

  const onUpload = (data) => {
    setFile(data)
  }
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const test = useModel("Course");
  useEffect(() => {
    setTimeout(() => {
      setLoading(false); 
    }, 3000);
  }, []);
  return (
    <PageContainer content="导入多个学生数据" className={styles.main}>
      <div
        style={{
          paddingTop: 100,
          textAlign: 'center',
        }}
      >
        <Card>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined/>
          </p>
          <p className="ant-upload-text">
            点击或拖动文件至此处以上传
          </p>
        </Dragger>
      </Card>
      <Card>
      <Button
          type = "primary"
          onClick = {() => onClicked()}
        >
          确定上传
        </Button>
      </Card>
      </div>
    </PageContainer>
  );
};

export default InputMutiAccount