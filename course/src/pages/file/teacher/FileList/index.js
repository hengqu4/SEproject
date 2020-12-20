import React from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import {Input, Button, Table, Tag, Space} from 'antd';

const { Search } = Input;
const { Column } = Table;

const onSearch = value => console.log(value);

const columns = [
    {
        title: '文件名称',
        dataIndex: 'name',
        key: '1',
        render: (text, index) => {
          return <a>{text}</a>
        },
    },
    {
        title: '文件备注',
        dataIndex: 'note',
        key: '2',
        width: '30%',
    },
    {
        title: '文件大小',
        dataIndex: 'size',
        key: '3',
    },
    {
        title: '上传者',
        dataIndex: 'owner',
        key: '4',
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: '5',
    },
    {
        title: '操作',
        dataIndex: 'opr',
        key: '6',
        render: () => (
            <Space size="middle">
              <a>下载</a>
              <a>删除</a>
            </Space>
        ),
    },
];

const data = [
    {
      key: '1',
      name: '作业',
      note: '第一次',
      size: '1',
      owner: 'Dri',
      date: '2020.11.24',
    },
    {
      key: '2',
      name: '作业??????',
      note: '第一次作业发啦',
      size: '1',
      owner: 'Dri',
      date: '2020.11.24',
    },
    {
      key: '3',
      name: '作业',
      note: '发啦',
      size: '1',
      owner: 'Dri',
      date: '2020.11.24',
    },
    {
      key: '4',
      name: '作业',
      note: '第一次作业发啦',
      size: '1',
      owner: 'Dri',
      date: '2020.11.24',
    },
    {
      key: '5',
      name: '作业',
      note: '第一次作业发啦',
      size: '1',
      owner: 'Dri',
      date: '2020.11.24',
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
              <Button type="dashed" style={{width: '80%'}} onClick={() => window.location.href='http://localhost:8000/file/file-edit'}>
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
