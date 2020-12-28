import * as LecServices from '@/services/lecture'
import generateEffect from '@/utils/generateEffect'
import generateReducer, {
  defaultArrayTransformer,
  defaultObjectTransformer,
} from '@/utils/generateReducer'

const defaultLecInfo = {
  courseChapterId: 0,
  courseChapterTitle: null,
  courseChapterMoocLink: null,
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
  }),
  deleteLecInfo: generateEffect(function* ({ payload }, { call, put }) {
    yield call(LecServices.deleteLecInfo, payload)
    const res = yield call(LecServices.fetchLecList, payload)

    yield put({
      type: 'setLecList',
      payload: res,
    })
  }),
}

const reducers = {
  setLecList: generateReducer({
    attributeName: 'lecList',
    transformer: defaultArrayTransformer,
    defaultState,
  })
}

export default {
  namespace: 'lecture',
  state: defaultState,
  effects,
  reducers,
}