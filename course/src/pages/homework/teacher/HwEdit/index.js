import React, { useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import {Input, Button, Form, Radio, Space} from 'antd'

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
          <Form.Item
            label="作业名称"
            rules={[
              {
                required: true,
                message: '请输入作业名称！',
              },
            ]}
          >
            <Input placeholder="" />
          </Form.Item>
          <Form.Item label="作业描述">
            <TextArea
              placeholder=""
              autoSize={{ minRows: 5, maxRows: 10 }}
            />
          </Form.Item>
          <Form.Item>
            <Button>取消</Button>
            <Button type="primary" htmlType='submit' style={{marginLeft: '15px'}}>提交</Button>
          </Form.Item>
        </Form>
      </div>
    </PageContainer>
  )
}

export default Bread