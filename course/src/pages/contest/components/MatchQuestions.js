import React from 'react'
import { List, Divider } from 'antd'
import Question from '@/pages/contest/components/Question'
import classes from '@/pages/contest/components/style.less'

const MatchQuestions = ({ questions = [], score, onUserAnsewrChange }) => {
  const footer =
    score != null ? (
      <React.Fragment>
        <Divider />
        <div className={classes.MatchScoreBlock}>总分：{score}</div>
      </React.Fragment>
    ) : null

  return (
    <>
      <List
        dataSource={questions}
        size='large'
        renderItem={(question) => (
          <List.Item key={`${question.questionId}+${question.questionType}`}>
            <Question question={question} onChange={onUserAnsewrChange} />
          </List.Item>
        )}
      />
      {footer}
    </>
  )
}

export default React.memo(MatchQuestions)
