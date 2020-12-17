import React from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { Button, Tag } from 'antd'

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
            作业
          </h1>
          <Tag color="blue">2020.11.24</Tag>
          <Tag color="blue">Dri</Tag>
          <Button size='small' style={{fontSize: '10px', color: '#019cea'}}>编辑</Button>
          {/* <a style={{fontSize: '10px'}}>编辑</a> */}
          <p style={{marginTop: '30px'}}>
          第一次作业发啦
          </p>
        </div>
        
      </div>
    </PageContainer>
  )
}

export default MatchHistory
