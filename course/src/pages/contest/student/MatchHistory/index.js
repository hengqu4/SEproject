import React, { useState, useMemo, useCallback } from 'react'
import { useMount } from 'react-use'
import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import { Table, Space, message, notification, Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import moment from 'moment'
import { connect } from 'umi'
import MatchDetail from '@/pages/contest/components/MatchDetail'

const mapStateToProps = ({ Contest }) => ({
  dataSource: Contest.studentMatchHistory,
  matchDetail: Contest.studentMatchDetail,
})

const MatchHistory = ({ matchDetail = {}, dataSource = [], dispatch = () => {} }) => {
  const [tableLoading, setTableLoading] = useState(true)
  const [viewMode, setViewMode] = useState('table')

  useMount(() => {
    dispatch({
      type: 'Contest/fetchStudentMatchHistory',
      onError: (err) => {
        notification.error({
          message: '获取比赛列表失败',
          description: err.message,
        })
      },
      onFinish: setTableLoading.bind(this, false),
    })
  })

  const handleViewMatchDetail = useCallback(
    (matchId, event) => {
      event.preventDefault()

      if (matchDetail.matchId === matchId) {
        setViewMode('detail')
      } else {
        const dismiss = message.loading('正在加载比赛信息')

        dispatch({
          type: 'Contest/fetchStudentMatchDetail',
          payload: {
            matchId,
          },
          onSuccess: setViewMode.bind(this, 'detail'),
          onError: (err) => {
            notification.error({
              message: '获取比赛详情失败',
              description: err.message,
            })
          },
          onFinish: dismiss,
        })
      }
    },
    [matchDetail, dispatch],
  )

  const columns = useMemo(
    () => [
      {
        title: '测试标题',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '测试时间',
        dataIndex: 'timeStamp',
        key: 'timeStamp',
        render: (text) => <span>{moment(text).format('YYYY-MM-DD HH:mm')}</span>,
      },
      {
        title: '排名',
        key: 'rank',
        dataIndex: 'rank',
        render: (text, record, index) => <span>{`${text} / ${record.participantNumber}`}</span>,
      },
      {
        title: '分数',
        key: 'score',
        dataIndex: 'score',
      },
      {
        title: '出题范围',
        key: 'chapter',
        dataIndex: 'chapter',
        render: (text) => <span>前 {text} 章节</span>,
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => (
          <Space size='middle'>
            <a onClick={handleViewMatchDetail.bind(this, record.matchId)}>查看比赛详情</a>
          </Space>
        ),
      },
    ],
    [handleViewMatchDetail],
  )

  let content = (
    <ProCard extra={<span>已参加比赛数：{dataSource.length}</span>} bordered headerBordered>
      <Table
        loading={tableLoading}
        dataSource={dataSource}
        columns={columns}
        rowKey='matchId'
        pagination={false}
      />
    </ProCard>
  )

  if (viewMode === 'detail') {
    const { questionAndAnswers = [] } = matchDetail

    const questions = questionAndAnswers.map((questionAndAnswer) => ({
      ...questionAndAnswer.question,
      answer: questionAndAnswer.answer,
    }))

    content = (
      <MatchDetail
        title={matchDetail.title}
        user={matchDetail.userId}
        participants={matchDetail.participants}
        questions={questions}
        score={matchDetail.score}
        extra={
          <Button
            type='link'
            icon={<ArrowLeftOutlined />}
            onClick={setViewMode.bind(this, 'table')}
          />
        }
      />
    )
  }

  return <PageContainer title={false}>{content}</PageContainer>
}

export default connect(mapStateToProps)(MatchHistory)
