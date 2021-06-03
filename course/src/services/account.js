import request from '@/utils/request'
import { API_USER_PREFIX } from '@/url-prefixes'
import safeUrlAssembler from 'safe-url-assembler'

export const uploadAccount = (data) => {
    return request('/upload-students/', {
        method: 'POST',
        prefix: API_USER_PREFIX,
        data
    })
}

export const uploadSingleAccount = (data) => {
    return request('/register/',{
        method: 'POST',
        prefix: API_USER_PREFIX,
        data
    })
}

export const sendEmailAddress = (data) =>{
    return request('/password/reset/',{
      method:'POST',
      prefix:API_USER_PREFIX,
      data
    })
  }
  
  export const resetPassword = (payload) => {
    return request('/password/verify/',{
      method: 'POST',
      prefix: API_USER_PREFIX,
      data: payload
    }) 
  }