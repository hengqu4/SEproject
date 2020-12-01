import React, { useMemo } from 'react'
import { Descriptions, List } from 'antd'
import moment from 'moment'
import classes from './style.less'

const ContestDescription = ({ questions = [], newContest = {}, ...restProps }) => {
  const newContestQuestions = useMemo(
    () =>
      newContest.questions.map((questionId) => questions.find((q) => q.questionId === questionId)),
    [questions, newContest],
  )

  return (
    <Descriptions
      bordered
      column={1}
      title={<div style={{ width: '100%', textAlign: 'center' }}>{newContest.title || ''}</div>}
    >
      <Descriptions.Item label='开始时间'>
        {moment(newContest.starTime || Date.now()).format('YYYY-MM-DD HH:mm')}
      </Descriptions.Item>
      <Descriptions.Item label='结束时间'>
        {moment(newContest.endTime || Date.now()).format('YYYY-MM-DD HH:mm')}
      </Descriptions.Item>
      <Descriptions.Item label='比赛时长'>3分钟</Descriptions.Item>
      <Descriptions.Item label='出题范围'>{`前 ${newContest.chapter} 章节`}</Descriptions.Item>
      <Descriptions.Item label='人数限制'>{newContest.participantNumber}</Descriptions.Item>
      <Descriptions.Item label='比赛描述'>{newContest.description}</Descriptions.Item>
      <Descriptions.Item label='比赛题目'>
        <div className={classes.QuestionList}>
          <List
            dataSource={newContestQuestions}
            renderItem={(question) => (
              <List.Item>
                <div className={classes.QuestionListItem}>
                  <span className={classes.QuestionContent}>{question.questionContent}</span>
                  <span>{question.questionType ? '多选' : '单选'}</span>
                </div>
              </List.Item>
            )}
          />
        </div>
      </Descriptions.Item>
    </Descriptions>
  )
}

export default ContestDescription
