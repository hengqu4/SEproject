import { API_LAB_REPORT_PREFIX, API_LAB_DATABASE_PREFIX } from '@/url-prefixes'
import request from '@/utils/request'

// fetch all labs in database
export const fetchLabDatabase = (query) => {
  return request('/list', {
    method: 'GET',
    prefix: API_LAB_DATABASE_PREFIX,
  })
}

// fetch all students' report (teacher)
export const fetchAllStudentReport = (query) => {
  return request('/teacher/list/1', {
    method: 'GET',
    prefix: API_LAB_REPORT_PREFIX,
  })
}
