import { API_CONTEST_PREFIX } from '@/url-prefixes'
import request from '@/utils/request'
import SafeUrlAssembler from 'safe-url-assembler'

export const fetchStudentMatchHistory = (query) => {
  return request(SafeUrlAssembler('/matches').toString(), {
    method: 'GET',
    prefix: API_CONTEST_PREFIX,
    params: query,
  })
}

export const fetchStudentMatchDetail = (params) => {
  return request(SafeUrlAssembler('/matches/:matchId').param(params).toString(), {
    method: 'GET',
    prefix: API_CONTEST_PREFIX,
  })
}

export const fetchCurrentContest = (query) => {
  return request(SafeUrlAssembler('/contest').toString(), {
    method: 'GET',
    prefix: API_CONTEST_PREFIX,
    params: query,
  })
}
