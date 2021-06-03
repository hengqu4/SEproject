import * as CourseServices from '@/services/course'
import { Roles } from '@/utils/constant'
import generateEffect from '@/utils/generateEffect'
import generateReducer, { defaultArrayTransformer } from '@/utils/generateReducer'
import { cloneDeep } from 'lodash'
import moment from 'moment'

const defaultCourseInfo = {
  courseCreatorSchoolId: 'tongji',
  courseId: -1,
  courseName: null,
  courseCredit: null,
  courseStudyTimeNeeded: null,
  courseDescription: null,
  courseType: '必修',
  courseStartTime: null,
  courseEndTime: null,
  courseAvatar: false,
}

const defaultState = {
  currentCourseInfo: defaultCourseInfo,
  courseList: [],
  courseTeachList: [], // course-teach的list
  courseStudentMap: new Map(),
}

const courseEffects = {
  getAllCourses: generateEffect(function* (_, { call, put, select }) {
    const { data: courseList } = yield call(CourseServices.fetchAllCourseInfo)
    yield put({
      type: 'setCourseList',
      payload: courseList,
    })

    const userCharacter = yield select((state) => state.user.currentUser.character)
    console.log('userCharacter: ', userCharacter)
    if (courseList?.length) {
      const [{ courseId }] = courseList
      yield put({
        type:
          userCharacter === Roles.STUDENT ? 'getCurrentCourseInfoStudent' : 'getCurrentCourseInfo',
        payload: userCharacter === Roles.STUDENT ? { courseId } : 0,
      })
    }
  }),

  // FIXME: can't get the courseList using students' account
  // 获取当前课程信息
  getCurrentCourseInfo: generateEffect(function* ({ payload }, { put, select }) {
    const courseList = yield select((state) => state.Course.courseList)
    const currentCourse = courseList[payload]

    yield put({
      type: 'setCurrentCourse',
      payload: currentCourse,
    })
  }),
  getCurrentCourseInfoStudent: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(CourseServices.fetchOneCourseInfo, payload)

    yield put({
      type: 'setCurrentCourse',
      payload: res.data,
    })
  }),

  // 创建新课程
  createNewCourse: generateEffect(function* ({ payload }, { call, put }) {
    const newCourseInfoCopy = {
      ...cloneDeep(payload),
      course_creator_school_id: 'tongji',
      course_start_time: moment(payload.course_time[0]).format(),
      course_end_time: moment(payload.course_time[1]).format(),
      course_avatar: 'fake',
      course_credit: parseInt(payload.course_credit, 10),
      course_study_time_needed: parseInt(payload.course_study_time_needed, 10),
    }
    delete newCourseInfoCopy.course_time

    const newCourseInfo = yield call(CourseServices.publishCourse, newCourseInfoCopy)

    yield call(CourseServices.publishGradeWeight, newCourseInfo)

    const res = yield call(CourseServices.fetchAllCourseInfo)

    yield put({
      type: 'setCourseList',
      payload: res.data,
    })
  }),

  // 编辑课程信息
  updateSomeCourse: generateEffect(function* ({ payload, successHandler }, { call, put }) {
    const newValues = cloneDeep(payload)
    const oldKeys = Object.keys(payload)
    for (let i = 0; i < oldKeys.length; i++) {
      const key = oldKeys[i]
      if (newValues[key] === undefined || newValues[key] === null) {
        delete newValues[key]
      } else if (
        key.toString() === 'courseId' ||
        key.toString() === 'courseCredit' ||
        key.toString() === 'courseStudyTimeNeeded'
      ) {
        newValues[key] = parseInt(newValues[key], 10)
      } else if (key.toString() === 'courseTime') {
        newValues.courseStartTime = moment(newValues.courseTime[0]).format()
        newValues.courseEndTime = moment(newValues.courseTime[1]).format()
        delete newValues[key]
      }
    }
    try {
      yield call(CourseServices.updateCourseInfo, newValues)
      successHandler()
    } catch (error) {
      console.log(error)
    }

    const res = yield call(CourseServices.fetchAllCourseInfo)

    yield put({
      type: 'setCourseList',
      payload: res.data,
    })
  }),

  // 删除课程信息
  deleteCourseInfo: generateEffect(function* ({ payload }, { call, put }) {
    yield call(CourseServices.deleteCourseInfo, payload)

    const res = yield call(CourseServices.fetchAllCourseInfo)

    yield put({
      type: 'setCourseList',
      payload: res.data,
    })
  }),

  getCourseListAndSetFirstCourseInfo: generateEffect(function* (_, { call, put, select }){
    const res = yield call(CourseServices.fetchAllCourseInfo)
    yield put({
      type: 'setCourseList',
      payload: res.data
    })

    const courseList = yield select((state) => state.Course.courseList)
    const currentCourse = courseList[0]
    yield put({
      type: 'setCurrentCourse',
      payload: currentCourse,
    })
  })

}

const courseTeachEffects = {
  // 获取全部绑定关系列表
  getAllCourseTeach: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(CourseServices.fetchAllCourseTeach)

    yield put({
      type: 'setCourseTeachList',
      payload: res.data,
    })
  }),
  // 新建一个课程绑定
  createNewCourseTeach: generateEffect(function* (
    { payload, errorHandler, successHandler },
    { call, put },
  ) {
    const { courseId, teacherId } = payload
    const newCourseTeachCopy = cloneDeep({
      course_id: courseId,
      teacher_id: teacherId,
    })

    try {
      const resPublish = yield call(CourseServices.publishCourseTeach, newCourseTeachCopy)
      successHandler(resPublish)
    } catch (e) {
      errorHandler(e)
    }
    const res = yield call(CourseServices.fetchAllCourseTeach)

    yield put({
      type: 'setCourseTeachList',
      payload: res.data,
    })
  }),

  // 删除一个课程绑定
  deleteCourseTeach: generateEffect(function* ({ payload }, { call, put }) {
    yield call(CourseServices.deleteCourseTeach, payload)

    const res = yield call(CourseServices.fetchAllCourseTeach)

    yield put({
      type: 'setCourseTeachList',
      payload: res.data,
    })
  }),
}

const courseStudentEffects = {
  *fetchCourseStudentRelation(_, { call, put }) {
    const res = yield call(CourseServices.fetchStudentsOfAllCourses)
    console.log('effect', res)
    yield put({
      type: 'setCourseStudentMap',
      payload: res.data,
    })
  },
}

const effects = {
  ...courseEffects,
  ...courseTeachEffects,
  ...courseStudentEffects,
}

const reducers = {
  setCourseList: generateReducer({
    attributeName: 'courseList',
    transformer: defaultArrayTransformer,
    defaultState,
  }),

  setCurrentCourse: generateReducer({
    attributeName: 'currentCourseInfo',
    transformer: (payload) => payload || defaultCourseInfo,
    defaultState,
  }),

  setCourseTeachList: generateReducer({
    attributeName: 'courseTeachList',
    transformer: defaultArrayTransformer,
    defaultState,
  }),

  setCourseStudentMap(state, { payload = [] }) {
    const courseMap = new Map()
    payload.forEach((r) => {
      if (courseMap.has(r.courseId)) {
        courseMap.get(r.courseId).push(r)
      } else {
        courseMap.set(r.courseId, [r])
      }
    })
    console.log(courseMap)
    return { ...state, courseStudentMap: courseMap }
  },
}

export default {
  namespace: 'Course',
  state: defaultState,
  effects,
  reducers,
}
