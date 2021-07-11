import * as GradeServices from './service'

const initState = {
  studentGrade: [],
  isReleased: false,
}

const keyDict = {
  assignmentPoint: '作业成绩',
  attendancePoint: '考勤成绩',
  bonusPoint: '额外加分',
  contestPoint: '对抗成绩',
  exam1Point: '期中成绩',
  exam2Point: '期末成绩',
  experimentPoint: '实验成绩',
}

const Model = {
  namespace: 'studentDashboard',
  state: initState,
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(GradeServices.fetchStudentGrade, payload)
      console.log(response.isSuccess, '*&*')
      let gradeDict = response.data
      let studentGrade = []
      for (let key in gradeDict)
        if (key != 'totalPoint') {
          studentGrade.push({
            x: keyDict[key],
            y: Number(gradeDict[key]) + 0.01,
          })
        }
      yield put({
        type: 'save',
        payload: {
          studentGrade: studentGrade,
          isReleased: response.isSuccess
        },
      })
    },

    *fetchSalesData({ payload }, { call, put }) {
      const response = yield call(GradeServices.fetchStudentGrade, payload)
      console.log('bbbbb', response.data)
      let gradeDict = response.data
      let studentGrade = []
      for (let key in gradeDict)
        if (key != 'totalPoint') {
          studentGrade.push({
            x: keyDict[key],
            y: Number(gradeDict[key]) + 0.01,
          })
        }
      yield put({
        type: 'save',
        payload: {
          studentGrade: studentGrade,
        },
      })
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    },

    clear() {
      return initState
    },
  },
}
export default Model
