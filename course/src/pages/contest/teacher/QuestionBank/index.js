import React, { useState, useMemo, useCallback, useRef } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import ModalQuestionDetail from '@/pages/contest/teacher/QuestionBank/ModalQuestionDetail'
import { useMount } from 'react-use'
import { Table, notification, Space, Popconfirm, Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { connect } from 'umi'
import pick from 'lodash/pick'

const mapStateToProps = ({ Contest }) => ({
  dataSource: Contest.questions,
  total: Contest.questionCount,
  questionDetail: Contest.questionDetail,
  pagination: Contest.questionPagination,
})

const QuestionBank = ({
  dispatch = () => {},
  dataSource = [],
  questionDetail = {},
  pagination,
}) => {
  const [loading, setLoading] = useState(false)

  const [modalMode, setModalMode] = useState('readonly')

  const modalRef = useRef(null)

  const onError = useCallback((err) => {
    notification.error({
      description: err.message,
    })
  }, [])

  const getQuestions = useCallback(
    (newPageNum, newPageSize) => {
      const pageNum = newPageNum || pagination.pageNum
      const pageSize = newPageSize || pagination.pageSize

      setLoading(true)
      dispatch({
        type: 'Contest/fetchQuestions',
        payload: {
          pageNum,
          pageSize,
        },
        onError,
        onFinish: () => {
          setLoading(false)
        },
      })
    },
    [dispatch, onError, pagination],
  )

  const getQuestionDetail = useCallback(
    (question) => {
      const dismiss = message.info('正在加载题目信息')
      dispatch({
        type: 'Contest/fetchQuestionDetail',
        payload: pick(question, ['questionType', 'questionId']),
        onSuccess: () => {
          modalRef && modalRef.current.open()
        },
        onError,
        onFinish: dismiss,
      })
    },
    [dispatch, onError],
  )

  useMount(() => {
    getQuestions(1, 20)
  })

  const handleEditQuestionBtnClick = useCallback(
    (question, event) => {
      event.preventDefault()
      setModalMode('edit')
      getQuestionDetail(question)
    },
    [getQuestionDetail],
  )

  const handleShowQuestionDetail = useCallback(
    (question, event) => {
      event.preventDefault()
      setModalMode('readonly')
      getQuestionDetail(question)
    },
    [getQuestionDetail],
  )

  const handleCreateQuestionBtnClick = useCallback(
    (event) => {
      setModalMode('create')
      modalRef && modalRef.current.open()
    },
    [modalRef],
  )

  const handleDeleteQuestion = useCallback(
    (question, event) => {
      event.preventDefault()
      setLoading(true)
      dispatch({
        type: 'Contest/deleteQuestion',
        payload: pick(question, ['questionType', 'questionId']),
        onError,
        onFinish: setLoading.bind(this, false),
      })
    },
    [dispatch, onError],
  )

  const handleModalOk = async (values, closeModal) => {
    if (modalMode === 'edit') {
      const payload = {
        ...values,
        questionId: questionDetail.questionId,
        oldType: questionDetail.questionType,
      }

      dispatch({
        type: 'Contest/updateQuestion',
        payload,
        onError,
        onFinish: closeModal,
      })
    } else if (modalMode === 'create') {
      dispatch({
        type: 'Contest/createQuestion',
        payload: values,
        onError,
        onFinish: closeModal,
      })
    }
  }

  const columns = useMemo(
    () => [
      {
        title: '题目描述',
        dataIndex: 'questionContent',
        key: 'questionContent',
        width: '60%',
      },
      {
        title: '题目类型',
        dataIndex: 'questionType',
        key: 'questionType',
        render: (type) => <span>{type ? '多选' : '单选'}</span>,
      },
      {
        title: '章节',
        dataIndex: 'questionChapter',
        key: 'questionChapter',
      },
      {
        title: '操作',
        key: 'actions',
        render: (text, record) => {
          return (
            <Space>
              <Popconfirm
                title='确认删除此题目'
                onConfirm={handleDeleteQuestion.bind(this, record)}
              >
                <a>删除</a>
              </Popconfirm>
              <a onClick={handleEditQuestionBtnClick.bind(this, record)}>编辑</a>
            </Space>
          )
        },
      },
    ],
    [handleEditQuestionBtnClick, handleDeleteQuestion],
  )

  const tablePagination = useMemo(
    () => ({
      ...pagination,
      onChange: getQuestions,
    }),
    [pagination, getQuestions],
  )

  return (
    <PageContainer>
      <ProCard
        extra={
          <Button type='link' icon={<PlusOutlined />} onClick={handleCreateQuestionBtnClick}>
            新增题目
          </Button>
        }
      >
        <Table
          loading={loading}
          dataSource={dataSource}
          columns={columns}
          rowKey='questionId'
          pagination={tablePagination}
          onRow={(record) => ({
            onDoubleClick: handleShowQuestionDetail.bind(this, record),
          })}
        />
        <ModalQuestionDetail
          ref={modalRef}
          mode={modalMode}
          question={questionDetail}
          onOk={handleModalOk}
        />
      </ProCard>
    </PageContainer>
  )
}

export default React.memo(connect(mapStateToProps)(QuestionBank))
