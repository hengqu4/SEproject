import request from '@/utils/request'
import { API_USER_PREFIX } from '@/url-prefixes'

export async function query() {
  return request('/api/users')
}
// export async function queryCurrent() {
//   return request('/api/currentUser')
// }
export async function queryCurrent() {
  return request('/account/', {
    method: 'GET',
    prefix: API_USER_PREFIX,
  }).catch(function (error) {
    console.log(error)
  })
}

export async function queryNotices() {
  return request('/api/notices')
}
