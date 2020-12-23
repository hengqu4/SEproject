import * as CourseServices from '@/services/course'
import generateEffect from '@/utils/generateEffect'
import generateReducer, {
  defaultArrayTransformer,
  defaultObjectTransformer,
} from '@/utils/generateReducer'
import { cloneDeep } from 'lodash'

const defaultCourseInfo = {
  courseCreatorSchoolId: 'tongji',
  courseId: 1,
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
  courseTeachList: [], //course-teach的list
}

const effects = {
  //获取全部课程信息
  getAllCourse: generateEffect(function* (_, { call, put }) {
    console.log('开始接受数据')
    const res = yield call(CourseServices.fetchAllCourseInfo)
    // CourseServices.fetchAllCourseInfo()
    //   .then((response) => {
    //     console.log('major333')
    //     console.log(response)
    //     console.log('major333')
    //   })
    //   .catch((error) => {
    //     console.log('error boy')
    //   }),

    console.log(res)
    // console.log(res.data)
    yield put({
      type: 'setCourseList',
      payload: res,
    })
  }),

  //获取当前课程信息
  getCurrentCourseInfo: generateEffect(function* ({ payload }, { call, put, select }) {
    // console.log(payload)
    const courseList = yield select((state) => state.Course.courseList)
    // console.log(courseList)
    const currentCourse = courseList[payload]
    // console.log(currentCourse)
    const res = yield call(CourseServices.fetchOneCourseInfo, currentCourse)

    // console.log(res.data)
    yield put({
      type: 'setCurrentCourse',
      payload: currentCourse,
    })
    // const currentCourseInfo = yield select((state) => state.Course.currentCourseInfo)
    // console.log(currentCourseInfo)
  }),

  //创建新课程
  createNewCourse: generateEffect(function* ({ payload }, { call, put }) {
    const newCourseInfoCopy = cloneDeep(payload)

    newCourseInfoCopy.course_creator_school_id = 'tongji'
    newCourseInfoCopy.course_start_time = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}/.exec(
      newCourseInfoCopy.course_time[0],
    )[0]
    newCourseInfoCopy.course_end_time = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}/.exec(
      newCourseInfoCopy.course_time[1],
    )[0]
    newCourseInfoCopy.course_avatar = 'fake'
    newCourseInfoCopy.course_credit = parseInt(newCourseInfoCopy.course_credit)
    newCourseInfoCopy.course_study_time_needed = parseInt(
      newCourseInfoCopy.course_study_time_needed,
    )
    delete newCourseInfoCopy.course_time

    console.log(newCourseInfoCopy)

    const newCourseInfo = yield call(CourseServices.publishCourse, newCourseInfoCopy)

    console.log(newCourseInfo)
    // res = yield CourseServices.publishCourse(newCourseInfoCopy)
    //   .then((response) => {
    //     console.log(response)
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //   })

    yield call(CourseServices.publishGradeWeight, newCourseInfo)
    const gradeWeight = yield call(CourseServices.fetchGradeWeight, newCourseInfo)
    console.log(gradeWeight)

    const res = yield call(CourseServices.fetchAllCourseInfo)

    yield put({
      type: 'setCourseList',
      payload: res,
    })
  }),

  //编辑课程信息
  updateSomeCourse: generateEffect(function* ({ payload }, { call }) {
    console.log('开始更新数据')
    const newValues = cloneDeep(payload)

    for (var key in newValues) {
      if (newValues[key] === undefined || newValues[key] === null) {
        delete newValues[key]
        continue
      }
      if (
        key.toString() == 'courseID' ||
        key.toString() == 'courseCredit' ||
        key.toString() == 'courseStudyTimeNeeded'
      ) {
        newValues[key] = parseInt(newValues[key])
      } else if (key.toString() == 'courseTime') {
        newValues.courseStartTime = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}/.exec(
          newValues.courseTime[0],
        )
        newValues.courseEndTime = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}/.exec(
          newValues.courseTime[1],
        )
        delete newValues[key]
      }
    }
    console.log(newValues)
    yield call(CourseServices.updateCourseInfo, newValues)
  }),

  //获取全部绑定关系列表
  getAllCourseTeach: generateEffect(function* (_, { call, put }) {
    console.log('开始接受数据')
    const res = yield call(CourseServices.fetchAllCourseTeach)

    console.log(res.data)

    yield put({
      type: 'setCourseTeachList',
      payload: res.data,
    })
  }),

  //新建一个课程绑定
  createNewCourseTeach: generateEffect(function* ({ payload }, { call, put }) {
    const newCourseTeachCopy = cloneDeep(payload)

    newCourseTeachCopy.course_id = parseInt(newCourseTeachCopy.courseID)
    delete newCourseTeachCopy.courseID
    newCourseTeachCopy.teacher_id = parseInt(newCourseTeachCopy.teacherID)
    delete newCourseTeachCopy.teacherID

    // console.log(newCourseTeachCopy)

    yield call(CourseServices.publishCourseTeach, newCourseTeachCopy)

    const res = yield call(CourseServices.fetchAllCourseTeach)

    yield put({
      type: 'setCourseTeachList',
      payload: res.data,
    })
  }),

  //删除一个课程绑定
  deleteCourseTeach: generateEffect(function* ({ payload }, { call, put }) {
    console.log(payload)

    yield call(CourseServices.deleteCourseTeach, payload)

    const res = yield call(CourseServices.fetchAllCourseTeach)

    yield put({
      type: 'setCourseTeachList',
      payload: res.data,
    })
  }),

  // deleteManyCourseTeach: generateEffect(function* ({ payload }, { call, put }) {
  //   console.log(payload)

  // }),
}

const reducers = {
  setCourseList: generateReducer({
    attributeName: 'courseList',
    transformer: defaultArrayTransformer,
    defaultState,
  }),

  setCurrentCourse: generateReducer({
    attributeName: 'currentCourseInfo',
    // transformer: defaultObjectTransformer,
    transformer: (payload) => payload || defaultCourseInfo,
    defaultState,
  }),

  setCourseTeachList: generateReducer({
    attributeName: 'courseTeachList',
    transformer: defaultArrayTransformer,
    defaultState,
  }),
}

export default {
  namespace: 'Course',
  state: defaultState,
  effects,
  reducers,
}
