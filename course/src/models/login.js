import { stringify } from 'querystring'
import { history } from 'umi'
import { userAccountLogin } from '@/services/login'
import { setAuthority, AUTHORITY_LIST } from '@/utils/authority'
import { getPageQuery } from '@/utils/utils'

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(userAccountLogin, payload)

      console.log(response.isSuccess)
      if (response.isSuccess) {
        const urlParams = new URL(window.location.href)
        const params = getPageQuery()
        let { redirect } = params

        if (redirect) {
          const redirectUrlParams = new URL(redirect)

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length)

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1)
            }
          } else {
            window.location.href = '/'
            return
          }
        }
        console.log(redirect || '/')
        history.replace(redirect || '/')
      }

      yield put({
        type: 'changeLoginStatus',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'multipart/form-data',
        },
        payload: response,
      }) // Login successfully
    },

    logout() {
      const { redirect } = getPageQuery() // Note: There may be security issues, please note

      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      console.log(payload)
      setAuthority(AUTHORITY_LIST[Number(payload.data.character)])
      console.log(`current authority is :${AUTHORITY_LIST[Number(payload.data.character)]}`)
      return { ...state, status: payload.status, type: payload.type }
    },
  },
}
export default Model
