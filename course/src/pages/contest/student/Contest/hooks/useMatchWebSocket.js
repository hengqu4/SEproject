import useWebSocket from 'react-use-websocket'
import React, { useCallback, useMemo } from 'react'
import MatchingStatus from '@/pages/contest/student/Contest/matchingStatus'
import onError from '@/utils/onError'
import { message, Avatar, Image } from 'antd'
import fakeUserInfoArr from '@/pages/contest/student/Contest/fakeUserInfo'

const useMatchWebSocket = ({
  studentId,
  channelId,
  dispatch = () => {},
  clearStatus = () => {},
  reconnect = false,
}) => {
  const socketUrl = useMemo(
    () => (channelId ? `ws://fwdarling2020.cn:18080/api/v1/contest/sub?id=${channelId}` : null),
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
      type: 'Contest/setMatchingStatus',
      payload: MatchingStatus.ANSWERING,
    })
  }, [dispatch])

  const handleCompetitorSubmit = useCallback((competitorIndex) => {
    const messageContent = (
      <div>
        <Avatar src={<Image src={fakeUserInfoArr[competitorIndex].avatar} />} />
        <span>{`${fakeUserInfoArr[competitorIndex].nickname}已提交答案`}</span>
      </div>
    )
    message.info(messageContent)
  }, [])

  const onOpen = useCallback(() => {
    let newStatus = MatchingStatus.MATCHING
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
