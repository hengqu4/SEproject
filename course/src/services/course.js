import { API_COURSE_PREFIX } from '@/url-prefixes'
import request from '@/utils/request'
import SafeUrlAssembler from 'safe-url-assembler'
import { get } from 'lodash'
import { func } from 'prop-types'

//获取全部课程信息
export const fetchAllCourseInfo = () => {
  return request('/course-info/', {
    method: 'GET',
    prefix: API_COURSE_PREFIX,
  })
}

//新建课程
export const publishCourse = (data) => {
  return request('/course-info/', {
    method: 'POST',
    prefix: API_COURSE_PREFIX,
    data,
  })
}

//创建课程成绩权重
export const publishGradeWeight = (params) => {
  console.log(params)
  return request(
    SafeUrlAssembler('/api/v1/grade/gradeweight/:course_id')
      .param({ course_id: params.courseId })
      .toString(),
    {
      method: 'POST',
    },
  )
  // return request('/api/v1/grade/gradeweight/1', {
  //   method: 'POST',
  // })
}

//获取课程成绩权重
export const fetchGradeWeight = (params) => {
  console.log(params)
  return request(
    SafeUrlAssembler('/api/v1/grade/gradeweight/:course_id')
      .param({ course_id: params.courseId })
      .toString(),
    {
      method: 'GET',
    },
  )
  // return request('/api/v1/grade/gradeweight/1', {
  //   method: 'GET',
  // })
}

//获取某个指定课号课程信息
export const fetchOneCourseInfo = (params) => {
  console.log(params)
  return request(
    SafeUrlAssembler('/course-info/:course_id').param({ course_id: params.courseId }).toString(),
    {
      method: 'GET',
      prefix: API_COURSE_PREFIX,
    },
  )
}

//编辑新课程信息
export const updateCourseInfo = (data) => {
  console.log(data)
  return request(
    SafeUrlAssembler('/course-info/:course_id').param({ course_id: data.courseID }).toString(),
    {
      method: 'PUT',
      data,
      prefix: API_COURSE_PREFIX,
    },
  )
}

//删除课程信息
export const deleteCourseInfo = (params) => {
  return request(
    SafeUrlAssembler('/course-info/:course_id').param({ course_id: params }).toString(),
    {
      method: 'DELETE',
      prefix: API_COURSE_PREFIX,
    },
  )
}

//获取全部课程绑定信息
export const fetchAllCourseTeach = () => {
  return request('/teach', {
    method: 'GET',
    prefix: API_COURSE_PREFIX,
  })
}

//创建新课程绑定信息
export const publishCourseTeach = (data) => {
  return request('/teach/', {
    method: 'POST',
    prefix: API_COURSE_PREFIX,
    data,
  })
}

//删除课程绑定信息
export const deleteCourseTeach = (params) => {
  console.log(params)
  return request(
    SafeUrlAssembler('/teach/:course_teach_id').param({ course_teach_id: params }).toString(),
    {
      method: 'DELETE',
      prefix: API_COURSE_PREFIX,
    },
  )
}
