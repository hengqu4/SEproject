import * as MatchHistoryServices from '@/services/match-history'
import cloneDeep from 'lodash/cloneDeep'

const defaultState = {
  studentMatchHistory: [],
  studentMatchDetail: {},
}

const MatchHistoryModel = {
  namespace: 'MatchHistory',
  state: defaultState,
  effects: {
    *fetchStudentMatchHistory({ payload, onSuccess, onError, onFinish }, { call, put }) {
      try {
        const res = yield call(MatchHistoryServices.fetchStudentMatchHistory, payload)

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
        const res = yield call(MatchHistoryServices.fetchStudentMatchDetail, payload)

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
  },
}

export default MatchHistoryModel
