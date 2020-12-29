import React, { useMemo } from 'react'
import { Descriptions, List, Button } from 'antd'
import formatTime from '@/utils/formatTime'
import classes from '@/pages/contest/components/style.less'

const ContestDescription = ({ contest = {}, onShowQuestionDetail = () => {} }) => {
  const questionsDom = useMemo(() => {
    if (contest.questions) {
      return (
        <Descriptions.Item label='比赛题目'>
          <div className={classes.QuestionList}>
            <List
              dataSource={contest.questions}
              renderItem={(question) => (
                <List.Item
                  actions={[
                    <Button type='link' onClick={onShowQuestionDetail.bind(this, question)}>
                      详情
                    </Button>,
                  ]}
                >
                  <span>{question.questionContent}</span>
                </List.Item>
              )}
            />
          </div>
        </Descriptions.Item>
      )
    }

    return null
  }, [contest])

  return (
    <Descriptions
      bordered
      column={1}
      title={<div style={{ width: '100%', textAlign: 'center' }}>{contest.title || ''}</div>}
    >
      <Descriptions.Item label='开始时间'>{formatTime(contest.startTime)}</Descriptions.Item>
      <Descriptions.Item label='结束时间'>{formatTime(contest.endTime)}</Descriptions.Item>
      <Descriptions.Item label='比赛时长'>3分钟</Descriptions.Item>
      <Descriptions.Item label='出题范围'>{`前 ${contest.chapter || 0} 章节`}</Descriptions.Item>
      <Descriptions.Item label='人数限制'>{contest.participantNumber || 0}</Descriptions.Item>
      <Descriptions.Item label='比赛描述'>{contest.description || ''}</Descriptions.Item>
      {questionsDom}
    </Descriptions>
  )
}

export default ContestDescription
