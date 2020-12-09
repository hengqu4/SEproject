import React, { useState, useCallback, useMemo } from 'react'
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
  currentMatch: Contest.currentMatch,
  channelId: Contest.channelId,
  matchQuestionAnswers: Contest.matchQuestionAnswers,
})

const MatchQuestionsWrapper = ({
  currentMatch = {},
  channelId = null,
  matchQuestionAnswers = [],
  dispatch = () => {},
}) => {
  const [loading, setLoading] = useState(false)
  const [submitBtnActive, setSubmitBtnActive] = useState(false)

  const getQuestions = useCallback(() => {
    setLoading(true)

    // TODO: 获取userId
    const studentId = 1

    dispatch({
      type: 'Contest/fetchCurrentMatch',
      payload: {
        studentId,
        channelId,
      },
      onSuccess: setSubmitBtnActive.bind(this, true),
      onError,
      onFinish: setLoading.bind(this, false),
    })
  }, [channelId, dispatch])

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

    storage(`match${currentMatch.matchId}`, answersCopy)
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
              value={moment(currentMatch.timeStamp)}
              onFinish={handleTimeEnd}
            />
          </header>
          <Divider />
          <article>
            <MatchQuestions
              questions={currentMatch.questions}
              onUserAnsewrChange={onUserAnswerChange}
            />
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
