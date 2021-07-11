import { queryCurrent, query as queryUsers } from '@/services/user'

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    *fetch(_, { call, put }) {
      console.log('!!!!!1')
      const response = yield call(queryUsers)
      yield put({
        type: 'save',
        payload: response,
      })
    },

    *fetchCurrent(_, { call, put }) {
      console.log('!!!!!2')
      const response = yield call(queryCurrent)
      console.log(response)
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      })
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      console.log('!!!!!3')
      let currentUser = {}
      if (action.payload) {
        currentUser = {
          name: action.payload.data.realname,
          id: action.payload.data.userId,
          avatar: `https://source.boringavatars.com/beam/120/${action.payload.data.realname}?colors=BDA0A2,FFE6DB,D1EAEE,CBC8B5,EFB0A9`,
          character: action.payload.data.character,
        }
      }
      return { ...state, currentUser: currentUser || {} }
    },
  },
}
export default UserModel

