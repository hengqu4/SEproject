import useWebSocket from 'react-use-websocket'
import { useCallback, useMemo } from 'react'
import MatchingStatus from '@/pages/contest/student/Contest/matchingStatus'
import onError from '@/utils/onError'

const useMatchWebSocket = ({
  channelId,
  dispatch = () => {},
  clearStatus = () => {},
  reconnect = false,
}) => {
  const socketUrl = useMemo(
    () => (channelId ? `ws://localhost:8080/api/v1/contest/sub?id=${channelId}` : null),
    [channelId],
  )

  const handleMatchingComplete = useCallback(() => {
    // TODO: 获取当前userId
    const studentId = 1
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
  }, [channelId, dispatch, clearStatus])

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

  const handleStartAnswering = useCallback(
    (matchId) => {
      dispatch({
        type: 'Contest/setMatchingStatus',
        payload: MatchingStatus.ANSWERING,
      })
      dispatch({
        type: 'Contest/setMatchId',
        payload: matchId,
      })
    },
    [dispatch],
  )

  const onOpen = useCallback(() => {
    let newStatus = MatchingStatus.SEARCHING_ROOM
    if (reconnect.current) {
      newStatus = MatchingStatus.ANSWERING
    }

    dispatch({
      type: 'Contest/setMatchingStatus',
      payload: newStatus,
    })
  }, [dispatch, reconnect])

  const onMessage = useCallback(
    (event) => {
      const socketMessage = JSON.parse(event.data)

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
          handleStartAnswering(socketMessage.matchId)
          break
      }
    },
    [handleMatchingComplete, handleRoomDismiss, handleUserReady, handleStartAnswering],
  )

  useWebSocket(socketUrl, {
    onOpen,
    onMessage,
  })
}

export default useMatchWebSocket
