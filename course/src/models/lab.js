import * as LabServices from '@/services/lab'
import generateEffect from '@/utils/generateEffect'
import generateReducer, {
  defaultArrayTransformer,
  defaultObjectTransformer,
} from '@/utils/generateReducer'

const defaultState = {
  isSuccess: false,
  allPendingList: [],
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
}

export default {
  namespace: 'lab',
  state: defaultState,
  effects,
  reducers,
}
