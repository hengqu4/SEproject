import { API_USER_PREFIX } from '@/url-prefixes'
import request from '@/utils/request'
import SafeUrlAssembler from 'safe-url-assembler'

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
