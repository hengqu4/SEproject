import React, { useMemo, useCallback } from 'react'
/* eslint-disable-next-line */
import { Modal, Spin, Tag, List, Button, Avatar } from 'antd'
import Mock from 'mockjs'
import MatchingStatus from '@/pages/contest/student/Contest/matchingStatus'
import { connect } from 'umi'

const nicknames = 'ABCDEFGHIJKLMNOPQ'.split('')

const mapStateToProps = ({ Contest }) => ({
  participantNumber: Contest.currentContest.participantNumber,
  readyArr: Contest.readyArr,
  userIndex: Contest.userIndex,
  status: Contest.matchingStatus,
  channelId: Contest.channelId,
})

const ModalMatching = ({
  participantNumber = 0,
  readyArr = [],
  userIndex = 0,
  channelId,
  status,
  dispatch = () => {},
  onCancel = () => {},
}) => {
  const userInfoArr = new Array(participantNumber).fill(null).map((_, index) => ({
    nickname: nicknames[index],
    avatar: Mock.mock('@image'),
    ready: readyArr[index],
  }))

  const title = useMemo(() => {
    switch (status) {
      case MatchingStatus.SEARCHING_ROOM:
        return '正在寻找房间'
      case MatchingStatus.MATCHING:
        return '正在匹配对手'
      case MatchingStatus.WAITING_FOR_READY:
        return '等待确认'
    }

    return ''
  }, [status])

  const handleReadyForMatch = useCallback(() => {
    // TODO: 获取userId
    const stduentId = 1
    dispatch({
      type: 'Contest/readyForMatch',
      payload: {
        stduentId,
        channelId,
        status: true,
      },
    })
  }, [dispatch, channelId])

  return (
    <Modal
      destroyOnClose
      visible={status !== MatchingStatus.IDLE && status !== MatchingStatus.ANSWERING}
      closable={false}
      title={title}
      footer={
        status !== MatchingStatus.WAITING_FOR_READY ? (
          <div>
            <Button type='primary' onClick={onCancel}>
              取消匹配
            </Button>
          </div>
        ) : null
      }
    >
      {status !== MatchingStatus.WAITING_FOR_READY ? (
        <div style={{ textAlign: 'center' }}>
          <Spin />
        </div>
      ) : (
        <List
          dataSource={userInfoArr}
          renderItem={(item, index) => (
            <List.Item
              actions={
                userIndex === index && !readyArr[userIndex]
                  ? [
                      <Button key='ready' type='primary' onClick={handleReadyForMatch}>
                        准备
                      </Button>,
                    ]
                  : null
              }
            >
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={item.ready ? <Tag color='blue'>已准备</Tag> : null}
                description={item.nickname}
              />
            </List.Item>
          )}
        />
      )}
    </Modal>
  )
}

export default React.memo(connect(mapStateToProps)(ModalMatching))
