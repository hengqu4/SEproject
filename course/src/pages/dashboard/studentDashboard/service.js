import { API_GRADE_PREFIX } from '@/url-prefixes'
import request from '@/utils/request'
import SafeUrlAssembler from 'safe-url-assembler'
import { pick, omit } from 'lodash'

export async function fakeChartData() {
  return request('/api/fake_chart_data')
}

export const fetchStudentGrade = (params) => {
  console.log('params', params)
  return request(SafeUrlAssembler('/:courseId/:userId')
  .param(pick(params, ['courseId', 'userId']))
  .toString(), {
    method: 'GET',
    prefix: API_GRADE_PREFIX,
  })
}
