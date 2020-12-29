import * as LecServices from '@/services/lecture'
import generateEffect from '@/utils/generateEffect'
import generateReducer, {
  defaultArrayTransformer,
  defaultObjectTransformer,
} from '@/utils/generateReducer'

const defaultLecInfo = {
  courseChapterId: 0,
  courseChapterTitle: "",
  courseChapterMoocLink: "",
}

const defaultState = {
  lecInfo: defaultLecInfo,
  lecList: [],
}

const effects = {
  fetchLecList: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(LecServices.fetchLecList, payload)

    yield put({
      type: 'setLecList',
      payload: res,
    })
  }),
  addLecInfo: generateEffect(function* ({ payload }, { call, put }) {
    yield call(LecServices.addLecInfo, payload)
    const res = yield call(LecServices.fetchLecList, payload)

    yield put({
      type: 'setLecList',
      payload: res,
    })
  }),
  deleteLecInfo: generateEffect(function* ({ payload }, { call, put }) {
    yield call(LecServices.deleteLecInfo, payload)
    const res = yield call(LecServices.fetchLecList, payload)

    yield put({
      type: 'setLecList',
      payload: res,
    })
  }),
  modifyLecInfo: generateEffect(function* ({ payload }, { call }) {
    yield call(LecServices.modifyLecInfo, payload)
    const res = yield call(LecServices.fetchLecList, payload)

    yield put({
      type: 'setLecList',
      payload: res,
    })
  }),
  fetchLecInfo: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(LecServices.fetchLecInfo, payload)

    yield put({
      type: 'setLecInfo',
      payload: res,
    })
  })
}

const reducers = {
  setLecList: generateReducer({
    attributeName: 'lecList',
    transformer: defaultArrayTransformer,
    defaultState,
  }),
  setLecInfo: generateReducer({
    attributeName: 'lecInfo',
    transformer: (payload) => payload || defaultLecInfo,
    defaultState,
  })
}

export default {
  namespace: 'lecture',
  state: defaultState,
  effects,
  reducers,
}