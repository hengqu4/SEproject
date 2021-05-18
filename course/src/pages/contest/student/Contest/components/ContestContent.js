import React, { useState, useMemo, useEffect, useCallback } from 'react'
import MatchingStatus from '../matchingStatus'
import MatchQuestionsWrapper from '@/pages/contest/student/Contest/components/MatchQuestionsWrapper'
import ContestDescription from '@/pages/contest/components/ContestDescrption'
import { Button, Spin, notification } from 'antd'
import { connect } from 'umi'
import { useLocalStorage, useMount, useUnmount } from 'react-use'
import { START_SIGNAL_CACHING_TIME } from '@/pages/contest/student/Contest/constant'
import useStateRef from '../hooks/useStateRef'

const mapStateToProps = ({ Contest, user, Course }) => ({
  courseId: Course.currentCourseInfo.courseId,
  userId: user.currentUser.id,
  currentContest: Contest.currentContest,
  participating: Contest.participating,
  participated: Contest.participated,
  status: Contest.matchingStatus,
})

const ContestContent = ({
  userId,
  courseId,
  status = MatchingStatus.IDLE,
  currentContest = {},
  participating = false,
  participated = false,
  dispatch = () => {},
  onStartMatching = () => {},
  onReconnect = () => {},
}) => {
  const [loading, setLoading] = useState(false)
  const [disabledTime, setDisabledTime] = useState(-1)
  const [timer, setTimer] = useStateRef(null)

  const [startTime, setStartTime, removeStartTime] = useLocalStorage(
    `startTime: ${userId}.${currentContest.contestId}`,
    0,
  )

  const enableTime = useMemo(() => parseInt(startTime, 10) + START_SIGNAL_CACHING_TIME, [startTime])

  useMount(() => {
    setTimer(
      setInterval(() => {
        const currentTime = Date.now()
        if (!participating && !participated && currentTime < enableTime) {
          setDisabledTime(parseInt((enableTime - currentTime) / 1000, 10))
        } else {
          clearInterval(timer)
          removeStartTime()
        }
      }, 1000),
    )
  })

  useUnmount(() => clearInterval(timer))

  useEffect(() => {
    setLoading(true)
    dispatch({
      type: 'Contest/fetchCurrentContest',
      isTeacher: false,
      payload: {
        courseId,
        userId,
      },
      onError: (err) => {
        notification.error({
          message: '获取比赛信息失败',
          description: err.message,
        })
      },
      onFinish: setLoading.bind(this, false),
    })
  }, [dispatch, courseId, userId])

  const currentContestValid = useMemo(() => Object.keys(currentContest).length !== 0, [
    currentContest,
  ])

  const contestDescriptionDom = useMemo(() => {
    if (loading) return null

    return currentContestValid ? (
      <ContestDescription contest={currentContest} />
    ) : (
      <h1 style={{ textAlign: 'center', fontSize: 40, margin: 40 }}>当前没有比赛</h1>
    )
  }, [loading, currentContestValid, currentContest])

  const onStart = useCallback(() => {
    setStartTime(Date.now())
    onStartMatching && onStartMatching()
  }, [onStartMatching, setStartTime])

  const btnDom = useMemo(() => {
    if (loading || !currentContestValid) return null

    const btnAttrs = {
      block: true,
      type: 'primary',
    }

    let btnText = ''

    if (participating) {
      btnText = '您正在参加一场对抗，点击继续'
      btnAttrs.onClick = onReconnect
    } else if (participated) {
      btnText = '您已参加过该比赛'
      btnAttrs.disabled = true
    } else if (disabledTime > 0) {
      btnText = `请等待${disabledTime}秒后重新匹配`
      btnAttrs.disabled = true
    } else {
      btnText = '开始匹配'
      btnAttrs.onClick = onStart
    }

    return (
      <div style={{ margin: '20px 0' }}>
        <Button {...btnAttrs}>{btnText}</Button>
      </div>
    )
  }, [
    loading,
    currentContestValid,
    participated,
    participating,
    onStart,
    onReconnect,
    disabledTime,
  ])

  const contentDom = useMemo(() => {
    if (status === MatchingStatus.ANSWERING) {
      return <MatchQuestionsWrapper />
    }

    return (
      <div>
        {contestDescriptionDom}
        {btnDom}
      </div>
    )
  }, [status, btnDom, contestDescriptionDom])

  return (
    <>
      <Spin spinning={loading} />
      {contentDom}
    </>
  )
}

export default React.memo(connect(mapStateToProps)(ContestContent))
