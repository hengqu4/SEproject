import request from 'umi-request';

export async function queryCourseList(params) {
  return request('/api/courseList', {
    params,
  });
}
export async function removeCourseList(params) {
  return request('/api/courseList', {
    method: 'POST',
    data: { ...params, method: 'delete' },
  });
}
export async function addCourseList(params) {
  return request('/api/courseList', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}
export async function updateCourseList(params) {
  return request('/api/courseList', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}
export async function queryTeacherList(params) {
  return request('/api/teacherList', {
    params,
  })
}