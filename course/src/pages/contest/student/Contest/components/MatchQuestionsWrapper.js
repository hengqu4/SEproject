import React, { useState, useCallback, useMemo } from 'react'
import { connect } from 'umi'
import MatchQuestions from '@/pages/contest/components/MatchQuestions'
import { Spin, Statistic, Button, Popconfirm, Divider, message, Modal } from 'antd'
import onError from '@/utils/onError'
import cloneDeep from 'lodash/cloneDeep'
import storage from 'store2'
import moment from 'moment'

const { Countdown } = Statistic

const mapStateToProps = ({ Contest, user }) => ({
  currentUser: user.currentUser,
  currentContest: Contest.currentContest,
  matchQuestions: Contest.matchQuestions,
  matchTimeStamp: Contest.matchTimeStamp,
  matchQuestionAnswers: Contest.matchQuestionAnswers,
  channelId: Contest.channelId,
})

const MatchQuestionsWrapper = ({
  currentUser: { id: studentId = -1 } = {},
  currentContest = {},
  matchQuestions = [],
  matchTimeStamp = -1,
  matchQuestionAnswers = [],
  channelId = -1,
  dispatch = () => {},
}) => {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const onUserAnswerChange = (questionId, questionType, newAnswer) => {
    const answersCopy = cloneDeep(matchQuestionAnswers)

    const answerObj = answersCopy.find(
      (a) => a.questionId === questionId && a.questionType === questionType,
    )

    if (answerObj) {
      answerObj.answer = newAnswer
      dispatch({
        type: 'Contest/setMatchQuestionAnswers',
        payload: answersCopy,
      })
    }

    storage(`contest${currentContest.contestId}`, answersCopy)
  }

  const clearMatchStatus = useCallback(() => {
    setLoading(false)
    setVisible(false)
    dispatch({
      type: 'Contest/clearMatchStatus',
    })
  }, [dispatch])

  const handleTimeEnd = () => {
    setVisible(true)
    dispatch({
      type: 'Contest/submitMatchAnswers',
      payload: {
        studentId,
        channelId,
        answers: matchQuestionAnswers,
      },
      onError: (err) => {
        setSubmitError(err)
      },
      onFinish: () => {
        setSubmitted(true)
      },
    })
  }

  const handleSubmit = () => {
    setLoading(true)
    dispatch({
      type: 'Contest/submitMatchAnswers',
      payload: {
        studentId,
        channelId,
        answers: matchQuestionAnswers,
      },
      onError,
      onSuccess: () => {
        message.info('已提交答案')
      },
      onFinish: () => {
        setLoading(false)
        clearMatchStatus()
      },
    })
  }

  const modalContent = useMemo(() => {
    if (submitted) {
      if (submitError) {
        return '提交失败'
      }
      return '提交成功'
    }
    return '正在提交'
  }, [submitted, submitError])

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
          <main>
            <MatchQuestions questions={matchQuestions} onUserAnswerChange={onUserAnswerChange} />
          </main>
          <Divider />
          <footer style={{ textAlign: 'center' }}>
            <Popconfirm title='确认提交？' onConfirm={handleSubmit}>
              <Button type='primary'>提交答案</Button>
            </Popconfirm>
          </footer>
          <Modal
            visible={visible}
            title={null}
            destroyOnClose
            closable={false}
            footer={
              submitted ? (
                <Button type='primary' onClick={clearMatchStatus}>
                  确认
                </Button>
              ) : null
            }
          >
            {modalContent}
          </Modal>
        </>
      )}
    </>
  )
}

export default React.memo(connect(mapStateToProps)(MatchQuestionsWrapper))
