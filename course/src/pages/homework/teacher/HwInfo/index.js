import React from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { Button, Tag } from 'antd'

const data = {
    key: '1',
    title: '第一次作业',
    content: '给妈妈洗脚并写一篇心得',
    date: '2020.11.24',
    owner: 'Dri',
  }

const MatchHistory = (props) => {
  return (
    <PageContainer>
      <div
        style={{
          height: '100vh',
          background: '#fff',
        }}
      >
        <div style={{width: '90%', margin: 'auto'}}>
          <h1 style={{paddingTop: '20px', fontSize: '20px', fontWeight: 'bold'}}>
            {data.title}
          </h1>
          <Tag color="blue">{data.date}</Tag>
          <Tag color="blue">{data.owner}</Tag>
          <Button size='small' style={{fontSize: '10px', color: '#019cea'}}>编辑</Button>
          {/* <a style={{fontSize: '10px'}}>编辑</a> */}
          <p style={{marginTop: '30px'}}>
            {data.content}
          </p>
        </div>
        
      </div>
    </PageContainer>
  )
}

export default MatchHistory
