import React, { useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import {Input, Button, Form, Modal, Space} from 'antd'

const { TextArea } = Input;

const Bread = () => {
return (
    <PageContainer>
      <div
        style={{
          height: '100vh',
          background: '#fff',
        }}
      >
        <Form style={{paddingTop: '20px', paddingLeft: '126px', width: '70%'}}
        >
          <Form.Item label="文件名称"
          >
            <Input placeholder="" />
          </Form.Item>
          <Form.Item label="文件备注">
            <Input placeholder="" />
          </Form.Item>
          <Button type="dashed" style={{width: '80%'}}>
                上传
          </Button>
          <Form.Item>
            <Button>取消</Button>
            <Button type="primary" style={{marginLeft: '15px'}}>提交</Button>
          </Form.Item>
        </Form>
      </div>
    </PageContainer>
  )
}

export default Bread