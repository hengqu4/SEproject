import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { message, Button, Select, List, Input, Table, Space, Form, Row, Col } from 'antd'
import { connect } from 'umi'
import onError from '@/utils/onError'
import { isNaN } from 'lodash'
import isInt from 'validator/es/lib/isInt'
import classes from '@/pages/contest/teacher/CreateContest/style.less'

const isPosIntValidator = (value) => {
  return isInt(`${value}`, { min: 0 }) ? Promise.resolve() : Promise.reject('需为大于等于0的整数')
}

const isPosIntOrEmptyValidator = (value) => {
  if (value === undefined || `${value}`.length === 0) return Promise.resolve()
  return isPosIntValidator(value)
}

const formItemLayout = {
  labelCol: {
    span: 6,
    offset: 0,
  },
  wrapperCol: {
    span: 18,
    offset: 0,
  },
}

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
  selectedQuestions = [],
  filters = {},
  dispatch = () => {},
  onNextStep = () => {},
  onShowQuestionDetail = () => {},
}) => {
  const [loading, setLoading] = useState(false)
  const [randomQuestions, setRandomQuestions] = useState(false)
  const [listLoading, setListLoading] = useState(false)

  const [form] = Form.useForm(null)

  useEffect(() => {
    setLoading(true)
    dispatch({
      type: 'Contest/setFiltersAndFetchQuestions',
      onError,
      onFinish: setLoading.bind(this, false),
    })
  }, [dispatch])

  const getRandomQuestions = useCallback(
    (payload) => {
      setListLoading(true)
      dispatch({
        type: 'Contest/fetchRandomQuestions',
        payload,
        onError,
        onFinish: setListLoading.bind(null, false),
      })
    },
    [dispatch],
  )

  const handleRandomChange = useCallback(
    (value) => {
      dispatch({
        type: 'Contest/setSelectedQuestions',
      })

      setRandomQuestions(value)
    },
    [dispatch],
  )

  const handleFiltersChange = useCallback(
    (changedFilters) => {
      const newFilters = { ...filters, ...changedFilters }
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

  const handleFormSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields()

      const chapterStart = values.from?.length ? +values.from : undefined
      const chapterEnd = values.to?.length ? +values.to : undefined

      if (chapterStart !== undefined && chapterEnd !== undefined && chapterEnd < chapterStart) {
        return message.error('起始章节不能大于终止章节')
      }

      if (randomQuestions) {
        const singleChoiceQuestionNum = +values.singleCnt
        const multipleChoiceQuestionNum = +values.multipleCnt

        if (isNaN(singleChoiceQuestionNum) || isNaN(multipleChoiceQuestionNum)) {
          return message.error('请正确填写表单项')
        }

        getRandomQuestions({
          chapterStart,
          chapterEnd,
          singleChoiceQuestionNum,
          multipleChoiceQuestionNum,
        })
      } else {
        handleFiltersChange({ chapterStart, chapterEnd })
      }
    } catch (_) {
      message.error('请正确填写表单项')
    }
  }, [form, handleFiltersChange, getRandomQuestions, randomQuestions])

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
    [dispatch, pagination],
  )

  const questioSelected = useCallback(
    (question) => {
      return selectedQuestions.some(
        (sq) => sq.questionType === question.questionType && sq.questionId === question.questionId,
      )
    },
    [selectedQuestions],
  )

  const deleteSelectedQuestions = useCallback(
    (question) => {
      const newSelectedQuestions = selectedQuestions.filter(
        (sq) => sq.questionId !== question.questionId || sq.questionType !== question.questionType,
      )

      dispatch({
        type: 'Contest/setSelectedQuestions',
        payload: newSelectedQuestions,
      })
    },
    [dispatch, selectedQuestions],
  )

  const addSelectedQuestion = useCallback(
    (question) => {
      const newSelectedQuestions = [...selectedQuestions, question]

      dispatch({
        type: 'Contest/setSelectedQuestions',
        payload: newSelectedQuestions,
      })
    },
    [dispatch, selectedQuestions],
  )

  const tablePagination = useMemo(
    () => ({
      ...pagination,
      onChange: getQuestions,
      onShowSizeChange: getQuestions,
      showSizeChanger: true,
      current: pagination.pageNum,
    }),
    [pagination, getQuestions],
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
        render: (_, record) => {
          return (
            <Space>
              {questioSelected(record) ? (
                <Button type='link' onClick={deleteSelectedQuestions.bind(this, record)}>
                  移除
                </Button>
              ) : (
                <Button type='link' onClick={addSelectedQuestion.bind(this, record)}>
                  添加
                </Button>
              )}
              <Button type='link' onClick={onShowQuestionDetail.bind(this, record)}>
                详情
              </Button>
            </Space>
          )
        },
      },
    ],
    [deleteSelectedQuestions, addSelectedQuestion, onShowQuestionDetail, questioSelected],
  )

  return (
    <div className={classes.SelectQuestionsBlock}>
      <div>
        <Select
          defaultValue={false}
          placeholder='出题方式'
          style={{ width: '100%' }}
          onChange={handleRandomChange}
        >
          {/* eslint-disable-next-line */}
          <Select.Option value={true}>随机出题</Select.Option>
          <Select.Option value={false}>题库选题</Select.Option>
        </Select>
      </div>
      {randomQuestions ? null : (
        <div>
          <Select
            defaultValue={filters.questionType}
            style={{ width: '100%' }}
            placeholder='题目类型'
            onChange={(value) => {
              handleFiltersChange({ questionType: value })
            }}
          >
            <Select.Option value={0}>单选</Select.Option>
            <Select.Option value={1}>多选</Select.Option>
          </Select>
        </div>
      )}
      <div>
        <Form form={form}>
          {randomQuestions ? (
            <Form.Item>
              <Row>
                <Col span={12}>
                  <Form.Item
                    key='singleCnt'
                    {...formItemLayout}
                    label='单选题数目'
                    name='singleCnt'
                    rules={[
                      {
                        validator(_, value) {
                          return isPosIntValidator(value)
                        },
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    key='multipleCnt'
                    {...formItemLayout}
                    label='多选题数目'
                    name='multipleCnt'
                    rules={[
                      {
                        validator(_, value) {
                          return isPosIntValidator(value)
                        },
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
          ) : null}
          <Form.Item>
            <Row>
              <Col span={12}>
                <Form.Item
                  {...formItemLayout}
                  label='起始章节'
                  name='from'
                  rules={[
                    {
                      validator(_, value) {
                        return isPosIntOrEmptyValidator(value)
                      },
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formItemLayout}
                  label='终止章节'
                  name='to'
                  rules={[
                    {
                      validator(_, value) {
                        return isPosIntOrEmptyValidator(value)
                      },
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center' }}>
          <Button type='primary' onClick={handleFormSubmit}>
            {randomQuestions ? '生成随机题目' : '确定'}
          </Button>
        </div>
      </div>
      <div>
        <h3>已选题目</h3>
        <div className={randomQuestions ? '' : classes.SelectedQuestionsBlock}>
          <List
            bordered
            loading={listLoading}
            dataSource={selectedQuestions}
            renderItem={(question) => {
              return (
                <List.Item
                  actions={[
                    <Button
                      key='detail'
                      type='link'
                      onClick={onShowQuestionDetail.bind(this, question)}
                    >
                      详情
                    </Button>,
                    <Button
                      key='delete'
                      type='link'
                      onClick={deleteSelectedQuestions.bind(this, question)}
                    >
                      删除
                    </Button>,
                  ]}
                >
                  {question.questionContent}
                </List.Item>
              )
            }}
          />
        </div>
      </div>
      {randomQuestions ? null : (
        <div>
          <Table
            bordered
            loading={loading}
            dataSource={questions}
            columns={columns}
            rowKey='questionId'
            pagination={tablePagination}
          />
        </div>
      )}
      <div style={{ textAlign: 'center' }}>
        <Button type='primary' disabled={selectedQuestions?.length === 0} onClick={onNextStep}>
          下一步
        </Button>
      </div>
    </div>
  )
}

export default React.memo(connect(mapStateToProps)(SelectQuestions))
