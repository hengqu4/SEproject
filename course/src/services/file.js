import { API_FILE_PREFIX } from '@/url-prefixes'
import request from '@/utils/request'
import safeUrlAssembler from 'safe-url-assembler'

export const fetchFileList = (params) => {
  return request(safeUrlAssembler('/course/:courseId').param({courseId: params.courseId}).toString(), {
      method: 'GET',
      prefix: API_FILE_PREFIX,
  })
}

export const deleteFile = (params) => {
  return request(safeUrlAssembler('/course/:courseId/:fileId').param({courseId: params.courseId, fileId: params.fileId}).toString(), {
    method: 'DELETE',
    prefix: API_FILE_PREFIX,
  })
}