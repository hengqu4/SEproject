import * as GradeServices from './service'
import { pick } from 'lodash'

const initState = {
  studentGradeWeight: {},
  weightPieData: {},
  isReleased: false,
  gradeData: [],
}

for (let i = 0; i < 100; i++) {
  initState.gradeData.push({
    key: i.toString(),
  })
}

const keyDict = {
  assignment: '作业成绩权重',
  attendance: '考勤成绩权重',
  contest: '对抗联系权重',
  exam1: '期中考试权重',
  exam2: '期末考试权重',
  experiment: '实验成绩权重',
}

const Model = {
  namespace: 'teacherDashboard',
  state: initState,
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(GradeServices.fetchStudentGradeWeight, payload)
      console.log(response, '*&*')
      callback(response.data)
      let weightDict = response.data
      let gradeWeightPie = []
      // eslint-disable-next-line no-restricted-syntax
      for (let key in weightDict)
        if (key != 'totalPoint') {
          gradeWeightPie.push({
            x: keyDict[key],
            y: Number(weightDict[key]),
          })
        }
      yield put({
        type: 'save',
        payload: {
          studentGradeWeight: response.data,
          weightPieData: gradeWeightPie,
        },
      })
    },

    *updateWeight({ payload, callback }, { call }) {
      const response = yield call(GradeServices.updateStudentGradeWeight, payload)
      callback()
      let gradeDict = response.data
    },

    *setBonus({ payload, callback }, { call }) {
      const response = yield call(GradeServices.setBonus, payload)
      console.log(response)
      if (callback) callback()
    },

    *getGrade({ payload }, { call, put }) {
      const response = yield call(GradeServices.fetchCourseGrade, pick(payload, ['courseId']))
      let studentMap = payload.studentMap
      let gradeList = response.data
      for (let index in gradeList) {
        gradeList[index]['key'] = gradeList[index]['studentId']
        // TODO: remove this after backend update
        gradeList[index]['totalPoint'] =
          Number(gradeList[index]['totalPoint']) + Number(gradeList[index]['bonusPoint'])
        for (let student of studentMap)
          if (student.studentUserId.toString() == gradeList[index]['studentId'].toString()) {
            gradeList[index]['name'] = student.realname.toString()
            gradeList[index]['m_id'] = student.studentId.toString()
          }
      }

      gradeList.sort((a, b) => {
        if (a.m_id.toString() === '') return 1e8 - b.m_id
        if (b.m_id.toString() === '') return a.m_id - 1e8
        return a.m_id - b.m_id
      })

      console.log(gradeList, '!!')

      yield put({
        type: 'save',
        payload: {
          gradeData: gradeList,
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
