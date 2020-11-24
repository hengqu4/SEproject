import { message } from 'antd'
import { fakeSubmitForm } from './service'

const Model = {
  namespace: 'labsAndMarkLab',
  state: {},
  effects: {
    *submitRegularForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload)
      message.success('批改成功')
    },
  },
}
export default Model
