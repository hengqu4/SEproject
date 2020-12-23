import React, { useState, useCallback, useMemo } from 'react'
import { Modal, Table, Space, Avatar, Divider } from 'antd'
import formatTime from '@/utils/formatTime'

const ModalStudentMatches = ({ studentMatches = [], student = {} }, ref) => {
  const [visible, setVisible] = useState(false)
  const [currPage, setCurrPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const open = useCallback(() => {
    setVisible(true)
  }, [])

  const close = useCallback(() => {
    setVisible(false)
  }, [])
  React.useImperativeHandle(ref, () => ({
    open,
  }))

  const onPageChange = useCallback(
    (pageNum, newPageSize) => {
      setCurrPage(pageNum)

      if (newPageSize !== pageSize) {
        setPageSize(newPageSize)
      }
    },
    [pageSize],
  )

  const columns = useMemo(
    () => [
      {
        title: '比赛标题',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '出题范围',
        dataIndex: 'chapter',
        key: 'chapter',
        render: (chapter) => `前 ${chapter} 章节`,
      },
      {
        title: '对抗时间',
        dataIndex: 'timeStamp',
        key: 'timeStamp',
        render: (timeStr) => formatTime(timeStr),
      },
      {
        title: '参赛人数',
        dataIndex: 'participantNumber',
        key: 'participantNumber',
      },
      {
        title: '排名',
        dataIndex: 'rank',
        key: 'rank',
      },
      {
        title: '分数',
        dataIndex: 'score',
        key: 'score',
      },
    ],
    [],
  )

  const pagination = {
    current: currPage,
    pageSize,
    total: studentMatches.length,
    onChange: onPageChange,
  }

  return (
    <Modal
      title='学生比赛历史'
      width={800}
      visible={visible}
      destroyOnClose
      onCancel={close}
      onOk={close}
    >
      <Space>
        <Avatar src={student.avatar} />
        <span>{student.personal_id}</span>
        <span>{student.realname}</span>
      </Space>
      <Divider />
      <Table
        bordered
        columns={columns}
        pagination={pagination}
        dataSource={studentMatches}
        rowKey='matchId'
      />
    </Modal>
  )
}

export default React.memo(React.forwardRef(ModalStudentMatches))
