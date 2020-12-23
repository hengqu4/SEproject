import { message } from 'antd'
import { fakeSubmitForm } from './service'

const Model = {
  namespace: 'labsAndCreateLab',
  state: {},
  effects: {
    *submitRegularForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload)
      message.success('提交实验作业成功')
    },
  },
}
export default Model
