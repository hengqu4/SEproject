import {API_LECTURE_PREFIX} from '@/url-prefixes'
import request from '@/utils/request'
import safeUrlAssembler from 'safe-url-assembler'

//:courseId应该也可以写成{courseId}
export const fetchLecList = (courseId) => {
  return request(safeUrlAssembler('/:courseId/chapter').param(courseId).toString(), {
      method: 'GET',
      prefix: API_LECTURE_PREFIX,
  })
}