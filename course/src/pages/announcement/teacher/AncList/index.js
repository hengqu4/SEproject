import React from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import {Input, Button, Table, Tag, Space} from 'antd'
import { SearchOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Column } = Table;

const onSearch = value => console.log(value);

const columns = [
    {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: '内容',
        dataIndex: 'content',
        key: 'content',
    },
    {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: '发布者',
        dataIndex: 'owner',
        key: 'owner',
    },
    {
        title: '操作',
        dataIndex: 'opr',
        key: 'opr',
        render: () => (
            <Space size="middle">
              <a href='http://localhost:8000/announcement/anc-list/anc-info'>查看详情</a>
              <a>编辑</a>
              <a>删除</a>
            </Space>
        ),
    },
];

const data = [
    {
      key: '1',
      title: '作业',
      content: '第一次作业发啦',
      date: '2020.11.24',
      owner: 'Dri',
    },
    {
      key: '1',
      title: '作业',
      content: '第二次作业发啦',
      date: '2020.11.24',
      owner: 'Dri',
    },
    {
        key: '1',
        title: '作业',
        content: '第三次作业发啦',
        date: '2020.11.24',
        owner: 'Dri',
    },
    {
        key: '1',
        title: '作业',
        content: '第四次作业发啦',
        date: '2020.11.24',
        owner: 'Dri',
    },
    {
        key: '1',
        title: '作业',
        content: '第五次作业发啦',
        date: '2020.11.24',
        owner: 'Dri',
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
        <div style={{paddingTop: '20px', marginLeft: '126px', width: '30%'}}>
            <Search placeholder="" 
                    onSearch={onSearch} 
                    enterButton
                    block='false' />
              
        </div>
        <div style={{paddingTop: '20px', width: '100%', textAlign: 'center'}}>
          <Button type="dashed" style={{width: '80%'}} onClick={() => {window.location.href="http://localhost:8000/announcement/anc-list/anc-edit"}}>
             + 添加
          </Button>
        </div> 
        <div style={{width: '100%', textAlign: 'center'}}>
          <Table dataSource={data} columns={columns}
                 style={{width: '80%', margin: 'auto'}}>
          </Table>
        </div>
      </div>
    </PageContainer>
  )
}

export default Bread