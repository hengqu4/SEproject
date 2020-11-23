import * as ContestServices from '@/services/contest'
import cloneDeep from 'lodash/cloneDeep'

const defaultState = {
  studentMatchHistory: [],
  studentMatchDetail: {},
  currentContest: {},
}

const MatchModel = {
  namespace: 'Contest',
  state: defaultState,
  effects: {
    *fetchStudentMatchHistory({ payload, onSuccess, onError, onFinish }, { call, put }) {
      try {
        const res = yield call(ContestServices.fetchStudentMatchHistory, payload)

        yield put({
          type: 'setStudentMatchHistory',
          payload: res,
        })

        onSuccess && onSuccess()
      } catch (err) {
        onError && onError(err)
      } finally {
        onFinish && onFinish()
      }
    },
    *fetchStudentMatchDetail({ payload, onSuccess, onError, onFinish }, { call, put }) {
      try {
        const res = yield call(ContestServices.fetchStudentMatchDetail, payload)

        yield put({
          type: 'setStudentMatchDetail',
          payload: res,
        })

        onSuccess && onSuccess()
      } catch (err) {
        onError && onError(err)
      } finally {
        onFinish && onFinish()
      }
    },
    *fetchCurrentContest({ payload, onSuccess, onError, onFinish }, { call, put }) {
      try {
        const res = yield call(ContestServices.fetchCurrentContest, payload)

        yield put({
          type: 'setCurrentContest',
          payload: res,
        })

        onSuccess && onSuccess()
      } catch (err) {
        onError && onError(err)
      } finally {
        onFinish && onFinish()
      }
    },
  },
  reducers: {
    setStudentMatchHistory: (state, { payload }) => {
      const newState = cloneDeep(state) || defaultState

      return {
        ...newState,
        studentMatchHistory: payload,
      }
    },
    setStudentMatchDetail: (state, { payload }) => {
      const newState = cloneDeep(state) || defaultState

      return {
        ...newState,
        studentMatchDetail: payload,
      }
    },
    setCurrentContest: (state, { payload }) => {
      const newState = cloneDeep(state) || defaultState

      return {
        ...newState,
        currentContest: payload,
      }
    },
  },
}

export default MatchModel
