import * as HwServices from '@/services/homework'
import generateEffect from '@/utils/generateEffect'
import generateReducer, {
    defaultArrayTransformer,
    defaultObjectTransformer,
} from '@/utils/generateReducer'

const defaultState = {
  hwList: [],
}

const effects = {
  fetchHwList: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(HwServices.fetchHwList, payload)

    yield put({
      type: 'setHwList',
      payload: res,
    })
  }),
  addHwInfo: generateEffect(function* ({ payload }, { call, put }) {
    yield call(HwServices.addHwInfo, payload)
    const res = yield call(HwServices.fetchHwList, payload)

    yield put({
      type: 'setHwList',
      payload: res,
    })
  }),
  deleteHwInfo: generateEffect(function* ({ payload }, { call, put }) {
    yield call(HwServices.deleteHwInfo, payload)
    const res = yield call(HwServices.fetchHwList, payload)

    yield put({
      type: 'setHwList',
      payload: res,
    })
  }),
}

const reducers = {
  setHwList: generateReducer({
    attributeName: 'hwList',
    transformer: defaultArrayTransformer,
    defaultState,
  })
}

export default {
  namespace: 'homework',
  state: defaultState,
  effects,
  reducers,
}