import * as uploadFile from '@/services/account'
import generateEffect from '@/utils/generateEffect'
import generateReducer, {
    defaultArrayTransformer,
    defaultObjectTransformer,
} from '@/utils/generateReducer'

const defaultState = {
    isSuccess: false,
    file: null,
}

const effects = {
    uploadAccount: generateEffect(function* ({payload}, {call}){
        yield call(uploadFile.uploadAccount, payload)
    }),
    uploadSingleAccount: generateEffect(function*({payload}, {call}){
        yield call(uploadFile.uploadSingleAccount, payload)
    }),
    sendEmailAddress: generateEffect(function*({payload}, {call}){
        yield call(uploadFile.sendEmailAddress, payload)
    }),
    resetPassword: generateEffect(function* ({payload}, {call}){
        yield call(uploadFile.resetPassword, payload)
    }),
}

const reducers = {
    setIsSuccess: generateReducer({
        attributeName: 'isSuccess',
        transformer: defaultObjectTransformer,
        defaultState
    })
}


export default {
    namespace: 'account',
    state: defaultState,
    effects,
    reducers,
}
  