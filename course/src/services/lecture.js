import {API_LECTURE_PREFIX} from '@/url-prefixes'
import request from '@/utils/request'
import safeUrlAssembler from 'safe-url-assembler'

//获取章节列表
export const fetchLecList = (courseId) => {
  return request(safeUrlAssembler('/:courseId/chapter/').param(courseId).toString(), {
      method: 'GET',
      prefix: API_LECTURE_PREFIX,
  })
}

export const addLecInfo = (params) => {
  return request(safeUrlAssembler('/:courseId/chapter/').param({courseId: params.courseId}).toString(), {
      method: 'POST',
      prefix: API_LECTURE_PREFIX,
      //把数组转化为json字符串
      body: JSON.stringify({
        courseChapterId: params.lecInfo.courseChapterId,
        courseChapterTitle: params.lecInfo.courseChapterTitle,
        courseChapterMoocLink: params.lecInfo.courseChapterMoocLink,
      })
  })
}

export const deleteLecInfo = (params) => {
  return request(safeUrlAssembler('/:courseId/chapter/:id').param(params).toString(), {
      method: 'DELETE',
      prefix: API_LECTURE_PREFIX,
  })
}

export const modifyLecInfo = (params) => {
  return request(safeUrlAssembler('/:courseId/chapter/:id').param({courseId: params.courseId, id: params.id}).toString(), {
    method: 'PUT',
    prefix: API_LECTURE_PREFIX,
    //把数组转化为json字符串
    body: JSON.stringify({
      courseChapterId: params.lecInfo.courseChapterId,
      courseChapterTitle: params.lecInfo.courseChapterTitle,
      courseChapterMoocLink: params.lecInfo.courseChapterMoocLink,
    })
  })
}

//获取某章节信息
export const fetchLecInfo = (params) => {
  return request(safeUrlAssembler('/:courseId/chapter/:id').param(params).toString(), {
    method: 'GET',
    prefix: API_LECTURE_PREFIX,
  })
}