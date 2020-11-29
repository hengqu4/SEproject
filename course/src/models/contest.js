import * as ContestServices from '@/services/contest'
import generateEffect from '@/utils/generateEffect'
import generateReducer, {
  defaultArrayTransformer,
  defaultObjectTransformer,
} from '@/utils/generateReducer'
import pick from 'lodash/pick'

const pageOverflow = ({ total, pageNum, pageSize }) => {
  return total - (pageNum - 1) * pageSize <= 0 && pageNum > 1
}

const defaultState = {
  studentMatchHistory: [],
  studentMatchDetail: {},
  currentContest: {},
  questions: [],
  questionDetail: {},
  questionPagination: {
    total: 0,
    pageNum: 1,
    pageSize: 20,
  },
}

const effects = {
  fetchStudentMatchHistory: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(ContestServices.fetchStudentMatchHistory, payload)

    yield put({
      type: 'setStudentMatchHistory',
      payload: res,
    })
  }),
  fetchStudentMatchDetail: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(ContestServices.fetchStudentMatchDetail, payload)

    yield put({
      type: 'setStudentMatchDetail',
      payload: res,
    })
  }),
  fetchCurrentContest: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(ContestServices.fetchCurrentContest, payload)

    yield put({
      type: 'setCurrentContest',
      payload: res,
    })
  }),
  fetchQuestions: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(ContestServices.fetchQuestionList, payload)

    console.log(res)

    yield put({
      type: 'setQuestions',
      payload: res.questions,
    })

    yield put({
      type: 'setQuestionPagination',
      payload: res.pagination,
    })
  }),
  fetchQuestionDetail: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(ContestServices.fetchQuestionDetail, payload)

    if (res.questionType === 1) {
      res.questionAnswer = res.questionAnswer.split('')
    }

    yield put({
      type: 'setQuestionDetail',
      payload: res,
    })
  }),
  createQuestion: generateEffect(function* ({ payload }, { select, call, put }) {
    const pagination = yield select((state) => state.Contest.questionPagination)
    yield call(ContestServices.createQuestion, payload)
    const res = yield call(
      ContestServices.fetchQuestionList,
      pick(pagination, ['pageNum', 'pageSize']),
    )

    yield put({
      type: 'setQuestions',
      payload: res.questions,
    })

    yield put({
      type: 'setQuestionPagination',
      payload: res.pagination,
    })
  }),
  updateQuestion: generateEffect(function* ({ payload }, { select, call, put }) {
    const pagination = yield select((state) => state.Contest.questionPagination)
    yield call(ContestServices.updateQuestion, payload)
    const res = yield call(
      ContestServices.fetchQuestionList,
      pick(pagination, ['pageNum', 'pageSize']),
    )

    yield put({
      type: 'setQuestions',
      payload: res.questions,
    })

    yield put({
      type: 'setQuestionPagination',
      payload: res.pagination,
    })
  }),
  deleteQuestion: generateEffect(function* ({ payload }, { select, call, put }) {
    const pagination = yield select((state) => state.Contest.questionPagination)
    yield call(ContestServices.deleteQuestion, payload)
    let res = yield call(
      ContestServices.fetchQuestionList,
      pick(pagination, ['pageNum', 'pageSize']),
    )

    console.log('res: ', res)

    if (pageOverflow(res.pagination)) {
      res = yield call(ContestServices.fetchQuestionList, {
        pageNum: res.pagination.pageNum - 1,
        pageSize: res.pagination.pageSize,
      })

      console.log('res: ', res)
    }

    yield put({
      type: 'setQuestions',
      payload: res.questions,
    })

    yield put({
      type: 'setQuestionPagination',
      payload: res.pagination,
    })
  }),
}

const reducers = {
  setStudentMatchHistory: generateReducer({
    attributeName: 'studentMatchHistory',
    transformer: defaultArrayTransformer,
    defaultState,
  }),
  setStudentMatchDetail: generateReducer({
    attributeName: 'studentMatchDetail',
    transformer: defaultObjectTransformer,
    defaultState,
  }),
  setCurrentContest: generateReducer({
    attributeName: 'currentContest',
    transformer: defaultObjectTransformer,
    defaultState,
  }),
  setQuestionPagination: generateReducer({
    attributeName: 'questionPagination',
    defaultState,
  }),
  setQuestions: generateReducer({
    attributeName: 'questions',
    transformer: defaultArrayTransformer,
    defaultState,
  }),
  setQuestionDetail: generateReducer({
    attributeName: 'questionDetail',
    transformer: defaultObjectTransformer,
    defaultState,
  }),
}

export default {
  namespace: 'Contest',
  state: defaultState,
  effects,
  reducers,
}
