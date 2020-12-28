import React, { useMemo, useCallback } from 'react'
/* eslint-disable-next-line */
import { Modal, Spin, Tag, List, Button, Avatar } from 'antd'
import Mock from 'mockjs'
import MatchingStatus from '@/pages/contest/student/Contest/matchingStatus'
import { connect } from 'umi'
import fakeUserInfoArr from '@/pages/contest/student/Contest/fakeUserInfo'

const mapStateToProps = ({ Contest, user }) => ({
  currentUser: user.currentUser,
  participantNumber: Contest.currentContest.participantNumber,
  readyArr: Contest.readyArr,
  userIndex: Contest.userIndex,
  status: Contest.matchingStatus,
  channelId: Contest.channelId,
})

const ModalMatching = ({
  currentUser,
  participantNumber = 0,
  readyArr = [],
  userIndex = 0,
  channelId,
  status,
  dispatch = () => {},
  onCancel = () => {},
}) => {
  const userInfoArr = fakeUserInfoArr
    .slice(0, participantNumber)
    .map((fakeUserInfo, index) => ({ ...fakeUserInfo, ready: readyArr[index] }))

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
    const studentId = currentUser.id
    dispatch({
      type: 'Contest/readyForMatch',
      payload: {
        studentId,
        channelId,
        status: true,
      },
    })
  }, [dispatch, channelId, currentUser])

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
                avatar={<Avatar src={index === userIndex ? currentUser.avatar : item.avatar} />}
                title={item.ready ? <Tag color='blue'>已准备</Tag> : null}
                description={index === userIndex ? currentUser.name : item.nickname}
              />
            </List.Item>
          )}
        />
      )}
    </Modal>
  )
}

export default React.memo(connect(mapStateToProps)(ModalMatching))
