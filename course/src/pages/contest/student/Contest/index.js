import React, { useState, useCallback, useMemo, useRef } from 'react'
import { useMount, useUnmount } from 'react-use'
import { PageContainer } from '@ant-design/pro-layout'
import { notification, Spin, Row, Col, Button } from 'antd'
import ProCard from '@ant-design/pro-card'
import ContestDescription from '@/pages/contest/components/ContestDescrption'
import { connect } from 'umi'
import ModalMatching from '@/pages/contest/components/ModalMatching'
import onError from '@/utils/onError'
import useMatchWebSocket from '@/pages/contest/hooks/useMatchWebSocket'
import MatchQuestionsWrapper from '@/pages/contest/components/MatchQuestionsWapper'
import MatchingStatus from './MatchingStatus'

const mapStateToProps = ({ Contest }) => ({
  currentContest: Contest.currentContest,
  participated: Contest.participated,
  participating: Contest.participating,
  channelId: Contest.channelId,
  status: Contest.matchingStatus,
})

const Contest = ({
  currentContest = {},
  participating = false,
  participated = false,
  channelId = null,
  status,
  dispatch = () => {},
}) => {
  const [loading, setLoading] = useState(false)
  const reconnectRef = useRef(false)

  useMount(() => {
    setLoading(true)
    dispatch({
      type: 'Contest/fetchCurrentContest',
      payload: {
        courseId: 1,
      },
      onError: (err) => {
        notification.error({
          message: '获取比赛信息失败',
          description: err.message,
        })
      },
      onFinish: setLoading.bind(this, false),
    })
  })

  const handleCancelMatching = useCallback(() => {
    dispatch({
      type: 'Contest/setMatchingStatus',
      payload: MatchingStatus.IDLE,
    })
    dispatch({
      type: 'Contest/setChannelId',
    })
  }, [dispatch])

  useUnmount(() => {
    handleCancelMatching()
  })

  useMatchWebSocket({
    channelId,
    dispatch,
    clearStatus: handleCancelMatching,
    reconnect: reconnectRef.current,
  })

  const handleModalOpen = useCallback(() => {
    dispatch({
      type: 'Contest/setMatchingStatus',
      payload: MatchingStatus.SEARCHING_ROOM,
    })
    // TODO: 获取userId
    const studentId = 1
    const { contestId } = currentContest

    dispatch({
      type: 'Contest/fetchChannelId',
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
  }, [dispatch, currentContest])

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
      btnAttrs.onClick = () => {
        reconnectRef.current = true
        handleModalOpen()
      }
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
  }, [loading, currentContestValid, participated, participating, handleModalOpen])

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
    <PageContainer>
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
