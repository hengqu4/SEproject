import {API_HOMEWORK_PREFIX} from '@/url-prefixes'
import request from '@/utils/request'
import safeUrlAssembler from 'safe-url-assembler'

export const fetchHwList = (params) => {
    return request(safeUrlAssembler('/:courseId/homework/').param({courseId: params.courseId}).toString(), {
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
          homeworkUuid: params.hwInfo.homeworkUuid,
          homeworkTitle: params.hwInfo.homeworkTitle,
          homeworkDescription: params.hwInfo.homeworkDescription,
          homeworkCreateTime: params.hwInfo.homeworkCreateTime,
          homeworkUpdateTime: params.hwInfo.homeworkUpdateTime,
          homeworkStartTime: params.hwInfo.homeworkStartTime,
          homeworkEndTime: params.hwInfo.homeworkEndTime,
          homeworkCreatorId: params.hwInfo.homeworkCreatorId,
        })
    })
  }
  
  export const deleteHwInfo = (params) => {
    return request(safeUrlAssembler('/:courseId/homework/:homeworkId').param(params).toString(), {
        method: 'DELETE',
        prefix: API_HOMEWORK_PREFIX,
    })
  }