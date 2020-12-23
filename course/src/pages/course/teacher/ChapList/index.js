import React from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import {Input, Button, Table, Space} from 'antd'

const { Column } = Table;

const data = [
    {
      key: '1',
      title: '第一节',
      content: 'https://www.icourse163.org/course/TONGJI-284001',
    },
    {
      key: '1',
      title: '第二节',
      content: 'https://www.icourse163.org/course/TONGJI-284001',
    },
    {
        key: '1',
        title: '第三节',
        content: 'https://www.icourse163.org/course/TONGJI-284001',
    },
    {
        key: '1',
        title: '第四节',
        content: 'https://www.icourse163.org/course/TONGJI-284001',
    },
    {
        key: '1',
        title: '第五节',
        content: 'https://www.icourse163.org/course/TONGJI-284001',
    },
];

const Bread = () => {
return (
    <PageContainer>
      <div
        style={{
          height: '100vh',
          background: '#fff',
        }}
      >
        <div style={{ width: '100%', textAlign: 'center', paddingTop: '40px' }}>
          <Table dataSource={data} style={{ width: '80%', margin: 'auto'}}>
            <Column title='小节名称' dataIndex='title' key='title' />
            <Column
            title= '小节链接'
            key='content'
            render={dataSource => (
              <Space size="middle">
                <a href={dataSource.content}>{dataSource.content}</a>
              </Space>
            )} />
            <Column
              title='操作'
              key='opr'
              render={() => (
                <a href='http://localhost:8000/course/ed-chap'>
                  编辑
                </a>
              )}
            />
          </Table>
        </div>
      </div>
    </PageContainer>
  )
}

export default Bread