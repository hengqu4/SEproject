import request from '@/utils/request'
import { API_USER_PREFIX } from '@/url-prefixes'
import safeUrlAssembler from 'safe-url-assembler'

export const uploadAccount = (data) => {
    return request('/fuckyou', {
        method: 'POST',
        prefix: 'FUCKYOU',
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
