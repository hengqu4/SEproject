import React, { useCallback, useMemo } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { Row, Col, notification } from 'antd'
import ProCard from '@ant-design/pro-card'
import { connect } from 'umi'
import ModalMatching from '@/pages/contest/student/Contest/components/ModalMatching'
import onError from '@/utils/onError'
import MatchingStatus from './matchingStatus'
import ContestContent from '@/pages/contest/student/Contest/components/ContestContent'
import useStateRef from './hooks/useStateRef'
import {
  fakeUserInfoArr,
  IP,
  PORT,
  WAITING_FOR_READY_TIME,
  START_SIGNAL_CACHING_TIME,
} from './constant'
import useWebSocket from 'react-use-websocket'
import { useUnmount } from 'react-use'
import store from 'store2'

const SocketMessageType = {
  MATCHING_COMPLETE: 'MATCHING_COMPLETE',
  ROOM_DISMISS: 'ROOM_DISMISS',
  COMPETITOR_READY: 'COMPETITOR_READY',
  START_ANSWERING: 'START_ANSWERING',
  COMPETITOR_SUBMIT: 'COMPETITOR_SUBMIT',
}
const getSocketMessageType = (numType) => {
  return [null, ...Object.keys(SocketMessageType)][numType]
}

const mapStateToProps = ({ Contest, user }) => ({
  studentId: user.currentUser.id,
  currentContest: Contest.currentContest,
  channelId: Contest.channelId,
  status: Contest.matchingStatus,
  userIndex: Contest.userIndex,
  readyArr: Contest.readyArr,
})

