import { userAccountRegister } from './service'

const Model = {
  namespace: 'singleimport',
  state: {
    status: undefined,
  },
  effects: {
    *submit({ payload }, { call, put }) {
      const actualPayload = { ...payload, avatar: payload.avatar || {} }
      // TODO: to be removed in release version
      // eslint-disable-next-line no-console
      console.log('Received values of form: ', actualPayload)
      console.log(1)
      const response = yield call(userAccountRegister, actualPayload)
      console.log(2)
      yield put({
        type: 'registerHandle',
        payload: response,
      })
      console.log(3)
      console.log(response)
      return response
    },
  },
  reducers: {
    registerHandle(state, { payload }) {
      console.log({ payload })
      console.log({ ...state, status: payload.isSuccess })
      return { ...state, status: payload.isSuccess }
    },
  },
}
export default Model
