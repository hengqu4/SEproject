import React, { useState } from 'react'
import { useMount } from 'react-use'
import { PageContainer } from '@ant-design/pro-layout'
import { notification, Spin, Row, Col } from 'antd'
import ProCard from '@ant-design/pro-card'
import ContestDescription from '@/pages/contest/components/ContestDescrption'
import { connect } from 'umi'

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
                {Object.keys(currentContest).length ? (
                  <ContestDescription contest={currentContest} />
                ) : (
                  <h1 style={{ textAlign: 'center', fontSize: 40, margin: 40 }}>当前没有比赛</h1>
                )}
              </Spin>
            </Col>
          </Row>
        </main>
      </ProCard>
    </PageContainer>
  )
}

export default connect(mapStateToProps)(Contest)
