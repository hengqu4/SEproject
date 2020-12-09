import { API_CONTEST_PREFIX, API_CONTEST_QUESTIONS_PREFIX, API_MATCH_PREFIX } from '@/url-prefixes'
import request from '@/utils/request'
import SafeUrlAssembler from 'safe-url-assembler'
import omit from 'lodash/omit'

export const fetchStudentMatchHistory = (query) => {
  return request('/matches', {
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

export const fetchQuestionList = (query) => {
  return request('/questions', {
    method: 'GET',
    prefix: API_CONTEST_QUESTIONS_PREFIX,
    params: query,
  })
}

export const fetchQuestionDetail = (params) => {
  return request(SafeUrlAssembler('/question/:questionType/:questionId').param(params).toString(), {
    method: 'GET',
    prefix: API_CONTEST_QUESTIONS_PREFIX,
  })
}

export const createQuestion = (data) => {
  return request('/question', {
    method: 'POST',
    data: {
      question: data,
    },
    prefix: API_CONTEST_QUESTIONS_PREFIX,
  })
}

export const updateQuestion = (data) => {
  return request(
    SafeUrlAssembler('/question/:questionType/:questionId')
      .param({
        questionType: data.oldType,
        questionId: data.questionId,
      })
      .toString(),
    {
      method: 'PUT',
      data: omit(data, ['questionId', 'oldType']),
      prefix: API_CONTEST_QUESTIONS_PREFIX,
    },
  )
}

export const deleteQuestion = (params) => {
  return request(SafeUrlAssembler('/question/:questionType/:questionId').param(params).toString(), {
    method: 'DELETE',
    prefix: API_CONTEST_QUESTIONS_PREFIX,
  })
}

export const createContest = (data) => {
  return request('/contest', {
    method: 'POST',
    prefix: API_CONTEST_PREFIX,
    data,
  })
}

export const fetchAllContests = (query) => {
  // TODO: 修改url
  return request('/contest/all', {
    method: 'GET',
    prefix: API_CONTEST_PREFIX,
    params: query,
  })
}

export const fetchAllStudents = (query) => {
  // TODO: 修改url
  return request('/students', {
    method: 'GET',
    prefix: API_CONTEST_PREFIX,
    params: query,
  })
}

export const fetchAllContestMatches = (query) => {
  // TODO: 修改url
  return request('/matchesByContest', {
    method: 'GET',
    prefix: API_CONTEST_PREFIX,
    params: query,
  })
}

export const fetchAllStudentMatches = (query) => {
  // TODO: 修改url
  return request('/matchesByStudent', {
    method: 'GET',
    prefix: API_CONTEST_PREFIX,
    params: query,
  })
}

export const startMatching = (data) => {
  return request('/start', {
    method: 'POST',
    data,
    prefix: API_MATCH_PREFIX,
  })
}

export const cancelMatching = (data) => {
  return request('/cancel', {
    method: 'POST',
    data,
    prefix: API_MATCH_PREFIX,
  })
}

export const fetchMatchingIndex = (query) => {
  return request('/userindex', {
    method: 'GET',
    params: query,
    prefix: API_MATCH_PREFIX,
  })
}

export const readyMatch = (data) => {
  return request('/ready', {
    method: 'POST',
    data,
    prefix: API_MATCH_PREFIX,
  })
}

export const fetchCurrentMatch = (data) => {
  return request('/questions', {
    method: 'POST',
    data,
    prefix: API_MATCH_PREFIX,
  })
}
