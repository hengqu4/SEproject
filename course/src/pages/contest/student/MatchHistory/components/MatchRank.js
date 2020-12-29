import React from 'react'
import { Space, Avatar, Row, Col } from 'antd'

const MatchRank = ({ user = {}, rank = -1, score = 0 }) => {
  return (
    <Row gutter={8}>
      <Col span={6}>
        <Space>
          <Avatar size='large' src={user.avatar} />
          <h3>{user.name}</h3>
        </Space>
      </Col>
      <Col span={4}>
        <h3>{`得分： ${score}`}</h3>
      </Col>
      <Col span={4}>
        <h3>{`排名： ${rank}`}</h3>
      </Col>
    </Row>
  )
}

export default React.memo(MatchRank)
