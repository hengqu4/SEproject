import React from 'react'
import ProCard from '@ant-design/pro-card'
import MatchRank from '@/pages/contest/components/MatchRank'
import MatchQuestions from '@/pages/contest/components/MatchQuestions'
import { Divider } from 'antd'

const MatchDetail = (props) => {
  const { title, participants, user, questions, extra = '', score } = props

  return (
    <ProCard title={title} extra={extra} headerBordered>
      <MatchRank participants={participants} user={user} score={score} />
      <Divider />
      <MatchQuestions questions={questions} score={score} />
    </ProCard>
  )
}

export default React.memo(MatchDetail)
