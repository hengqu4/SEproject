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

const defaultHwGradeInfo = {
  homeworkIsGradeAvailableToStudents: false,
  homeworkScore: 0,
  homeworkTeachersComments: ""
}

const defaultState = {
  hwList: [],
  hwInfo: {},
  hwGradeInfo: {},
  hwFileList: [],
  hwFile: {},
  fileUrl: ''
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
  }),
  fetchHwFile: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(HwServices.fetchHwFile, payload)

    yield put({
      type: 'setHwFile',
      payload: res,
    })
  }),
  setGradeToDefault: generateEffect(function* ({ _ }, { call, put }){
    put({
      type: 'setGradeToDefault',
    })
  }),
  putHomeworkName: generateEffect(function* ({ payload }, { call, put }){
    const res = yield call(HwServices.putHomeworkName, payload)
    yield put({
      type: 'setFileUrl',
      payload: res.FILE_PUT_URL
    })
  }),
  uploadHomeworkFile: generateEffect(function* ({ payload }, { call }){
    const res = yield call(HwServices.uploadHomeworkFile, payload)
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
    attributeName: 'hwGradeInfo',
    transformer: (payload) => payload || defaultHwGradeInfo,
    defaultState,
  }),
  setHwFileList: generateReducer({
    attributeName: 'hwFileList',
    transformer: defaultArrayTransformer,
    defaultState,
  }),
  setHwFile: generateReducer({
    attributeName: 'hwFile',
    transformer: defaultArrayTransformer,
    defaultState,
  }),
  setGradeToDefault: generateReducer({
    attributeName: 'hwGradeInfo',
    transformer: () => defaultHwGradeInfo,
    defaultState
  }),
  setFileUrl: generateReducer({
    attributeName: 'fileUrl',
    transformer: defaultObjectTransformer,
    defaultState
  })
}

export default {
  namespace: 'homework',
  state: defaultState,
  effects,
  reducers,
}