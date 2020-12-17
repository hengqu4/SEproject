import React, { useState, useMemo, useCallback, useRef } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import ModalQuestionDetail from '@/pages/contest/components/ModalQuestionDetail'
import { useMount, useUnmount, use } from 'react-use'
import { Table, Space, Popconfirm, Button, message, Select, Row, Col } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { connect } from 'umi'
import pick from 'lodash/pick'
import onError from '@/utils/onError'

const mapStateToProps = ({ Contest }) => ({
  dataSource: Contest.questions,
  total: Contest.questionCount,
  questionDetail: Contest.questionDetail,
  pagination: Contest.questionPagination,
  filters: Contest.filters,
})

const QuestionBank = ({
  dispatch = () => {},
  dataSource = [],
  questionDetail = {},
  filters = {},
  pagination,
}) => {
  const [loading, setLoading] = useState(false)

  const [modalMode, setModalMode] = useState('readonly')

  const modalRef = useRef(null)

  const getQuestions = useCallback(
    (newPageNum, newPageSize, questionType) => {
      const pageNum = newPageNum || pagination.pageNum
      const pageSize = newPageSize || pagination.pageSize

      setLoading(true)
      dispatch({
        type: 'Contest/fetchQuestions',
        payload: {
          pageNum,
          pageSize,
          questionType,
        },
        onError,
        onFinish: () => {
          setLoading(false)
        },
      })
    },
    [dispatch, pagination],
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
    [dispatch],
  )

  useMount(() => {
    getQuestions(1, 20)
  })

  useUnmount(() => {
    dispatch({
      type: 'Contest/setQuestions',
    })
    dispatch({
      type: 'Contest/setQuestionPagination',
    })
    dispatch({
      type: 'Contest/setFilters',
    })
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
    [dispatch],
  )

  const handleModalOk = useCallback(
    (values, closeModal) => {
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
      } else {
        closeModal()
      }
    },
    [modalMode, dispatch, questionDetail],
  )

  const handleFiltersChange = useCallback(
    (filterName, value) => {
      const newFilters = { ...filters, [filterName]: value }
      setLoading(true)
      dispatch({
        type: 'Contest/setFiltersAndFetchQuestions',
        payload: newFilters,
        onError,
        onFinish: setLoading.bind(this, false),
      })
    },
    [dispatch, filters],
  )

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
      current: pagination.pageNum,
    }),
    [pagination, getQuestions],
  )

  return (
    <PageContainer title={false}>
      <ProCard>
        <Row gutter={16}>
          <Col span={4}>
            <Select
              allowClear
              defaultValue={filters.questionType}
              style={{ width: '100%' }}
              onClear={() => handleFiltersChange('questionType', undefined)}
              placeholder='题目类型'
              onChange={(value) => {
                handleFiltersChange('questionType', value)
              }}
            >
              <Select.Option value={0}>单选</Select.Option>
              <Select.Option value={1}>多选</Select.Option>
            </Select>
          </Col>
          <Col span={4}>
            <Button type='primary' icon={<PlusOutlined />} onClick={handleCreateQuestionBtnClick}>
              新增题目
            </Button>
          </Col>
        </Row>

        <div style={{ marginTop: '20px' }}>
          <Table
            bordered
            loading={loading}
            dataSource={dataSource}
            columns={columns}
            rowKey='questionId'
            pagination={tablePagination}
            onRow={(record) => ({
              onDoubleClick: handleShowQuestionDetail.bind(this, record),
            })}
          />
        </div>
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
