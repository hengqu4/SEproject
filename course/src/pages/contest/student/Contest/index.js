import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { notification, Spin, Row, Col, Button } from 'antd'
import ProCard from '@ant-design/pro-card'
import ContestDescription from '@/pages/contest/components/ContestDescrption'
import { connect } from 'umi'
import ModalMatching from '@/pages/contest/student/Contest/components/ModalMatching'
import onError from '@/utils/onError'
import useMatchWebSocket from '@/pages/contest/student/Contest/hooks/useMatchWebSocket'
import MatchQuestionsWrapper from '@/pages/contest/student/Contest/components/MatchQuestionsWapper'
import MatchingStatus from './matchingStatus'

const mapStateToProps = ({ Contest, user, Course }) => ({
  courseId: Course.currentCourseInfo.courseId,
  currentUser: user.currentUser,
  currentContest: Contest.currentContest,
  participated: Contest.participated,
  participating: Contest.participating,
  channelId: Contest.channelId,
  status: Contest.matchingStatus,
  userIndex: Contest.userIndex,
})

const Contest = ({
  currentUser = {},
  currentContest = {},
  participating = false,
  participated = false,
  channelId = null,
  courseId,
  status,
  userIndex,
  dispatch = () => {},
}) => {
  const [loading, setLoading] = useState(false)
  const reconnectRef = useRef(false)

  const clearStatus = useCallback(() => {
    dispatch({
      type: 'Contest/setMatchingStatus',
      payload: MatchingStatus.IDLE,
    })
    dispatch({
      type: 'Contest/setChannelId',
    })
    dispatch({
      type: 'Contest/setReadyArr',
    })
    dispatch({
      type: 'Contest/setUserIndex',
    })
  }, [dispatch])

  useEffect(() => {
    setLoading(true)
    dispatch({
      type: 'Contest/fetchCurrentContest',
      isTeacher: false,
      payload: {
        courseId,
        userId: currentUser.id,
      },
      onError: (err) => {
        notification.error({
          message: '获取比赛信息失败',
          description: err.message,
        })
      },
      onFinish: setLoading.bind(this, false),
    })
  }, [dispatch, courseId, currentUser])

  const handleCancelMatching = useCallback(() => {
    if (channelId) {
      dispatch({
        type: 'Contest/cancelMatching',
        payload: {
          channelId,
          studentId: currentUser.id,
        },
        onError,
      })
    }
    clearStatus()
  }, [clearStatus, dispatch, channelId, currentUser])

  useMatchWebSocket({
    studentId: currentUser.id,
    channelId,
    dispatch,
    clearStatus,
    cancelMatching: handleCancelMatching,
    reconnect: reconnectRef,
    status,
    contestId: currentContest.contestId,
    userIndex,
  })

  const handleModalOpen = useCallback(() => {
    dispatch({
      type: 'Contest/setMatchingStatus',
      payload: MatchingStatus.SEARCHING_ROOM,
    })
    const studentId = currentUser.id
    const { contestId } = currentContest

    dispatch({
      type: 'Contest/startMatching',
      payload: {
        studentId,
        contestId,
      },
      onError: (err) => {
        onError(err)
        dispatch({
          type: 'Contest/setMatchingStatus',
          payload: MatchingStatus.IDLE,
        })
      },
    })
  }, [dispatch, currentContest, currentUser])

  const handleReconnect = useCallback(() => {
    reconnectRef.current = true

    const studentId = currentUser.id

    dispatch({
      type: 'Contest/fetchChannelId',
      payload: {
        studentId,
      },
      onError: (err) => {
        reconnectRef.current = false
        onError(err)
        dispatch({
          type: 'Contest/setMatchingStatus',
          payload: MatchingStatus.IDLE,
        })
      },
    })
  }, [dispatch, currentUser])

  const currentContestValid = useMemo(() => Object.keys(currentContest).length !== 0, [
    currentContest,
  ])

  const getContestDescriptionDom = useCallback(() => {
    if (loading) return null
    return currentContestValid ? (
      <ContestDescription contest={currentContest} />
    ) : (
      <h1 style={{ textAlign: 'center', fontSize: 40, margin: 40 }}>当前没有比赛</h1>
    )
  }, [loading, currentContestValid, currentContest])

  const getBtnDom = useCallback(() => {
    if (loading || !currentContestValid) return null

    const btnAttrs = {
      block: true,
      type: 'primary',
    }

    let btnText = ''

    if (participating) {
      btnText = '您正在参加一场对抗，点击继续'
      btnAttrs.onClick = handleReconnect
    } else if (participated) {
      btnText = '您已参加过该比赛'
      btnAttrs.disabled = true
    } else {
      btnText = '开始匹配'
      btnAttrs.onClick = handleModalOpen
    }

    return (
      <div style={{ margin: '20px 0' }}>
        <Button {...btnAttrs}>{btnText}</Button>
      </div>
    )
  }, [loading, currentContestValid, participated, participating, handleModalOpen, handleReconnect])

  const contentDom = useMemo(() => {
    if (status === MatchingStatus.ANSWERING) {
      return <MatchQuestionsWrapper />
    }

    return (
      <div>
        {getContestDescriptionDom()}
        {getBtnDom()}
      </div>
    )
  }, [getBtnDom, getContestDescriptionDom, status])

  return (
    <PageContainer title={false}>
      <ProCard>
        <Row justify='center'>
          <Col span={18} xs={24} sm={20} lg={16}>
            <Spin spinning={loading} />
            {contentDom}
          </Col>
        </Row>
        <ModalMatching onCancel={handleCancelMatching} />
      </ProCard>
    </PageContainer>
  )
}

export default React.memo(connect(mapStateToProps)(Contest))
