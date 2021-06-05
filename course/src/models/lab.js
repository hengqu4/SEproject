import * as LabServices from '@/services/lab'
import generateEffect from '@/utils/generateEffect'
import generateReducer, {
  defaultArrayTransformer,
  defaultObjectTransformer,
} from '@/utils/generateReducer'

const defaultPublishLab = {
  caseId: -1,
  courseId: -1,
  courseCaseId: -1,
  caseStartTimeStamp: null,
  caseEndTimeStamp: null,
  experimentCaseDescription: null,
  experimentName:null,
  experimentCaseName: null,

  submissionUploader: -1,
  submissionFileToken: null,
  submissionTimestamp: null,
  submissionScore: -1,
  submissionComments: null,
  submissionIsPublic: false,
  submissionCaseId: 2,
}

const defaultLabMark = {
  courseCaseId: -1,
  submissionCaseId: -1,
  submissionComments: null,
  submissionFileToken: null,
  submissionIsPublic: false,
  submissionScore: -1,
  submissionTimestamp: null,
  submissionUploader: -1
}

const defaultState = {
  isSuccess: false,
  allPendingList: [],
  newPublishLab: defaultPublishLab,
  newLabMark: defaultLabMark,
  allLabCaseList: [],
  labCaseList: [],
  labStatistics: {},
  mySubmissionList:[],
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

  publishLabCase: generateEffect(function* ({ payload }, { call }) {
    yield call(LabServices.publishLabCase, payload)
  }),
  deleteLabCase: generateEffect(function* ({ payload }, { call }) {
    yield call(LabServices.deleteLabCase, payload)
  }),
  createLabCase: generateEffect(function* ({ payload }, { call }) {
    yield call(LabServices.createLabCase, payload)
  }),
  submitLabCase: generateEffect(function* ({ payload }, { call }) {
    yield call(LabServices.submitLabCase, payload)
  }),
  fetchAllLabCase: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(LabServices.fetchAllLabCase, payload)

    yield put({
      type: 'setAllLabCaseList',
      payload: res.data,
    })

    yield put({
      type: 'setIsSuccess',
      payload: res.isSuccess,
    })
    yield put({
      type: 'fetchLabStatistics',
      payload: res.data[0].courseCaseId,
    })
  }),
  
  fetchMySubmissionList: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(LabServices.fetchMySubmissionList, payload)

    yield put({
      type: 'setMySubmissionList',
      payload: res.data,
    })

    yield put({
      type: 'setIsSuccess',
      payload: res.isSuccess,
    })
  }),
  fetchMySubmission: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(LabServices.fetchMySubmission, payload)

    yield put({
      type: 'setPendingList',
      payload: res.data,
    })

    yield put({
      type: 'setIsSuccess',
      payload: res.isSuccess,
    })
  }),

  fetchLabCase: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(LabServices.fetchLabCase, payload)

    yield put({
      type: 'setLabCaseList',
      payload: res.data,
    })

    yield put({
      type: 'setIsSuccess',
      payload: res.isSuccess,
    })
  }),

  remarkSubmission: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(LabServices.remarkSubmission, payload)

    yield put({
      type: 'setIsSuccess',
      payload: res.isSuccess,
    })
  }),
  markSubmission: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(LabServices.markSubmission, payload)
    
    yield put({
      type: 'setIsSuccess',
      payload: res.isSuccess,
    })
  }),
  fetchLabStatistics: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(LabServices.fetchLabStatistics, payload)
    yield put({
      type: 'setIsSuccess',
      payload: res.isSuccess,
    })
    yield put({
      type: 'setLabStatistics',
      payload: res.data,
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
    transformer: (payload) => {
      return payload || defaultPublishLab
    },
    defaultState,
  }),
  setAllLabCaseList: generateReducer({
    attributeName: 'allLabCaseList',
    transformer: defaultArrayTransformer,
    defaultState,
  }),
  setLabStatistics: generateReducer({
    attributeName: 'labStatistics',
    transformer: defaultObjectTransformer,
    defaultState,
  }),
  setLabCaseList: generateReducer({
    attributeName: 'labCaseList',
    transformer: defaultArrayTransformer,
  }),
  setMySubmissionList: generateReducer({
    attributeName: 'mySubmissionList',
    transformer: defaultArrayTransformer,
  }),
}

export default {
  namespace: 'lab',
  state: defaultState,
  effects,
  reducers,
}
