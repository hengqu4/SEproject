import { API_USER_PREFIX } from '@/url-prefixes'
import request from '@/utils/request'

// export async function fakeRegister(params) {
//   return request('/api/register', {
//     method: 'POST',
//     data: params,
//   })
// }

export async function userAccountRegister(data) {
  return request('/register/', {
    method: 'POST',
    prefix: API_USER_PREFIX,
    data,
    // eslint-disable-next-line func-names
  }).catch(function (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    return error
  })
}
