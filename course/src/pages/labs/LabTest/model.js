import { message } from 'antd';
import { fakeSubmitForm } from './service';

const Model = {
  namespace: 'labsAndLabTest',
  state: {},
  effects: {
    *submitAdvancedForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
  },
};
export default Model;
