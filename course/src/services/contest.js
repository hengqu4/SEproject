import {
  API_CONTEST_PREFIX,
  API_CONTEST_QUESTIONS_PREFIX,
  API_MATCH_PREFIX,
  API_COURSE_PREFIX,
} from '@/url-prefixes'
import request from '@/utils/request'
import SafeUrlAssembler from 'safe-url-assembler'
import { pick, omit } from 'lodash'

export const fetchStudentMatchHistory = (query) => {
  return request('/matches', {
    method: 'GET',
    prefix: API_CONTEST_PREFIX,
    params: query,
  }).then((res) => {
    console.log('fetchStudentMatchHistory: ', res)
    return res
  })
}

export const fetchStudentMatchDetail = (params) => {
  return request(SafeUrlAssembler('/match/:matchId').param(params).toString(), {
    method: 'GET',
    prefix: API_CONTEST_PREFIX,
  })
}

export const fetchCurrentContest = (query) => {
  return request('/contest', {
    method: 'GET',
    prefix: API_CONTEST_PREFIX,
    params: query,
  })
}

export const fetchQuestionList = (query) => {
  return request('/question', {
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
      data: {
        question: omit(data, ['questionId', 'oldType']),
      },
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
  return request('/contest/end', {
    method: 'GET',
    prefix: API_CONTEST_PREFIX,
    params: query,
  }).then((res) => {
    console.log('fetchAllContests: ', res)
    return res
  })
}

export const fetchAllStudents = (query) => {
  return request(
    SafeUrlAssembler('/course-student-info/:courseId')
      .param(pick(query, ['courseId']))
      .toString(),
    {
      method: 'GET',
      prefix: API_COURSE_PREFIX,
      params: omit(query, ['courseId']),
    },
  )
}

export const fetchAllContestMatches = (query) => {
  // TODO: 修改url
  return request(
    SafeUrlAssembler('/matches/:contestId')
      .param(pick(query, ['contestId']))
      .toString(),
    {
      method: 'GET',
      prefix: API_CONTEST_PREFIX,
      params: query,
    },
  ).then((res) => {
    console.log('fetchAllContestMatches: ', res)
    return res
  })
}

export const fetchAllStudentMatches = (query) => {
  // TODO: 修改url
  return request('/matches/student', {
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

export const fetchMatchQuestions = (query) => {
  return request(
    SafeUrlAssembler('/contest/questions/student/:contestId')
      .param(pick(query, ['contestId']))
      .toString(),
    {
      method: 'GET',
      params: query,
      prefix: API_CONTEST_PREFIX,
    },
  )
}

export const fetchContestQuestions = (query) => {
  return request(
    SafeUrlAssembler('/contest/questions/teacher/:contestId')
      .param(pick(query, ['contestId']))
      .toString(),
    {
      method: 'GET',
      params: query,
      prefix: API_CONTEST_PREFIX,
    },
  )
}

export const fetchChannelId = (query) => {
  return request('/channel', {
    method: 'GET',
    params: query,
    prefix: API_MATCH_PREFIX,
  })
}

export const fetchMatchId = (query) => {
  return request('/matchId', {
    method: 'GET',
    params: query,
    prefix: API_CONTEST_PREFIX,
  })
}

export const fetchRandomQuestions = (query) => {
  return request('/question/random', {
    method: 'GET',
    params: query,
    prefix: API_CONTEST_QUESTIONS_PREFIX,
  })
}

export const submitAnswers = (data) => {
  return request('/submission', {
    method: 'POST',
    data,
    prefix: API_MATCH_PREFIX,
  })
}
