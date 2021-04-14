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
  questions: [],
}

const defaultPagination = {
  total: 0,
  pageNum: 1,
  pageSize: 10,
}

const defaultFilter = {
  questionType: 0,
}

const defaultState = {
  avatar: 'www.baidu.com',
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
  fetchCurrentContest: generateEffect(function* ({ isTeacher, payload }, { call, put }) {
    const res = yield call(ContestServices.fetchCurrentContest, payload)

    console.log('fetchCurrentContest: ', res)

    const { contest, bIsParticipated, bIsParticipating } = res

    if (isTeacher && contest?.contestId) {
      const { questions } = yield call(ContestServices.fetchContestQuestions, {
        contestId: contest.contestId,
        userId: payload.userId,
      })

      yield put({
        type: 'setCurrentContest',
        payload: {
          ...contest,
          questions,
        },
      })
    } else {
      yield put({
        type: 'setCurrentContest',
        payload: contest,
      })
    }

    if (bIsParticipated !== undefined) {
      yield put({
        type: 'setParticipated',
        payload: bIsParticipated,
      })
    }

    if (bIsParticipating !== undefined) {
      yield put({
        type: 'setParticipating',
        payload: bIsParticipating,
      })
    }
  }),
  createContest: generateEffect(function* (_, { call, put, select }) {
    const newContest = yield select((state) => state.Contest.newContest)
    const selectedQuestions = yield select((state) => state.Contest.selectedQuestions)

    const courseId = yield select((state) => state.Course.currentCourseInfo.courseId)
    const publisherId = yield select((state) => state.user.currentUser.id)

    const newContestCopy = cloneDeep(newContest)
    newContestCopy.questions = selectedQuestions.map((q) => pick(q, ['questionType', 'questionId']))

    const payload = {
      contest: {
        ...newContestCopy,
        courseId,
        publisherId,
      },
    }

    yield call(ContestServices.createContest, payload)

    yield put({
      type: 'fetchCurrentContest',
      isTeacher: true,
      payload: {
        courseId,
        userId: publisherId,
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
  fetchAllContests: generateEffect(function* ({ payload }, { call, put }) {
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
  startMatching: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(ContestServices.startMatching, payload)

    yield put({
      type: 'setChannelId',
      payload: res.channelId,
    })
  }),
  cancelMatching: generateEffect(function* ({ payload }, { call }) {
    yield call(ContestServices.cancelMatching, payload)
  }),
  matchingComplete: generateEffect(function* ({ payload }, { call, put }) {
    yield put({
      type: 'setMatchingStatus',
      payload: MatchingStatus.WAITING_FOR_READY,
    })

    const res = yield call(ContestServices.fetchMatchingIndex, payload)

    console.log('matchingComplete: ', res)

    yield put({
      type: 'setUserIndex',
      payload: res.index,
    })
  }),
  readyForMatch: generateEffect(function* ({ payload }, { call }) {
    yield call(ContestServices.readyMatch, payload)
  }),
  fetchChannelId: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(ContestServices.fetchChannelId, payload)

    const { channelId } = res

    yield put({
      type: 'setChannelId',
      payload: channelId,
    })
  }),
  connectToMatch: generateEffect(function* ({ payload }, { call, put, select }) {
    const contestId = yield select((s) => s.Contest.currentContest.contestId)

    const [{ timeStamp }, res] = yield [
      call(ContestServices.fetchMatchId, payload),
      call(ContestServices.fetchMatchQuestions, payload),
    ]

    const { questions } = res

    const defaultAnswers = questions.map((q) => ({
      ...pick(q, ['questionId', 'questionType']),
      answer: '',
    }))

    const matchAnswersHistory = storage(`contest${contestId}`)

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
      put({
        type: 'setMatchingStatus',
        payload: MatchingStatus.ANSWERING,
      }),
    ]
  }),
  fetchRandomQuestions: generateEffect(function* ({ payload }, { call, put }) {
    const { questions } = yield call(ContestServices.fetchRandomQuestions, payload)

    yield put({
      type: 'setSelectedQuestions',
      payload: questions,
    })
  }),
  submitMatchAnswers: generateEffect(function* ({ payload }, { call, put, select }) {
    yield call(ContestServices.submitAnswers, payload)

    const contestId = yield select((s) => s.Contest.currentContest.contestId)

    storage.remove(`contest${contestId}`)
  }),
  clearMatchStatus: generateEffect(function* (_, { call, put, select }) {
    const [userId, courseId] = yield [
      select((s) => s.user.currentUser.id),
      select((s) => s.Course.currentCourseInfo.courseId),
    ]

    const {
      contest,
      bIsParticipated,
      bIsParticipating,
    } = yield call(ContestServices.fetchCurrentContest, { userId, courseId })

    yield [
      put({
        type: 'setCurrentContest',
        payload: contest,
      }),
      put({
        type: 'setParticipated',
        payload: bIsParticipated,
      }),
      put({
        type: 'setParticipating',
        payload: bIsParticipating,
      }),
    ]

    yield put({
      type: 'setMatchingStatus',
    })

    yield put({
      type: 'setChannelId',
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
    transformer: (payload) => payload || defaultFilter,
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
    transformer: (payload) => payload ?? -1,
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
