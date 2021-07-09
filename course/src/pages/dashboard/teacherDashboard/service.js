import { API_GRADE_PREFIX } from '@/url-prefixes'
import request from '@/utils/request'
import SafeUrlAssembler from 'safe-url-assembler'
import { pick, omit } from 'lodash'

export async function fakeChartData() {
  return request('/api/fake_chart_data')
}

export const fetchStudentGradeWeight = (query) => {
  return request(
    SafeUrlAssembler('/gradeweight/:courseId')
      .param(pick(query, ['courseId']))
      .toString(),
    {
      method: 'GET',
      prefix: API_GRADE_PREFIX,
    },
  )
}

export const updateStudentGradeWeight = (query) => {
  return request(
    SafeUrlAssembler('/gradeweight/:courseId')
      .param(pick(query, ['courseId']))
      .toString(),
    {
      method: 'PUT',
      data: pick(query, ['form']),
      prefix: API_GRADE_PREFIX,
    },
  )
}
