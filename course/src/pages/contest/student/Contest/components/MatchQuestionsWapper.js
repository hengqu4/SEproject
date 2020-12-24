import React, { useState, useCallback } from 'react'
import { connect } from 'umi'
import MatchQuestions from '@/pages/contest/components/MatchQuestions'
import { useMount } from 'react-use'
import { Spin, Statistic, Button, Popconfirm, Divider } from 'antd'
import onError from '@/utils/onError'
import cloneDeep from 'lodash/cloneDeep'
import storage from 'store2'
import moment from 'moment'

const { Countdown } = Statistic

const mapStateToProps = ({ Contest }) => ({
  currentContest: Contest.currentContest,
  matchQuestions: Contest.matchQuestions,
  matchId: Contest.matchId,
  matchTimeStamp: Contest.matchTimeStamp,
  matchQuestionAnswers: Contest.matchQuestionAnswers,
})

const MatchQuestionsWrapper = ({
  currentContest = {},
  matchQuestions = [],
  matchId = -1,
  matchTimeStamp = -1,
  matchQuestionAnswers = [],
  dispatch = () => {},
}) => {
  const [loading, setLoading] = useState(false)
  const [submitBtnActive, setSubmitBtnActive] = useState(false)

  const getQuestions = useCallback(() => {
    setLoading(true)

    // TODO: 获取userId
    const studentId = 1
    const { contestId } = currentContest

    console.log('currentContest: ', currentContest)

    dispatch({
      type: 'Contest/connectToMatch',
      payload: {
        studentId,
        contestId,
      },
      onSuccess: setSubmitBtnActive.bind(this, true),
      onError,
      onFinish: setLoading.bind(this, false),
    })
  }, [currentContest, dispatch])

  const onUserAnswerChange = (questionId, newAnswer) => {
    const answersCopy = cloneDeep(matchQuestionAnswers)

    const answerObj = answersCopy.find((a) => a.questionId === questionId)

    if (answerObj) {
      answerObj.answer = Array.isArray(newAnswer) ? newAnswer.join('') : newAnswer
      dispatch({
        type: 'Contest/setMatchQuestionAnswers',
        payload: answersCopy,
      })
    }

    storage(`match${matchId}`, answersCopy)
  }

  useMount(() => {
    getQuestions()
  })

  const handleTimeEnd = () => {}

  const handleSubmit = () => {}

  return (
    <>
      {loading ? (
        <Spin />
      ) : (
        <>
          <header style={{ textAlign: 'right' }}>
            <Countdown
              title='倒计时'
              value={moment(matchTimeStamp).add(3, 'minutes')}
              onFinish={handleTimeEnd}
            />
          </header>
          <Divider />
          <article>
            <MatchQuestions questions={matchQuestions} onUserAnsewrChange={onUserAnswerChange} />
          </article>
          <Divider />
          <footer style={{ textAlign: 'center' }}>
            <Popconfirm title='确认提交？' onConfirm={handleSubmit}>
              <Button type='primary' disabled={!submitBtnActive}>
                提交答案
              </Button>
            </Popconfirm>
          </footer>
        </>
      )}
    </>
  )
}

export default React.memo(connect(mapStateToProps)(MatchQuestionsWrapper))
