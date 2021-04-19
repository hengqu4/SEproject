import { API_FILE_PREFIX } from '@/url-prefixes'
import request from '@/utils/request'
import safeUrlAssembler from 'safe-url-assembler'

export const fetchFileList = (params) => {
  return request(safeUrlAssembler('/course/:courseId').param({courseId: params.courseId}).toString(), {
      method: 'GET',
      prefix: API_FILE_PREFIX,
  })
}

export const addFile = (params) => {
  return request(safeUrlAssembler('/course/:courseId').param({courseId: params.courseId}).toString(), {
      method: 'POST',
    prefix: API_FILE_PREFIX,
    //把数组转化为json字符串
    body: JSON.stringify({
      fileDisplayName: params.fileInfo.fileDisplayName,
      fileComment: params.fileInfo.fileComment,
      fileUploader: params.fileInfo.fileUploader,
    })
  })
}

export const deleteFile = (params) => {
  return request(safeUrlAssembler('/course/:courseId/:fileId').param({courseId: params.courseId, fileId: params.fileId}).toString(), {
    method: 'DELETE',
    prefix: API_FILE_PREFIX,
  })
}