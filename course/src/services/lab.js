import {
  API_LAB_REPORT_PREFIX,
  API_LAB_DATABASE_PREFIX,
  API_LAB_COURSE_CASE,
  API_LAB_COURSE_CASE_STUDENT
} from '@/url-prefixes'
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
export const fetchAllStudentReport = (courseId) => {
  return request(SafeUrlAssembler('/assignments/teacher/list/').segment(courseId).toString(), {
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

// create lab case (teacher)
export const createLabCase = (data) => {
  return request('/list/', {
    method: 'POST',
    prefix: API_LAB_DATABASE_PREFIX,
    data,
  })
}

// get all lab case (published)
export const fetchAllLabCase = (courseId) => {
  return request(SafeUrlAssembler('/list/').segment(courseId).toString(), {
    method: 'GET',
    prefix: API_LAB_COURSE_CASE,
  })
}

// get my submit lab case (published)
export const fetchMySubmission = () => {
  return request('/assignments/student/list', {
    method: 'GET',
    prefix: API_LAB_REPORT_PREFIX,
  })
}
// publish lab remark (teacher)
export const remarkSubmission = (courseCaseId) => {
  return request(SafeUrlAssembler('/assignments/teacher/public/').segment(courseCaseId).toString(), {
    method: 'GET',
    prefix: API_LAB_REPORT_PREFIX,
  })
}
// get a lab case (published)
export const fetchLabCase = (courseCaseId) => {
  return request(SafeUrlAssembler('/detail/').segment(courseCaseId).toString(), {
    method: 'GET',
    prefix: API_LAB_COURSE_CASE_STUDENT,
  })
}

// submit a lab case (student)
export const submitLabCase = (data) => {
  return request('/assignments/student/list/', {
    method: 'POST',
    prefix: API_LAB_REPORT_PREFIX ,
    data,
  })
}

// get submitted lab case (student)
export const fetchSubmission = (submissionCaseId) => {
  return request(SafeUrlAssembler('/teacher/assignment/detail/').segment(submissionCaseId).toString(), {
    method: 'GET',
    prefix: API_LAB_REPORT_PREFIX,
  })
}

// mark submitted lab case (teacher)
export const markSubmission = (data) => {
  return request(
    SafeUrlAssembler('/assignment/teacher/detail/:submissionCaseId')
      .param({
        submissionCaseId: data.submissionCaseId,
      })
      .toString(),
    {
      method: 'PUT',
      prefix: API_LAB_REPORT_PREFIX,
      // data:omit(data, ['submissionCaseId']),
      data
    },
  )
}