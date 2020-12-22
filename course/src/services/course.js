import {API_LECTURE_PREFIX} from '@/url-prefixes'
import request from '@/utils/request'
import safeUrlAssembler from 'safe-url-assembler'

export const fetchLecList = (courseId) => {
  return request(safeUrlAssembler('/:courseID/chapter').param(courseId).toString(), {
      method: 'GET',
      prefix: API_LECTURE_PREFIX,
  })
}