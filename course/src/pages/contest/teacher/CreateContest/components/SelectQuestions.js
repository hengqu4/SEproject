import React, { useState, useCallback, useMemo, useRef } from 'react'
import { Spin, Transfer, message, Button, Select } from 'antd'
import ModalQuestionDetail from '@/pages/contest/components/ModalQuestionDetail'
// import RangeNumber from '@/pages/contest/components/RangeNumber'
import { connect } from 'umi'
import onError from '@/utils/onError'
import { useMount } from 'react-use'
import pick from 'lodash/pick'
import scrollToEnd from '@/utils/scrollToEnd'
import classes from '@/pages/contest/teacher/CreateContest/style.less'

const mapStateToProps = ({ Contest }) => ({
  questions: Contest.questions,
  pagination: Contest.questionPagination,
  questionDetail: Contest.questionDetail,
  newContest: Contest.newContest,
  selectedQuestions: Contest.selectedQuestions,
  filters: Contest.filters,
})

const SelectQuestions = ({
  questions = [],
  pagination,
  newContest,
  selectedQuestions = [],
  filters = {},
  dispatch = () => {},
  questionDetail = {},
  onNextStep = () => {},
}) => {
  const [loading, setLoading] = useState(false)
  const [randomQuestions, setRandomQuestions] = useState(false)
  const modalRef = useRef(null)

  useMount(() => {
    if (!questions.length) {
      setLoading(true)
      dispatch({
        type: 'Contest/setFiltersAndFetchQuestions',
        onError,
        onFinish: setLoading.bind(this, false),
      })
    }
  })

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

  const getPage = useCallback(
    (pageNum, pageSize) => {
      setLoading(true)

      dispatch({
        type: 'Contest/fetchQuestionsAndAppend',
        payload: {
          pageNum,
          pageSize,
        },
        onError,
        onFinish: setLoading.bind(this, false),
      })
    },
    [dispatch],
  )

  const onScroll = useCallback(
    (direction, event) => {
      const { pageNum, pageSize, total } = pagination

      if (pageNum >= Math.ceil(total / pageSize) || !scrollToEnd(event.target)) return

      if (direction === 'left') {
        getPage(pageNum + 1, pageSize)
      }
    },
    [getPage, pagination],
  )

  const onChange = useCallback(
    (questionIds) => {
      const allIds = questions.map((q) => q.questionId)
      const newSelectedQuestions = questionIds
        .filter((id) => allIds.includes(id))
        .map((id) => questions.find((q) => q.questionId === id))
      dispatch({
        type: 'Contest/setSelectedQuestions',
        payload: newSelectedQuestions,
      })
    },
    [questions, dispatch],
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

  const onModalOk = useCallback((_, closeModal) => {
    closeModal && closeModal()
  }, [])

  const renderItem = (question) => (
    <span onDoubleClick={getQuestionDetail.bind(this, question)}>{question.questionContent}</span>
  )

  const questionsWithKey = useMemo(() => questions.map((q) => ({ ...q, key: q.questionId })), [
    questions,
  ])

  return (
    <div className={classes.SelectQuestionsBlock}>
      <div>
        <Select
          defaultValue={false}
          placeholder='出题方式'
          style={{ width: '100%' }}
          onChange={setRandomQuestions.bind(this)}
        >
          <Select.Option value>随机出题</Select.Option>
          <Select.Option value={false}>题库选题</Select.Option>
        </Select>
      </div>
      {/* <div>
        <RangeNumber
          onMinChange={}
        />
      </div> */}
      {randomQuestions ? null : (
        <div>
          <Select
            defaultValue={filters.questionType}
            style={{ width: '100%' }}
            placeholder='题目类型'
            onChange={(value) => {
              handleFiltersChange('questionType', value)
            }}
          >
            <Select.Option value={0}>单选</Select.Option>
            <Select.Option value={1}>多选</Select.Option>
          </Select>
        </div>
      )}
      {randomQuestions ? null : (
        <div>
          <Spin spinning={loading}>
            <Transfer
              listStyle={{
                width: '500px',
                height: '500px',
              }}
              dataSource={questionsWithKey}
              titles={['待选题目', '已选题目']}
              onScroll={onScroll}
              onChange={onChange}
              targetKeys={selectedQuestions.map((q) => q.questionId)}
              render={renderItem}
            />
          </Spin>
        </div>
      )}
      <div style={{ textAlign: 'center' }}>
        <Button type='primary' disabled={selectedQuestions?.length === 0} onClick={onNextStep}>
          下一步
        </Button>
      </div>
      <ModalQuestionDetail
        ref={modalRef}
        mode='readonly'
        question={questionDetail}
        onOk={onModalOk}
      />
    </div>
  )
}

export default React.memo(connect(mapStateToProps)(SelectQuestions))
