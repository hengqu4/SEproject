import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Collapse, Table, Row, Col, Space, Badge, Avatar, Spin } from 'antd'
import { connect } from 'umi'
import onError from '@/utils/onError'
import formatTime from '@/utils/formatTime'

const mapStateToProps = ({ Contest = {}, Course }) => ({
  courseId: Course.currentCourseInfo.courseId,
  contests: Contest.contests,
  contestMatches: Contest.contestMatches,
  contestMatchesPagination: Contest.contestMatchesPagination,
})

const ContestMatches = ({
  courseId = -1,
  contests = [],
  contestMatches = [],
  contestMatchesPagination = {},
  dispatch = () => {},
}) => {
  const [contestsLoading, setContestsLoading] = useState(false)
  const [matchesLoading, setMatchesLoading] = useState(false)
  const [currContestId, setCurrContestId] = useState()

  useEffect(() => {
    setContestsLoading(true)

    dispatch({
      type: 'Contest/fetchAllContests',
      payload: {
        courseId,
      },
      onError,
      onFinish: setContestsLoading.bind(this, false),
    })
  }, [dispatch, courseId])

  const onPanelChange = useCallback(
    (contestId) => {
      if (contestId) {
        setMatchesLoading(true)
        setCurrContestId(contestId)
        dispatch({
          type: 'Contest/fetchContestMatches',
          payload: {
            pageNum: 1,
            pageSize: 5,
            contestId,
          },
          onError,
          onFinish: setMatchesLoading(this, false),
        })
      }
    },
    [dispatch],
  )

  const onPageChange = useCallback(
    (pageNum, pageSize) => {
      setMatchesLoading(true)
      dispatch({
        type: 'Contest/fetchContestMatches',
        payload: {
          pageNum,
          pageSize,
          contestId: currContestId,
        },
        onError,
        onFinish: setMatchesLoading(this, false),
      })
    },
    [dispatch, currContestId],
  )

  const pagination = useMemo(
    () => ({
      ...contestMatchesPagination,
      current: contestMatchesPagination.pageNum,
      onChange: onPageChange,
    }),
    [contestMatchesPagination, onPageChange],
  )

  const columns = useMemo(
    () => [
      {
        title: '对抗时间',
        dataIndex: 'timeStamp',
        key: 'timeStamp',
        width: '20%',
        render: (timeStr) => formatTime(timeStr),
      },
      {
        title: '排名情况',
        key: 'rank',
        width: '80%',
        render: (_, match) => (
          <Row gutter={[8, 8]}>
            {(match.participants || []).map((participant) => (
              <Col xs={24} sm={12} md={8} lg={6} key={participant.userId}>
                <Space>
                  <Badge count={participant.rank}>
                    <Avatar src={participant.avatar} />
                  </Badge>
                  <span>{participant.personalId}</span>
                  <span>{participant.realname}</span>
                  <span>得分：&nbsp;{participant.score}</span>
                </Space>
              </Col>
            ))}
          </Row>
        ),
      },
    ],
    [],
  )

  const panelContent = useMemo(
    () => (
      <Table
        bordered
        rowKey='matchTag'
        columns={columns}
        loading={matchesLoading}
        dataSource={contestMatches}
        pagination={pagination}
      />
    ),
    [columns, matchesLoading, pagination, contestMatches],
  )

  const panels = useMemo(
    () =>
      contests.map((contest) => (
        <Collapse.Panel
          key={contest.contestId}
          header={contest.title}
          extra={`前${contest.chapter}章节`}
        >
          {panelContent}
        </Collapse.Panel>
      )),
    [panelContent, contests],
  )

  return (
    <Spin spinning={contestsLoading}>
      <Collapse accordion destroyInactivePanel onChange={onPanelChange}>
        {panels}
      </Collapse>
    </Spin>
  )
}

export default React.memo(connect(mapStateToProps)(ContestMatches))
