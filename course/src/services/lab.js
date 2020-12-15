import { API_LAB_REPORT_PREFIX, API_LAB_DATABASE_PREFIX, API_LAB_COURSE_CASE } from '@/url-prefixes'
import request from '@/utils/request'
import SafeUrlAssembler from 'safe-url-assembler'

// fetch all labs in database
export const fetchLabDatabase = () => {
  return request('/list', {
    method: 'GET',
    prefix: API_LAB_DATABASE_PREFIX,
  })
}

// fetch all students' report (teacher)
// TODO: modify URL
export const fetchAllStudentReport = (params) => {
  return request('/teacher/list/1', {
    method: 'GET',
    prefix: API_LAB_REPORT_PREFIX,
  })
}

// publish lab (teacher)
// TODO: modify URL
export const publishLabCase = (data) => {
  return request('/list/1', {
    method: 'POST',
    prefix: API_LAB_COURSE_CASE,
    data,
  })
}

// delete lab case (teacher)
export const deleteLabCase = (courseId) => {
  return request(SafeUrlAssembler('/detail/').segment(courseId).toString(), {
    method: 'DELETE',
    prefix: API_LAB_DATABASE_PREFIX,
  })
}

// get all lab case (published)
export const fetchAllLabCase = (courseId) => {
  return request(SafeUrlAssembler('/list/').segment(courseId).toString(), {
    method: 'GET',
    prefix: API_LAB_COURSE_CASE,
  })
}
