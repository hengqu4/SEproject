import { API_COURSE_PREFIX } from '@/url-prefixes'
import request from '@/utils/request'
import SafeUrlAssembler from 'safe-url-assembler'
import { get } from 'lodash'
import { func } from 'prop-types'

export const fetchAllCourseInfo = () => {
  return request('/course-info/', {
    method: 'GET',
    prefix: API_COURSE_PREFIX,
  })
}

export const publishCourse = (data) => {
  return request('/course-info/', {
    method: 'POST',
    prefix: API_COURSE_PREFIX,
    data,
  })
}

export const publishGradeWeight = (params) => {
  console.log(params)
  return request(SafeUrlAssembler('/api/v1/grade/gradeweight/:course_id').param({ course_id: params.courseId }).toString(), {
    method: 'POST',
  })
  // return request('/api/v1/grade/gradeweight/1', {
  //   method: 'POST',
  // })
}

export const fetchGradeWeight = (params) => {
  console.log(params)
  return request(SafeUrlAssembler('/api/v1/grade/gradeweight/:course_id').param({ course_id: params.courseId }).toString(), {
    method: 'GET',
  })
  // return request('/api/v1/grade/gradeweight/1', {
  //   method: 'GET',
  // })
}

export const fetchOneCourseInfo = (params) => {
  console.log(params)
  return request(SafeUrlAssembler('/course-info/:course_id').param({course_id: params.courseId}).toString(), {
    method: 'GET',
    prefix: API_COURSE_PREFIX,
  })
}

export const updateCourseInfo = (data) => {
  console.log(data)
  return request(SafeUrlAssembler('/course-info/:course_id').param({course_id: data.courseID}).toString(), {
    method: 'PUT',
    data,
    prefix: API_COURSE_PREFIX,
  })
}

export const fetchAllCourseTeach = () => {
  return request('/teach', {
    method: 'GET',
    prefix: API_COURSE_PREFIX,
  })
}

export const publishCourseTeach = (data) => {
  return request('/teach/', {
    method: 'POST',
    prefix: API_COURSE_PREFIX,
    data,
  })
}

export const deleteCourseTeach = (params) => {
  console.log(params) 
  return request(SafeUrlAssembler('/teach/:course_teach_id').param({course_teach_id: params}).toString(), {
    method: 'DELETE',
    prefix: API_COURSE_PREFIX,
  })
 }