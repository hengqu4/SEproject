import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Upload, message, Card, Button, Form, notification } from 'antd';
import styles from './index.less';
import { InboxOutlined } from '@ant-design/icons';
import { connect } from 'umi'


const FormItem = Form.Item
const { Dragger } = Upload

const InputMutiAccount = ({ dispatch = () => {} }) => {

  const props = {
    name: 'file',
    multiple: false,
    action: (file, _) => onUpload(file),
    maxCount: 1,
    // customRequest: (option) => {
    //   dispatch({
    //     type:'account/uploadAccount',
    //     payload: {
    //       "student-list-file":option.file,
    //     },
    //     onError:(err)=>{
    //       notification.error({
    //         message: '导入失败',
    //         description: err.message,
    //       })
    //     },
    //     onSuccess: ()=>{
    //       notification.success({
    //         message: '导入成功',
    //       })
    //     }
    //   })
    // },
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
  useEffect(() => {
    setTimeout(() => {
      setLoading(false); 
    }, 3000);
  }, []);

  //FIXME : FormData.append(key, value) is unavailable
  const onFinish = (values) =>{
    var fileList = values.student_list_file.fileList
    // console.log("files:")
    // console.log(values.student_list_file.file)
    // console.log(fileList)
    var fdata = new FormData()
    fdata.set("student-list-file", fileList[0])
    fdata.forEach(v => console.log(v))
    console.log("wzj", fileList[0])
    dispatch({
      type:'account/uploadAccount',
      payload: fdata,
      onError:(err)=>{
        notification.error({
          message: '导入失败',
          description: err.message,
        })
      },
      onSuccess: ()=>{
        notification.success({
          message: '导入成功',
        })
      }
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