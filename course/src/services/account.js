import request from '@/utils/request'
import safeUrlAssembler from 'safe-url-assembler'

export const uploadAccount = (data) => {
    return request('/fuckyou', {
        method: 'POST',
        prefix: 'FUCKYOU',
        data
    }
    )
}