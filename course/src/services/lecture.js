import {API_LECTURE_PREFIX} from '@/url-prefixes'
import request from '@/utils/request'
import safeUrlAssembler from 'safe-url-assembler'

export const fetchLecList = (courseId) => {
  return request(safeUrlAssembler('/:courseId/chapter/').param(courseId).toString(), {
      method: 'GET',
      prefix: API_LECTURE_PREFIX,
  })
}

export const deleteLecInfo = (params) => {
  return request(safeUrlAssembler('/:courseId/chapter/:id').param(params).toString(), {
      method: 'DELETE',
      prefix: API_LECTURE_PREFIX,
  })
}