import * as ContestServices from '@/services/contest'
import generateEffect from '@/utils/generateEffect'
import generateReducer, {
  defaultArrayTransformer,
  defaultObjectTransformer,
} from '@/utils/generateReducer'
import pick from 'lodash/pick'
import cloneDeep from 'lodash/cloneDeep'

const pageOverflow = ({ total, pageNum, pageSize }) => {
  return total - (pageNum - 1) * pageSize <= 0 && pageNum > 1
}

const defaultNewContest = {
  title: null,
  participantNumber: 3,
  startTime: null,
  endTime: null,
  description: null,
  chapter: null,
  randomQuestions: false,
  questions: [],
}

const defaultPagination = {
  total: 0,
  pageNum: 1,
  pageSize: 10,
}

const defaultState = {
  studentMatchHistory: [],
  studentMatchDetail: {},
  currentContest: {},
  questions: [],
  questionDetail: {},
  questionPagination: defaultPagination,
  filters: {},
  newContest: defaultNewContest,
  contests: [],
  contestMatches: [],
  contestMatchesPagination: defaultPagination,
  students: [],
  studentsPagination: defaultPagination,
  studentMatches: [],
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
  createContest: generateEffect(function* (_, { call, put, select }) {
    const newContest = yield select((state) => state.Contest.newContest)
    const questions = yield select((state) => state.Contest.questions)

    // TODO: 添加课程Id
    const courseId = 1

    const newContestCopy = cloneDeep(newContest)
    if (!newContestCopy.randomQuestions) {
      newContestCopy.questions = newContest.questions.map((questionId) =>
        pick(
          questions.find((q) => q.questionId === questionId),
          ['questionType', 'questionId'],
        ),
      )
    }

    yield call(ContestServices.createContest, {
      contest: {
        ...newContestCopy,
        courseId,
      },
    })

    yield put({
      type: 'fetchCurrentContest',
      payload: {
        courseId,
      },
    })

    yield put({
      type: 'setNewContest',
    })
  }),
  setFiltersAndFetchQuestions: generateEffect(function* ({ payload }, { call, put, select }) {
    const pagination = yield select((state) => state.Contest.questionPagination)

    yield put({
      type: 'setFilters',
      payload,
    })

    // TODO: 可能添加过滤器

    const res = yield call(ContestServices.fetchQuestionList, {
      pageNum: 1,
      pageSize: pagination.pageSize,
      ...payload,
    })

    yield put({
      type: 'setQuestions',
      payload: res.questions,
    })

    yield put({
      type: 'setQuestionPagination',
      payload: res.pagination,
    })
  }),
  fetchQuestions: generateEffect(function* ({ payload }, { call, put, select }) {
    const filters = yield select((state) => state.Contest.filters)
    const res = yield call(ContestServices.fetchQuestionList, { ...payload, ...filters })

    yield put({
      type: 'setQuestions',
      payload: res.questions,
    })

    yield put({
      type: 'setQuestionPagination',
      payload: res.pagination,
    })
  }),
  fetchQuestionsAndAppend: generateEffect(function* ({ payload }, { call, put, select }) {
    const questionPagination = yield select((state) => state.Contest.questionPagination)
    const filters = yield select((state) => state.Contest.filters)

    if (questionPagination.total <= (payload.pageNum - 1) * payload.pageSize) return

    const res = yield call(ContestServices.fetchQuestionList, { ...payload, ...filters })

    const { questions, pagination } = res

    if (
      pagination.pageSize === questionPagination.pageSize &&
      pagination.pageNum === questionPagination.pageNum + 1
    ) {
      yield put({
        type: 'appendQuestions',
        payload: questions,
      })

      yield put({
        type: 'setQuestionPagination',
        payload: pagination,
      })
    }
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
    const filters = yield select((state) => state.Contest.filters)
    yield call(ContestServices.createQuestion, payload)
    const res = yield call(ContestServices.fetchQuestionList, {
      ...pick(pagination, ['pageNum', 'pageSize']),
      ...filters,
    })

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
    const filters = yield select((state) => state.Contest.filters)
    yield call(ContestServices.updateQuestion, payload)
    const res = yield call(ContestServices.fetchQuestionList, {
      ...pick(pagination, ['pageNum', 'pageSize']),
      ...filters,
    })

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
    const filters = yield select((state) => state.Contest.filters)
    yield call(ContestServices.deleteQuestion, payload)
    let res = yield call(ContestServices.fetchQuestionList, {
      ...pick(pagination, ['pageNum', 'pageSize']),
      ...filters,
    })

    if (pageOverflow(res.pagination)) {
      res = yield call(ContestServices.fetchQuestionList, {
        pageNum: res.pagination.pageNum - 1,
        pageSize: res.pagination.pageSize,
        ...filters,
      })
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
  fetchAllContests: generateEffect(function* ({ payload }, { call, put, select }) {
    const res = yield call(ContestServices.fetchAllContests, payload)

    yield put({
      type: 'setContests',
      payload: res.contests,
    })
  }),
  fetchContestMatches: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(ContestServices.fetchAllContestMatches, payload)

    yield put({
      type: 'setContestMatches',
      payload: res.matches,
    })

    yield put({
      type: 'setContestMatchesPagination',
      payload: res.pagination,
    })
  }),
  fetchStudents: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(ContestServices.fetchAllStudents, payload)

    yield put({
      type: 'setStudents',
      payload: res.students,
    })

    yield put({
      type: 'setStudentsPagination',
      payload: res.pagination,
    })
  }),
  fetchStudentMatches: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(ContestServices.fetchAllStudentMatches, payload)

    yield put({
      type: 'setStudentMatches',
      payload: res.matches,
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
    transformer: (payload) => payload || defaultPagination,
    defaultState,
  }),
  setFilters: generateReducer({
    attributeName: 'filters',
    transformer: defaultObjectTransformer,
    defaultState,
  }),
  setQuestions: generateReducer({
    attributeName: 'questions',
    transformer: defaultArrayTransformer,
    defaultState,
  }),
  appendQuestions: generateReducer({
    attributeName: 'questions',
    transformer: (payload, state) => {
      const questionsCopy = cloneDeep(state.questions) || []
      questionsCopy.push(...payload)
      return questionsCopy
    },
  }),
  setQuestionDetail: generateReducer({
    attributeName: 'questionDetail',
    transformer: defaultObjectTransformer,
    defaultState,
  }),
  setNewContest: generateReducer({
    attributeName: 'newContest',
    transformer: (payload) => payload || defaultNewContest,
    defaultState,
  }),
  setNewContestQuestions: generateReducer({
    attributeName: 'newContest',
    transformer: (payload, state) => {
      const newContestCopy = cloneDeep(state.newContest) || defaultNewContest
      newContestCopy.questions = payload
      return newContestCopy
    },
    defaultState,
  }),
  setDefaultNewContest: generateReducer({
    attributeName: 'newContest',
    transformer: () => defaultNewContest,
    defaultState,
  }),
  setContests: generateReducer({
    attributeName: 'contests',
    transformer: defaultArrayTransformer,
    defaultState,
  }),
  setContestMatches: generateReducer({
    attributeName: 'contestMatches',
    transformer: defaultArrayTransformer,
    defaultState,
  }),
  setContestMatchesPagination: generateReducer({
    attributeName: 'contestMatchesPagination',
    transformer: (payload) => payload || defaultPagination,
    defaultState,
  }),
  setStudents: generateReducer({
    attributeName: 'students',
    transformer: defaultArrayTransformer,
    defaultState,
  }),
  setStudentsPagination: generateReducer({
    attributeName: 'studentsPagination',
    transformer: (payload) => payload || defaultPagination,
    defaultState,
  }),
  setStudentMatches: generateReducer({
    attributeName: 'studentMatches',
    transformer: defaultArrayTransformer,
    defaultState,
  }),
}

export default {
  namespace: 'Contest',
  state: defaultState,
  effects,
  reducers,
}
