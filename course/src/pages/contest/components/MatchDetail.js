import React from 'react'
import ProCard from '@ant-design/pro-card'
import MatchRank from '@/pages/contest/components/MatchRank'
import MatchQuestions from '@/pages/contest/components/MatchQuestions'
import { Divider, Row, Col } from 'antd'

const MatchDetail = (props) => {
  const { title, participants, user, questions, extra = '', score } = props

  return (
    <ProCard title={title} extra={extra} headerBordered>
      <Row justify='center'>
        <Col span={18} xs={24} sm={20} lg={16}>
          <MatchRank participants={participants} user={user} score={score} />
          <Divider />
          <MatchQuestions questions={questions} score={score} />
        </Col>
      </Row>
    </ProCard>
  )
}

export default React.memo(MatchDetail)
