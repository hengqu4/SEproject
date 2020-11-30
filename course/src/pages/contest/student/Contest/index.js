import React, { useState } from 'react'
import { useMount } from 'react-use'
import { PageContainer } from '@ant-design/pro-layout'
import { notification, Spin, Descriptions, Row, Col } from 'antd'
import ProCard from '@ant-design/pro-card'
import { connect } from 'umi'
import moment from 'moment'

const mapStateToProps = ({ Contest }) => ({
  currentContest: Contest.currentContest,
})

const Contest = ({ currentContest = {}, dispatch = () => {} }) => {
  const [loading, setLoding] = useState(true)

  useMount(() => {
    dispatch({
      type: 'Contest/fetchCurrentContest',
      payload: {
        courseId: 1,
      },
      onError: (err) => {
        notification.error({
          message: '获取比赛信息失败',
          description: err.message,
        })
      },
      onFinish: setLoding.bind(this, false),
    })
  })

  return (
    <PageContainer>
      <ProCard>
        <main
          style={{
            minHeight: '100vh',
          }}
        >
          <Row justify='center'>
            <Col span={18} xs={24} sm={20} lg={16}>
              <Spin spinning={loading}>
                <Descriptions
                  column={1}
                  bordered
                  title={
                    <div style={{ width: '100%', textAlign: 'center' }}>
                      {currentContest.title || ''}
                    </div>
                  }
                  // bordered
                >
                  <Descriptions.Item label='开始时间'>
                    {moment(currentContest.startTime || Date.now()).format('YYYY-MM-DD HH:mm')}
                  </Descriptions.Item>
                  <Descriptions.Item label='结束时间'>
                    {moment(currentContest.endTime || Date.now()).format('YYYY-MM-DD HH:mm')}
                  </Descriptions.Item>
                  <Descriptions.Item label='人数限制'>
                    {currentContest.participantNumber || -1}
                  </Descriptions.Item>
                  <Descriptions.Item label='测试时长'>3 分钟</Descriptions.Item>
                  <Descriptions.Item label='描述信息'>
                    <span
                      style={{
                        maxWidth: '40vw',
                        flex: '0 0',
                      }}
                    >
                      {currentContest.description || ''}
                    </span>
                  </Descriptions.Item>
                </Descriptions>
              </Spin>
            </Col>
          </Row>
        </main>
      </ProCard>
    </PageContainer>
  )
}

export default connect(mapStateToProps)(Contest)
