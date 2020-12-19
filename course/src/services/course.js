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

export const fetchOneCourseInfo = (courseID) => {
  return request('/course-info/1', {
    method: 'GET',
    prefix: API_COURSE_PREFIX,
  })
}

export const editCourseInfo = (data) => {
  return request('/course-info/1', {
    method: 'PUT',
    prefix: API_COURSE_PREFIX,
    data,
  })
}

export const fetchAllCourseTeach = () => {
  return request('/teach', {
    method: 'GET',
    prefix: API_COURSE_PREFIX,
  })
}

export const publishCourseTeach = (data) => {
  return request('/teach', {
    method: 'POST',
    prefix: API_COURSE_PREFIX,
    data,
  })
}

// export const deleteCourseTeach = () => {

// }
