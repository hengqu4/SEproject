import {API_ANNOUNCEMENT_PREFIX} from '@/url-prefixes'
import request from '@/utils/request'
import safeUrlAssembler from 'safe-url-assembler'

export const fetchAncList = (params) => {
    return request(safeUrlAssembler('/:courseId/announcement').param({courseId: params.courseId}).toString(), {
        method: 'GET',
        prefix: API_ANNOUNCEMENT_PREFIX,
    })
}

export const addAncInfo = (params) => {
    return request(safeUrlAssembler('/:courseId/announcement').param({courseId: params.courseId}).toString(), {
        method: 'POST',
        prefix: API_ANNOUNCEMENT_PREFIX,
        //把数组转化为json字符串
        body: JSON.stringify({
          announcementTitle: params.ancInfo.announcementTitle,
          announcementContents: params.ancInfo.announcementContents,
          announcementIsPinned: params.ancInfo.announcementIsPinned,
        })
    })
  }
  
export const deleteAncInfo = (params) => {
    return request(safeUrlAssembler('/:courseId/announcement/:announcementId').param(params).toString(), {
        method: 'DELETE',
        prefix: API_ANNOUNCEMENT_PREFIX,
    })
}
  
export const modifyAncInfo = (params) => {
  return request(safeUrlAssembler('/:courseId/announcement/:announcementId').param({courseId: params.courseId, announcementId: params.announcementId}).toString(), {
    method: 'PUT',
    prefix: API_ANNOUNCEMENT_PREFIX,
    //把数组转化为json字符串
    body: JSON.stringify({
      announcementTitle: params.ancInfo.announcementTitle,
      announcementContents: params.ancInfo.announcementContents,
      announcementIsPinned: params.ancInfo.announcementIsPinned,
    })
  })
}

//获取某公告信息
export const fetchAncInfo = (params) => {
  return request(safeUrlAssembler('/:courseId/announcement/:announcementId').param(params).toString(), {
    method: 'GET',
    prefix: API_ANNOUNCEMENT_PREFIX,
  })
}