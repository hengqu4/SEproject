import useWebSocket from 'react-use-websocket'
import { useCallback, useMemo } from 'react'
import MatchingStatus from '@/pages/contest/student/Contest/matchingStatus'
import onError from '@/utils/onError'
import { notification } from 'antd'
import fakeUserInfoArr from '@/pages/contest/student/Contest/fakeUserInfo'

const host = '10.20.30.90'
const port = 8080

const useMatchWebSocket = ({
  studentId,
  channelId,
  dispatch = () => {},
  clearStatus = () => {},
  reconnect = false,
  status = MatchingStatus.IDLE,
  contestId,
  userIndex = -1,
}) => {
  const socketUrl = useMemo(
    () => (channelId ? `ws://${host}:${port}/api/v1/contest/sub?id=${channelId}` : null),
    [channelId],
  )

  const handleMatchingComplete = useCallback(() => {
    dispatch({
      type: 'Contest/matchingComplete',
      payload: {
        studentId,
        channelId,
      },
      onError: (err) => {
        onError(err)
        clearStatus()
      },
    })
  }, [channelId, dispatch, clearStatus, studentId])

  const handleRoomDismiss = useCallback(() => {
    dispatch({
      type: 'Contest/setMatchingStatus',
      payload: MatchingStatus.MATCHING,
    })
    dispatch({
      type: 'Contest/setReadyArr',
    })
  }, [dispatch])

  const handleUserReady = useCallback(
    (readyArray) => {
      dispatch({
        type: 'Contest/setReadyArr',
        payload: readyArray,
      })
    },
    [dispatch],
  )

  const handleStartAnswering = useCallback(() => {
    dispatch({
      type: 'Contest/connectToMatch',
      payload: {
        studentId,
        contestId,
      },
    })
  }, [dispatch, studentId, contestId])

  const handleCompetitorSubmit = useCallback(
    (competitorIndex) => {
      if (competitorIndex !== userIndex && status === MatchingStatus.ANSWERING) {
        notification.info({
          description: `${fakeUserInfoArr[competitorIndex].nickname} 已提交答案`,
        })
      }
    },
    [status, userIndex],
  )

  const onOpen = useCallback(() => {
    if (reconnect.current) {
      dispatch({
        type: 'Contest/matchingComplete',
        payload: {
          studentId,
          channelId,
        },
        onError: clearStatus,
        onSuccess: () => {
          dispatch({
            type: 'Contest/connectToMatch',
            payload: {
              studentId,
              contestId,
            },
            onError: clearStatus,
          })
        },
      })
    } else {
      dispatch({
        type: 'Contest/setMatchingStatus',
        payload: MatchingStatus.MATCHING,
      })
    }
  }, [dispatch, reconnect, studentId, channelId, contestId, clearStatus])

  const onMessage = useCallback(
    (event) => {
      const socketMessage = JSON.parse(event.data)

      console.log('socketMessage: ', socketMessage)

      const { type } = socketMessage

      switch (type) {
        case 1:
          handleMatchingComplete()
          break
        case 2:
          handleRoomDismiss()
          break
        case 3:
          handleUserReady(socketMessage.readyArray)
          break
        case 4:
          handleStartAnswering(socketMessage.userIndex)
          break
        case 5:
          handleCompetitorSubmit(socketMessage.submitIndex)
      }
    },
    [
      handleMatchingComplete,
      handleRoomDismiss,
      handleUserReady,
      handleStartAnswering,
      handleCompetitorSubmit,
    ],
  )

  useWebSocket(socketUrl, {
    onOpen,
    onMessage,
    onError: clearStatus,
    onClose: clearStatus,
  })
}

export default useMatchWebSocket
