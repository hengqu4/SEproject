import * as HwServices from '@/services/homework'
import generateEffect from '@/utils/generateEffect'
import generateReducer, {
    defaultArrayTransformer,
    defaultObjectTransformer,
} from '@/utils/generateReducer'

const defaultHwInfo = {
  homeworkTitle: "",
  homeworkDescription: "",
  startTime: "",
  endTime: "",
}

const defaultState = {
  hwList: [],
  hwInfo: {},
  grade: 0,
  hwFileList: [],
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
  modifyHwInfo: generateEffect(function* ({ payload }, { call, put }) {
    yield call(HwServices.modifyHwInfo, payload)
    const res = yield call(HwServices.fetchHwList, payload)

    yield put({
      type: 'setHwList',
      payload: res,
    })
  }),
  fetchHwInfo: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(HwServices.fetchHwInfo, payload)

    yield put({
      type: 'setHwInfo',
      payload: res,
    })
  }),
  fetchGrade: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(HwServices.fetchGrade, payload)

    yield put({
      type: 'setGrade',
      payload: res,
    })
  }),
  fetchHwFileList: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(HwServices.fetchHwFileList, payload)

    yield put({
      type: 'setHwFileList',
      payload: res,
    })
  }),
  addGrade: generateEffect(function* ({ payload }, { call }) {
    yield call(HwServices.addGrade, payload)
  })
}

const reducers = {
  setHwList: generateReducer({
    attributeName: 'hwList',
    transformer: defaultArrayTransformer,
    defaultState,
  }),
  setHwInfo: generateReducer({
    attributeName: 'hwInfo',
    transformer: (payload) => payload || defaultHwInfo,
    defaultState,
  }),
  setGrade: generateReducer({
    attributeName: 'grade',
    transformer: defaultArrayTransformer,
    defaultState,
  }),
  setHwFileList: generateReducer({
    attributeName: 'hwFileList',
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