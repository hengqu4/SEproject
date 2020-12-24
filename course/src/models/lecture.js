import * as LecServices from '@/services/lecture'
import generateEffect from '@/utils/generateEffect'
import generateReducer, {
  defaultArrayTransformer,
  defaultObjectTransformer,
} from '@/utils/generateReducer'

const defaultLecList = {
  courseChapterId: 0,
  courseChapterTitle: null,
  courseChapterMoocLink: null,
}

const defaultState = {
  lecList: defaultLecList,
}

const effects = {
  fetchLecList: generateEffect(function* ({ payload }, { call, put }) {
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
    transformer: (payload) => {
      return payload || defaultLecList
    },
    defaultState,
  })
}

export default {
  namespace: 'lecture',
  state: defaultState,
  effects,
  reducers,
}