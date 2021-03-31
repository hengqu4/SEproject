import * as FileServices from '@/services/file'
import generateEffect from '@/utils/generateEffect'
import generateReducer, {
    defaultArrayTransformer,
    defaultObjectTransformer,
} from '@/utils/generateReducer'
import { yellow } from 'chalk'

const defaultState = {
  fileList: [],
}

const effects = {
  fetchFileList: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(FileServices.fetchFileList, payload)

    yield put({
      type: 'setFileList',
      payload: res,
    })
  }),
  addFile: generateEffect(function* ({ payload }, { call, put }) {
    yield call(FileServices.addFile, payload)
    const res = yield call(FileServices.fetchFileList, payload)

    yield put({
      type: 'setFileList',
      payload: res,
    })
  }),
  getFile: generateEffect(function* ({ payload }, { call }) {
    yield call(FileServices.getFile, payload)
  }),
  modifyInfo: generateEffect(function* ({ payload }, { call, put }) {
    yield call(FileServices.modifyInfo, payload)
    const res = yield call(FileServices.fetchFileList, payload)

    yield put({
      type: 'setFileList',
      payload: res,
    })
  }),
  deleteFile: generateEffect(function* ({ payload }, { call, put }) {
    yield call(FileServices.deleteFile, payload)
    const res = yield call(FileServices.fetchFileList, payload)
    
    yield put({
      type: 'setFileList',
      payload: res,
    })
  })
}

const reducers = {
  setFileList: generateReducer({
    attributeName: 'fileList',
    transformer: defaultArrayTransformer,
    defaultState,
  })
}

export default {
  namespace: 'file',
  state: defaultState,
  effects,
  reducers,
}