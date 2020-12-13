import * as LabServices from '@/services/lab'
import generateEffect from '@/utils/generateEffect'
import generateReducer, {
  defaultArrayTransformer,
  defaultObjectTransformer,
} from '@/utils/generateReducer'

const defaultState = {
  isSuccess: false,
  allLabList: [],
}

const effects = {
  fetchLabDatabase: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(LabServices.fetchLabDatabase, payload)

    yield put({
      type: 'setLabDatabase',
      payload: res.data,
    })

    yield put({
      tye: 'setIsSuccess',
      payload: res.isSuccess,
    })
  }),
}

const reducers = {
  setLabDatabase: generateReducer({
    attributeName: 'allLabList',
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
  namespace: 'labDatabase',
  state: defaultState,
  effects,
  reducers,
}
