import React from 'react'
import { Badge, Avatar, List, Row, Col } from 'antd'
import classes from '@/pages/contest/student/MatchHistory/style.less'

const MatchRank = ({ user = 0, participants = [], score = 0 }) => {
  const sortedParticipants = participants.sort((pa, pb) => pa.rank - pb.rank)

  return (
    <List
      dataSource={sortedParticipants}
      header={<div style={{ fontSize: '16px' }}>排名</div>}
      size='large'
      renderItem={(item) => (
        <List.Item key={item.userId}>
          <Row gutter={16} style={{ width: '100%' }}>
            <Col xs={6} md={4} lg={2}>
              <div>
                <Badge count={item.rank}>
                  <Avatar size='large' src={item.avatar} />
                </Badge>
              </div>
            </Col>
            <Col xs={6} md={4} lg={2}>
              <div className={classes.MatchRankTextBlock}>{item.nickname}</div>
            </Col>
            {item.userId === user ? (
              <Col xs={6} md={4} lg={2}>
                <div className={classes.MatchRankTextBlock}>得分：{score}</div>
              </Col>
            ) : null}
          </Row>
        </List.Item>
      )}
    />
  )
}

export default React.memo(MatchRank)
