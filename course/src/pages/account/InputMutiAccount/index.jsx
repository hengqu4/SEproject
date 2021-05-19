import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Upload, message, Card, Button, Form, notification } from 'antd';
import styles from './index.less';
import { InboxOutlined } from '@ant-design/icons';
import { connect } from 'umi'
import axios from 'axios';


const FormItem = Form.Item
const { Dragger } = Upload

const InputMutiAccount = ({ dispatch = () => {} }) => {

  const props = {
    name: 'file',
    multiple: false,
    action: (file, _) => onUpload(file),
    maxCount: 1,
    data:(file)=>{
      setUploadedFile(file)
    },
    onChange(info){
      const {status} = info.file
      if(status == 'removed'){
        setFile(null)
      }
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

  const fileValidator = () =>{
    const promise = Promise
    if(file == null){
      notification.error({
        message: '请先上传文件',
      })
      return promise.reject()
    }
    return promise.resolve()
  }

  const onUpload = (file) => {
    setFile(file)
  }
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState()
  useEffect(() => {
    setTimeout(() => {
      setLoading(false); 
    }, 3000);
  }, []);

  const onFinish = () =>{
    var fdata = new FormData()
    fdata.append('student-list-file', uploadedFile)
    console.log(fdata.get('student-list-file'))
    axios({
      method: 'POST',
      url: 'http://localhost:8000/api/v1/user/upload-students/',
      data: fdata,
      headers:{
        "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>"
      },
    })
    .then(() => {
      notification.success({
        message: '导入成功!',
      })
    })
    .catch((err) => {
      notification.error({
        message: '导入失败',
        description: err.toString(),
      })
    })
  }

  return (
    <PageContainer content="导入多个学生数据" className={styles.main}>
      <div
        style={{
          paddingTop: 100,
          textAlign: 'center',
        }}
      >
        <Card>
          <Form
            hideRequiredMark
            form={form}
            onFinish={onFinish}
          >
            <FormItem
              name="student_list_file"
              rules={[
                {
                  validator: fileValidator,
                },
              ]}
            >
              <Dragger
                {...props}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined/>
                </p>
                <p className="ant-upload-text">
                  点击或拖动文件至此处以上传
                </p>
              </Dragger>
            </FormItem>
            <FormItem>
              <Button
                type = "primary"
                htmlType="submit"
              >
                确定上传
              </Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    </PageContainer>
  );
};

export default connect()(InputMutiAccount)