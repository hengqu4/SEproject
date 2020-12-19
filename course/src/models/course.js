import * as CourseServices from '@/services/course'
import generateEffect from '@/utils/generateEffect'
import generateReducer, {
  defaultArrayTransformer,
  defaultObjectTransformer,
} from '@/utils/generateReducer'
import { cloneDeep } from 'lodash'


const defaultCourseInfo = {
  courseCreatorSchoolId: "tongji",
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
  getAllCourse: generateEffect(function* (_ , { call, put }) {
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
    yield put({
      type: 'setCourseList',
      payload: res.data,
    })
  }),

  createNewCourse: generateEffect(function* ({ payload }, { call, put, select }) {
    const newCourseInfoCopy = cloneDeep(payload)
    
    const course_creator_school_id = "tongji"
    const course_start_time = newCourseInfoCopy.course_time[0]
    const course_end_time = newCourseInfoCopy.course_time[1]
    delete newCourseInfoCopy.course_time

    console.log(newCourseInfoCopy)

    const res = yield call(CourseServices.publishCourse, {

      courseInfo: {
        ...newCourseInfoCopy,
        course_creator_school_id,
        course_start_time,
        course_end_time,
      }
    })
    
    yield put({
      type: 'getAllCourse'
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