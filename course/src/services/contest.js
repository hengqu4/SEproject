import { API_CONTEST_PREFIX, API_CONTEST_QUESTIONS_PREFIX } from '@/url-prefixes'
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
