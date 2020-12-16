import { API_USER_PREFIX } from '@/url-prefixes'
import request from '@/utils/request'

// export async function fakeAccountLogin(params) {
//   return request('/api/login/account', {
//     method: 'POST',
//     data: params,
//   })
// }
export async function userAccountLogin(data) {
  return request('/login/', {
    method: 'POST',
    prefix: API_USER_PREFIX,
    data,
  }).catch(function (error) {
    console.log(error)
  })
}

// export async function getFakeCaptcha(mobile) {
//   return request(`/api/login/captcha?mobile=${mobile}`)
// }
