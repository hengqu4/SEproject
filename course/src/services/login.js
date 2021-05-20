import { API_USER_PREFIX } from '@/url-prefixes'
import request from '@/utils/request'

export async function userAccountLogin(data) {
  console.log(data);
  return request('/login/', {
    method: 'POST',
    prefix: API_USER_PREFIX,
    data,
  })
  
}

export async function userAccountLogout() {
  return request('/logout/', {
    method: 'POST',
    prefix: API_USER_PREFIX,
  }).catch(function (error) {
    console.log(error)
  })
}
