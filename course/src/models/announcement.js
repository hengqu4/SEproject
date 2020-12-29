import * as AncServices from '@/services/announcement'
import generateEffect from '@/utils/generateEffect'
import generateReducer, {
    defaultArrayTransformer,
    defaultObjectTransformer,
} from '@/utils/generateReducer'

const defaultAncInfo = {
  announcementTitle: "是",
  announcementContents: "是",
  announcementIsPinned: true,
}

const defaultState = {
  ancList: [],
  ancInfo: defaultAncInfo,
}

const effects = {
  fetchAncList: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(AncServices.fetchAncList, payload)

    yield put({
      type: 'setAncList',
      payload: res,
    })
  }),
  addAncInfo: generateEffect(function* ({ payload }, { call, put }) {
    yield call(AncServices.addAncInfo, payload)
    const res = yield call(AncServices.fetchAncList, payload)

    yield put({
      type: 'setAncList',
      payload: res,
    })
  }),
  deleteAncInfo: generateEffect(function* ({ payload }, { call, put }) {
    yield call(AncServices.deleteAncInfo, payload)
    const res = yield call(AncServices.fetchAncList, payload)

    yield put({
      type: 'setAncList',
      payload: res,
    })
  }),
  modifyAncInfo: generateEffect(function* ({ payload }, { call }) {
    yield call(AncServices.modifyAncInfo, payload)
    const res = yield call(AncServices.fetchAncList, payload)

    yield put({
      type: 'setAncList',
      payload: res,
    })
  }),
  fetchAncInfo: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(AncServices.fetchAncInfo, payload)

    yield put({
      type: 'setAncInfo',
      payload: res,
    })
  })
}

const reducers = {
  setAncList: generateReducer({
    attributeName: 'ancList',
    transformer: defaultArrayTransformer,
    defaultState,
  }),
  setAncInfo: generateReducer({
    attributeName: 'ancInfo',
    transformer: (payload) => payload || defaultAncInfo,
    defaultState,
  }),
  // setHwInfo(state, action) {
  //   let hwInfo = {}
  //   if (action.payload) {
  //     hwInfo = {
  //       title: action.payload.data.realname,
  //       des: action.payload.data.userId,
  //       startTime: {},
  //     }
  //   }
  //   return { ...state, currentUser: currentUser || {} }
}

export default {
  namespace: 'announcement',
  state: defaultState,
  effects,
  reducers,
}