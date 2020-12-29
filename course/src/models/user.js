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
          avatar: {},
          character: action.payload.data.character,
        }
      }
      return { ...state, currentUser: currentUser || {} }
    },

    // changeNotifyCount(
    //   state = {
    //     currentUser: {},
    //   },
    //   action,
    // ) {
    //   console.log('!!!!!4')
    //   return {
    //     ...state,
    //     currentUser: {
    //       ...state.currentUser,
    //       notifyCount: action.payload.totalCount,
    //       unreadCount: action.payload.unreadCount,
    //     },
    //   }
    // },
  },
}
export default UserModel

// import { queryCurrent, query as queryUsers } from '@/services/user'

// const UserModel = {
//   namespace: 'user',
//   state: {
//     currentUser: {},
//   },
//   effects: {
//     *fetchCurrent(_, { call, put }) {
//       const response = yield call(queryCurrent)
//       console.log('!!!!!!!')
//       console.log(response)
//       yield put({
//         type: 'saveCurrentUser',
//         payload: response,
//       })
//     },
//   },
//   reducers: {
//     saveCurrentUser(state, action) {
//       let currentUser = {
//         name: action.payload.data.realname,
//         avatar: {},
//       }
//       return { ...state, currentUser: currentUser || {} }
//     },
//   },
// }
// export default UserModel