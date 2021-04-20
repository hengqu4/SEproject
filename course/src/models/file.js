import * as FileServices from '@/services/file'
import generateEffect from '@/utils/generateEffect'
import generateReducer, {
    defaultArrayTransformer,
    defaultObjectTransformer,
} from '@/utils/generateReducer'
import { yellow } from 'chalk'

const defaultState = {
  fileList: [],
  url: '',
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
    const res = yield call(FileServices.addFile, payload)
    console.log('2nd url', res.FILE_PUT_URL)
    yield put({
      type: 'setUrl',
      payload: res.FILE_PUT_URL,
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
  }),
  setUrl: generateReducer({
    attributeName: 'url',
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