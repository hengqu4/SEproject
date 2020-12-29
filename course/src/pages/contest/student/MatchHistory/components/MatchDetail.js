import React from 'react'
import ProCard from '@ant-design/pro-card'
import MatchRank from '@/pages/contest/student/MatchHistory/components/MatchRank'
import MatchQuestions from '@/pages/contest/components/MatchQuestions'
import { Divider, Row, Col } from 'antd'
import { pick } from 'lodash'

const MatchDetail = (props) => {
  const { title, questions, extra = '', score } = props

  return (
    <ProCard title={title} extra={extra} headerBordered>
      <Row justify='center'>
        <Col span={18} xs={24} sm={20} lg={16}>
          <MatchRank {...pick(props, ['rank', 'score', 'user'])} />
          <Divider />
          <MatchQuestions questions={questions} score={score} />
        </Col>
      </Row>
    </ProCard>
  )
}

export default React.memo(MatchDetail)