const Contest = ({
  studentId,
  currentContest = {},
  channelId = null,
  status,
  userIndex,
  readyArr = [],
  dispatch = () => {},
}) => {
  const [isReconnect, setIsReconnect] = useStateRef(false)

  const socketUrl = useMemo(
    () => (channelId ? `ws://${IP}:${PORT}/api/v1/contest/sub?id=${channelId}` : null),
    [channelId],
  )

  const storageString = useMemo(() => `startTime:${studentId}.${currentContest.contestId}`, [
    studentId,
    currentContest.contestId,
  ])

  const clearMatchState = useCallback(() => {
    dispatch({
      type: 'Contest/setMatchingStatus',
      payload: MatchingStatus.IDLE,
    })
    dispatch({ type: 'Contest/setChannelId' })
    dispatch({ type: 'Contest/setReadyArr' })
    dispatch({ type: 'Contest/setUserIndex' })
  }, [dispatch])

  const onCancelMatching = useCallback(() => {
    if (channelId) {
      const enableTime = (store(storageString) || 0) + START_SIGNAL_CACHING_TIME
      if (enableTime > Date.now()) {
        dispatch({
          type: 'Contest/cancelMatching',
          payload: {
            channelId,
            studentId,
          },
          onSuccess: () => store.remove(storageString),
          onError,
        })
      }
    }
    clearMatchState()
  }, [clearMatchState, dispatch, channelId, studentId, storageString])

  const onStartMatching = useCallback(() => {
    dispatch({
      type: 'Contest/setMatchingStatus',
      payload: MatchingStatus.SEARCHING_ROOM,
    })
    const { contestId } = currentContest

    dispatch({
      type: 'Contest/startMatching',
      payload: {
        studentId,
        contestId,
      },
      onSuccess: () => store(storageString, Date.now()),
      onError: (err) => {
        onError(err)
        dispatch({
          type: 'Contest/setMatchingStatus',
          payload: MatchingStatus.IDLE,
        })
      },
    })
  }, [dispatch, currentContest, studentId, storageString])

  const onReconnect = useCallback(() => {
    setIsReconnect(true)

    dispatch({
      type: 'Contest/fetchChannelId',
      payload: {
        studentId,
      },
      onError: (err) => {
        setIsReconnect(false)
        onError(err)
        dispatch({
          type: 'Contest/setMatchingStatus',
          payload: MatchingStatus.IDLE,
        })
      },
    })
  }, [dispatch, studentId, setIsReconnect])

  const onReady = useCallback(() => {
    dispatch({
      type: 'Contest/readyForMatch',
      payload: {
        studentId,
        channelId,
        status: true,
      },
    })
  }, [dispatch, channelId, studentId])

  const onMatchingComplete = useCallback(() => {
    dispatch({
      type: 'Contest/matchingComplete',
      payload: {
        studentId,
        channelId,
      },
      onError: (err) => {
        onError(err)
        onCancelMatching()
      },
    })
  }, [channelId, dispatch, onCancelMatching, studentId])

  const onRoomDismiss = useCallback(() => {
    if (!readyArr[userIndex]) {
      notification.warn({
        message: '超时未准备',
        description: '请重新匹配',
      })
      clearMatchState()
    } else {
      notification.warn({
        message: '房间内有人超时未准备',
        description: '继续匹配',
      })
      dispatch({
        type: 'Contest/setMatchingStatus',
        payload: MatchingStatus.MATCHING,
      })
      dispatch({ type: 'Contest/setReadyArr' })
      dispatch({ type: 'Contest/setUserIndex' })
    }
  }, [clearMatchState, dispatch, readyArr, userIndex])

  const onCompetitorReady = useCallback(
    ({ readyArray }) => {
      dispatch({
        type: 'Contest/setReadyArr',
        payload: readyArray,
      })
    },
    [dispatch],
  )

  const onStartAnswering = useCallback(() => {
    dispatch({
      type: 'Contest/connectToMatch',
      payload: {
        studentId,
        contestId: currentContest.contestId,
      },
    })
  }, [dispatch, studentId, currentContest.contestId])

  const onCompetitorSubmit = useCallback(
    ({ submitIndex: competitorIndex }) => {
      if (competitorIndex !== userIndex && status === MatchingStatus.ANSWERING) {
        notification.info({
          description: `${fakeUserInfoArr[competitorIndex].nickname} 已提交答案`,
        })
      }
    },
    [status, userIndex],
  )

  const onSocketConnected = useCallback(() => {
    if (isReconnect) {
      dispatch({
        type: 'Contest/matchingComplete',
        payload: {
          studentId,
          channelId,
        },
        onError: onCancelMatching,
        onSuccess: () => {
          dispatch({
            type: 'Contest/connectToMatch',
            payload: {
              studentId,
              contestId: currentContest.contestId,
            },
            onError: onCancelMatching,
          })
        },
      })
    } else {
      dispatch({
        type: 'Contest/setMatchingStatus',
        payload: MatchingStatus.MATCHING,
      })
    }
  }, [isReconnect, dispatch, studentId, channelId, currentContest.contestId, onCancelMatching])

  const actionMap = useMemo(
    () => ({
      [SocketMessageType.MATCHING_COMPLETE]: onMatchingComplete,
      [SocketMessageType.ROOM_DISMISS]: onRoomDismiss,
      [SocketMessageType.COMPETITOR_READY]: onCompetitorReady,
      [SocketMessageType.START_ANSWERING]: onStartAnswering,
      [SocketMessageType.COMPETITOR_SUBMIT]: onCompetitorSubmit,
    }),
    [onMatchingComplete, onRoomDismiss, onCompetitorReady, onStartAnswering, onCompetitorSubmit],
  )

  const onSocketMessage = useCallback(
    ({ data }) => {
      const socketMessage = JSON.parse(data)
      console.log('socketMessage: ', socketMessage)

      const { type } = socketMessage
      const defaultAction = () => {}
      ;(actionMap[getSocketMessageType(type)] || defaultAction)(socketMessage)
    },
    [actionMap],
  )

  useWebSocket(socketUrl, {
    onOpen: onSocketConnected,
    onMessage: onSocketMessage,
    onError: onCancelMatching,
  })

  return (
    <PageContainer title={false}>
      <ProCard>
        <Row justify='center'>
          <Col span={18} xs={24} sm={20} lg={16}>
            <ContestContent onReconnect={onReconnect} onStartMatching={onStartMatching} />
          </Col>
        </Row>
        <ModalMatching onReady={onReady} onCancel={onCancelMatching} />
      </ProCard>
    </PageContainer>
  )
}

export default React.memo(connect(mapStateToProps)(Contest))
