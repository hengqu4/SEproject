import * as ContestServices from '@/services/contest'
import generateEffect from '@/utils/generateEffect'
import generateReducer, {
  defaultArrayTransformer,
  defaultObjectTransformer,
} from '@/utils/generateReducer'
import pick from 'lodash/pick'
import cloneDeep from 'lodash/cloneDeep'
import MatchingStatus from '@/pages/contest/student/Contest/matchingStatus'
import storage from 'store2'

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
  pageSize: 20,
}

const defaultFilter = {
  questionType: 0,
}

const defaultState = {
  studentMatchHistory: [],
  studentMatchDetail: {},
  currentContest: {},
  participated: false,
  participating: false,
  questions: [],
  questionDetail: {},
  questionPagination: defaultPagination,
  filters: defaultFilter,
  newContest: defaultNewContest,
  selectedQuestions: [],
  contests: [],
  contestMatches: [],
  contestMatchesPagination: defaultPagination,
  students: [],
  studentsPagination: defaultPagination,
  studentMatches: [],
  matchingStatus: MatchingStatus.IDLE,
  readyArr: [],
  channelId: null,
  userIndex: 0,
  matchId: null,
  matchTimeStamp: null,
  matchQuestions: [],
  matchQuestionAnswers: [],
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
      payload: res.contest,
    })

    yield put({
      type: 'setParticipated',
      payload: res.bIsParticipated,
    })

    yield put({
      type: 'setParticipating',
      payload: res.bIsParticipating,
    })
  }),
  createContest: generateEffect(function* (_, { call, put, select }) {
    const newContest = yield select((state) => state.Contest.newContest)
    const selectedQuestions = yield select((state) => state.Contest.selectedQuestions)

    // TODO: 添加课程Id
    const courseId = 1

    const newContestCopy = cloneDeep(newContest)
    newContestCopy.questions = selectedQuestions.map((q) => pick(q, ['questionType', 'questionId']))

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

    const filters = yield select((state) => state.Contest.filters)

    // TODO: 可能添加过滤器

    const res = yield call(ContestServices.fetchQuestionList, {
      pageNum: 1,
      pageSize: pagination.pageSize,
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

    console.log('res: ', res)

    yield put({
      type: 'setStudentMatches',
      payload: res.matches,
    })
  }),
  startMatching: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(ContestServices.startMatching, payload)

    yield put({
      type: 'setChannelId',
      payload: res.channelId,
    })
  }),
  matchingComplete: generateEffect(function* ({ payload }, { select, call, put }) {
    yield put({
      type: 'setMatchingStatus',
      payload: MatchingStatus.WAITING_FOR_READY,
    })

    const res = yield call(ContestServices.fetchMatchingIndex, payload)

    yield put({
      type: 'setUserIndex',
      payload: res.index,
    })
  }),
  readyForMatch: generateEffect(function* ({ payload }, { call }) {
    yield call(ContestServices.readyMatch, payload)
  }),
  fetchChannelId: generateEffect(function* ({ payload }, { call, put }) {
    const { channelId } = yield call(ContestServices.fetchChannelId, payload)

    yield put({
      type: 'setChannelId',
      payload: channelId,
    })
  }),
  connectToMatch: generateEffect(function* ({ payload }, { call, put }) {
    const [{ matchId, timeStamp }, res] = yield [
      call(ContestServices.fetchMatchId, payload),
      call(ContestServices.fetchMatchQuestions, payload),
    ]

    const { questions } = res

    const defaultAnswers = questions.map((q) => ({
      ...pick(q, ['questionId', 'questionType']),
      answer: null,
    }))

    const matchAnswersHistory = storage(`match${matchId}`)

    if (matchAnswersHistory) {
      matchAnswersHistory.forEach((qh) => {
        if (qh.answer) {
          const index = questions.findIndex(
            (mq) => mq.questionId === qh.questionId && mq.questionType === qh.questionType,
          )

          if (index !== -1) {
            questions[index].answer = qh.answer
            defaultAnswers[index].answer = qh.answer
          }
        }
      })
    }

    yield [
      put({
        type: 'setMatchId',
        payload: matchId,
      }),
      put({
        type: 'setMatchQuestions',
        payload: questions,
      }),
      put({
        type: 'setMatchQuestionAnswers',
        payload: defaultAnswers,
      }),
      put({
        type: 'setMatchTimeStamp',
        payload: timeStamp,
      }),
    ]
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
    transformer: (payload) => payload || defaultFilter,
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
  setParticipating: generateReducer({
    attributeName: 'participating',
    transformer: (payload) => !!payload,
    defaultState,
  }),
  setParticipated: generateReducer({
    attributeName: 'participated',
    transformer: (payload) => !!payload,
    defaultState,
  }),
  setMatchingStatus: generateReducer({
    attributeName: 'matchingStatus',
    transformer: (payload) => payload || MatchingStatus.IDLE,
    defaultState,
  }),
  setReadyArr: generateReducer({
    attributeName: 'readyArr',
    transformer: defaultArrayTransformer,
    defaultState,
  }),
  setChannelId: generateReducer({
    attributeName: 'channelId',
    transformer: (payload) => payload || null,
    defaultState,
  }),
  setUserIndex: generateReducer({
    attributeName: 'userIndex',
    transformer: (payload) => payload || 0,
    defaultState,
  }),
  setMatchId: generateReducer({
    attributeName: 'matchId',
    transformer: (payload) => payload || null,
    defaultState,
  }),
  setMatchQuestions: generateReducer({
    attributeName: 'matchQuestions',
    transformer: defaultArrayTransformer,
    defaultState,
  }),
  setMatchQuestionAnswers: generateReducer({
    attributeName: 'matchQuestionAnswers',
    defaultArrayTransformer,
    defaultState,
  }),
  setMatchTimeStamp: generateReducer({
    attributeName: 'matchTimeStamp',
    transformer: (payload) => payload || Date.now(),
    defaultState,
  }),
  setSelectedQuestions: generateReducer({
    attributeName: 'selectedQuestions',
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
