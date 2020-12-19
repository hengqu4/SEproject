import * as CourseServices from '@/services/course'
import generateEffect from '@/utils/generateEffect'
import generateReducer, {
  defaultArrayTransformer,
  defaultObjectTransformer,
} from '@/utils/generateReducer'
import { cloneDeep } from 'lodash'

const defaultCourseInfo = {
  courseCreatorSchoolId: 'tongji',
  courseName: null,
  courseCredit: null,
  courseStudyTimeNeeded: null,
  courseDescription: null,
  courseType: null,
  courseStartTime: null,
  courseEndTime: null,
  courseAvatar: null,
}

const defaultState = {
  newCourseInfo: defaultCourseInfo,
  courseList: [],
}

const effects = {
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

    console.log(res.data)
    yield put({
      type: 'setCourseList',
      payload: res.data,
    })
  }),

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

    yield call(CourseServices.publishCourse, newCourseInfoCopy)
    // res = yield CourseServices.publishCourse(newCourseInfoCopy)
    //   .then((response) => {
    //     console.log(response)
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //   })

    const res = yield call(CourseServices.fetchAllCourseInfo)

    yield put({
      type: 'setCourseList',
      payload: res.data,
    })
  }),
}

const reducers = {
  setCourseList: generateReducer({
    attributeName: 'courseList',
    transformer: defaultArrayTransformer,
    // defaultState,
  }),
}

export default {
  namespace: 'Course',
  state: defaultState,
  effects,
  reducers,
}
