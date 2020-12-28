import {API_HOMEWORK_PREFIX} from '@/url-prefixes'
import request from '@/utils/request'
import safeUrlAssembler from 'safe-url-assembler'

export const fetchHwList = (courseId) => {
    return request(safeUrlAssembler('/:courseId/homework/').param(courseId).toString(), {
        method: 'GET',
        prefix: API_HOMEWORK_PREFIX,
    })
}

export const addHwInfo = (params) => {
    return request(safeUrlAssembler('/:courseId/homework/').param({courseId: params.courseId}).toString(), {
        method: 'POST',
        prefix: API_HOMEWORK_PREFIX,
        //把数组转化为json字符串
        body: JSON.stringify({
          homeworkUuid: params.lecInfo.courseChapterId,
          homeworkTitle: params.lecInfo.courseChapterTitle,
          homeworkDescription: params.lecInfo.courseChapterMoocLink,
          homeworkCreateTime,
          homeworkUpdateTime,
          homeworkStartTime,
          homeworkEndTime,
          homeworkCreatorId,
        })
    })
  }
  
  export const deleteHwInfo = (params) => {
    return request(safeUrlAssembler('/:courseId/chapter/:homeworkId').param(params).toString(), {
        method: 'DELETE',
        prefix: API_HOMEWORK_PREFIX,
    })
  }