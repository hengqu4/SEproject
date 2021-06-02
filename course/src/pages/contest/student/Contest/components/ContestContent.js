import React, { useState, useMemo, useEffect } from 'react'
import MatchQuestionsWrapper from '@/pages/contest/student/Contest/components/MatchQuestionsWrapper'
import ContestDescription from '@/pages/contest/components/ContestDescrption'
import { Button, Spin, notification } from 'antd'
import { connect } from 'umi'
import { START_SIGNAL_CACHING_TIME, MatchingStatus } from '@/utils/constant'
import store from 'store2'

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

  const storageString = useMemo(() => `startTime:${userId}.${currentContest.contestId}`, [
    userId,
    currentContest.contestId,
  ])
  const startTime = store(storageString) || 0

  const enableTime = useMemo(() => (startTime ?? 0) + START_SIGNAL_CACHING_TIME, [startTime])

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = Date.now()
      if (!participating && !participated && currentTime < enableTime) {
        setDisabledTime(parseInt((enableTime - currentTime) / 1000, 10))
      } else {
        clearInterval(timer)
        store.remove(storageString)
        // forceUpdate
        setDisabledTime(-1)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [enableTime, participated, participating, storageString])

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

  const btnDom = useMemo(() => {
    if (loading || !currentContestValid) return null

    const btnAttrs = {
      block: true,
      type: 'primary',
      disabled: true,
    }

    let btnText = ''

    if (participating) {
      btnText = '您正在参加一场对抗，点击继续'
      btnAttrs.onClick = onReconnect
      btnAttrs.disabled = false
    } else if (participated) {
      btnText = '您已参加过该比赛'
    } else if (disabledTime > 0) {
      btnText = `请等待${disabledTime}秒后重新匹配`
    } else if (Date.now() < enableTime) {
      btnText = '请等待'
    } else {
      btnText = '开始匹配'
      btnAttrs.disabled = false
      btnAttrs.onClick = onStartMatching
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
    onStartMatching,
    onReconnect,
    enableTime,
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
