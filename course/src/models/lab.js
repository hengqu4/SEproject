import * as LabServices from '@/services/lab'
import generateEffect from '@/utils/generateEffect'
import generateReducer, {
  defaultArrayTransformer,
  defaultObjectTransformer,
} from '@/utils/generateReducer'

const defaultPublishLab = {
  case_id: -1,
  course_id: -1,
  case_start_timestamp: null,
  case_end_timestamp: null,
  course_case_id: -1,
}

const defaultState = {
  isSuccess: false,
  allPendingList: [],
  newPublishLab: defaultPublishLab,
}

const effects = {
  fetchAllStudentReport: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(LabServices.fetchAllStudentReport, payload)

    yield put({
      type: 'setPendingList',
      payload: res.data,
    })

    yield put({
      type: 'setIsSuccess',
      payload: res.isSuccess,
    })
  }),
  publishLabCase: generateEffect(function* (_, { call, put, select }) {
    const newPublishLab = yield select((state) => state.lab.newPublishLab)

    yield call(LabServices.publishLab, newPublishLab.payload)

    yield put({
      type: 'setPublishLab',
    })
  }),
}

const reducers = {
  setPendingList: generateReducer({
    attributeName: 'allPendingList',
    transformer: defaultArrayTransformer,
    defaultState,
  }),
  setIsSuccess: generateReducer({
    attributeName: 'isSuccess',
    transformer: defaultObjectTransformer,
    defaultState,
  }),
  setPublishLab: generateReducer({
    attributeName: 'newPublishLab',
    transformer: (payload) => payload || defaultPublishLab,
    defaultState,
  }),
}

export default {
  namespace: 'lab',
  state: defaultState,
  effects,
  reducers,
}
