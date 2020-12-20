import React from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Form, Input, Button, } from 'antd';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const data = [
    {
      key: '1',
      title: '第一节',
      content: 'https://www.icourse163.org/course/TONGJI-284001',
    }
];

const Bread = () => {
  const onFinish = values => {
    console.log('Success:', values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
return (
    <PageContainer>
      <div
        style={{
          height: '100vh',
          background: '#fff',
        }}
      >
      <div style={{ paddingTop: '40px', margin:'40px'}}>
        <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="小节名称"
            name="tittle"
            rules={[{ required: true, message: 'Please input your tittle!' }]}
          >
                <Input placeholder={data.title}/>
          </Form.Item>
          <Form.Item
            label="小节链接"
            name="content"
            rules={[{ required: true, message: 'Please input your content!' }]}
          >
                <Input placeholder={data.content}/>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
        </div>
      </div>
    </PageContainer>
  )
}

export default Bread