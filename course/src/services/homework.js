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
          homeworkTitle: params.hwInfo.homeworkTitle,
          homeworkDescription: params.hwInfo.homeworkDescription,
          homeworkStartTime: params.hwInfo.homeworkStartTime,
          homeworkEndTime: params.hwInfo.homeworkEndTime,
        })
    })
  }
  
export const deleteHwInfo = (params) => {
    return request(safeUrlAssembler('/:courseId/homework/:homeworkId').param(params).toString(), {
        method: 'DELETE',
        prefix: API_HOMEWORK_PREFIX,
    })
}
  
export const modifyHwInfo = (params) => {
  return request(safeUrlAssembler('/:courseId/homework/:homeworkId').param({courseId: params.courseId, homeworkId: params.homeworkId}).toString(), {
    method: 'PUT',
    prefix: API_HOMEWORK_PREFIX,
    //把数组转化为json字符串
    body: JSON.stringify({
      homeworkTitle: params.hwInfo.homeworkTitle,
      homeworkDescription: params.hwInfo.homeworkDescription,
      homeworkStartTime: params.hwInfo.homeworkStartTime,
      homeworkEndTime: params.hwInfo.homeworkEndTime,
    })
  })
}

//获取某作业信息
export const fetchHwInfo = (params) => {
  return request(safeUrlAssembler('/:courseId/homework/:homeworkId').param(params).toString(), {
    method: 'GET',
    prefix: API_HOMEWORK_PREFIX,
  })
}

export const fetchGrade = (params) => {
  return request(safeUrlAssembler('/:courseId/homework/:homeworkId/score/:studentId').param(params).toString(), {
    method: 'GET',
    prefix: API_HOMEWORK_PREFIX,
  })  
}

export const fetchHwFileList = (params) => {
  return request(safeUrlAssembler('/:courseId/homework/:homeworkId/file').param(params).toString(), {
    method: 'GET',
    prefix: API_HOMEWORK_PREFIX,
  })
}

export const addGrade = (params) => {
  return request(safeUrlAssembler('/:courseId/homework/:homeworkId/score/:studentId').param({courseId: params.courseId, homeworkId: params.homeworkId, studentId: params.studentId}).toString(), {
    method: 'PUT',
    prefix: API_HOMEWORK_PREFIX,
    //把数组转化为json字符串
    body: JSON.stringify({
      homeworkTeachersComment: params.data.homeworkTeachersComment,
      homeworkIsGradeAvailable: params.data.homeworkIsGradeAvailable,
      homeworkScore: params.data.homeworkScore,
    })
  })
}

export const fetchHwFile = (params) => {
  return request(safeUrlAssembler('/:courseId/homework/:homeworkId/file/uploader/:fileUploader').param(params).toString(), {
    method: 'GET',
    prefix: API_HOMEWORK_PREFIX,
  })
}