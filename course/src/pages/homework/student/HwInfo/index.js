import React from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { Button, Tag } from 'antd'

const data = {
  key: '1',
  title: '第一次作业',
  content: '给妈妈洗脚并写一篇心得',
  date: '2020.11.24',
  owner: 'Dris toolman',
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
          {/*学生页面应该没有编辑，先注释掉了 */}
          {/*<Button size='small' style={{fontSize: '10px', color: '#019cea'}}>编辑</Button>*/}
          {/* <a style={{fontSize: '10px'}}>编辑</a> */}
          <div >
            <p style={{marginTop: '30px' , float:'left'}}>
              {data.content}
            </p>
            <div style={{float:'right', width:'25%', padding:'30px', borderLeftStyle:'solid',borderLeftColor:'#f0f2f5'}}>
              请在截止时间前提交您的作业！
              <Button
              type='primary'
              style={{marginTop:'20px', float:'right'}}
              >
                上传文件
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default MatchHistory
