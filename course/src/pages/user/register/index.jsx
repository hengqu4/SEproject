import { Form, Button, Col, Input, Popover, Progress, Row, Select, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { Link, connect, history, FormattedMessage, formatMessage } from 'umi';
import styles from './style.less';
const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>,
};
const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

const Register = ({ submitting, dispatch, userAndregister }) => {
  const [count, setcount] = useState(0);
  const [visible, setvisible] = useState(false);
  const [prefix, setprefix] = useState('86');
  const [popover, setpopover] = useState(false);
  const confirmDirty = false;
  let interval;
  const [form] = Form.useForm();
  useEffect(() => {
    if (!userAndregister) {
      return;
    }

    const account = form.getFieldValue('mail');

    if (userAndregister.status === 'ok') {
      message.success('注册成功！');
      history.push({
        pathname: '/user/register-result',
        state: {
          account,
        },
      });
    }
  }, [userAndregister]);
  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [],
  );

  const onGetCaptcha = () => {
    let counts = 59;
    setcount(counts);
    interval = window.setInterval(() => {
      counts -= 1;
      setcount(counts);

      if (counts === 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const getPasswordStatus = () => {
    const value = form.getFieldValue('password');

    if (value && value.length > 9) {
      return 'ok';
    }

    if (value && value.length > 5) {
      return 'pass';
    }

    return 'poor';
  };

  const onFinish = (values) => {
    dispatch({
      type: 'userAndregister/submit',
      payload: { ...values, prefix },
    });
  };

  const checkConfirm = (_, value) => {
    const promise = Promise;

    if (value && value !== form.getFieldValue('password')) {
      return promise.reject('两次输入的密码不匹配!');
    }

    return promise.resolve();
  };

  const checkPassword = (_, value) => {
    const promise = Promise; // 没有值的情况

    if (!value) {
      setvisible(!!value);
      return promise.reject('请输入密码！');
    } // 有值的情况

    if (!visible) {
      setvisible(!!value);
    }

    setpopover(!popover);

    if (value.length < 6) {
      return promise.reject('');
    }

    if (value && confirmDirty) {
      form.validateFields(['confirm']);
    }

    return promise.resolve();
  };

  const changePrefix = (value) => {
    setprefix(value);
  };

  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  return (
    <div className={styles.main}>
      <h3>注册</h3>
      <Form form={form} name="UserRegister" onFinish={onFinish}>
        <FormItem
          name="mail"
          rules={[
            {
              required: true,
              message: '请输入邮箱地址！',
            },
            {
              type: 'email',
              message: '邮箱地址格式错误！',
            },
          ]}
        >
          <Input size="large" placeholder="邮箱" />
        </FormItem>
        <Popover
          getPopupContainer={(node) => {
            if (node && node.parentNode) {
              return node.parentNode;
            }

            return node;
          }}
          content={
            visible && (
              <div
                style={{
                  padding: '4px 0',
                }}
              >
                {passwordStatusMap[getPasswordStatus()]}
                {renderPasswordProgress()}
                <div
                  style={{
                    marginTop: 10,
                  }}
                >
                  请至少输入 6 个字符。请不要使用容易被猜到的密码。
                </div>
              </div>
            )
          }
          overlayStyle={{
            width: 240,
          }}
          placement="right"
          visible={visible}
        >
          <FormItem
            name="password"
            className={
              form.getFieldValue('password') &&
              form.getFieldValue('password').length > 0 &&
              styles.password
            }
            rules={[
              {
                validator: checkPassword,
              },
            ]}
          >
            <Input size="large" type="password" placeholder="至少6位密码，区分大小写" />
          </FormItem>
        </Popover>
        <FormItem
          name="confirm"
          rules={[
            {
              required: true,
              message: '请确认密码！',
            },
            {
              validator: checkConfirm,
            },
          ]}
        >
          <Input size="large" type="password" placeholder="确认密码" />
        </FormItem>
        <InputGroup compact>
          <Select
            size="large"
            value={prefix}
            onChange={changePrefix}
            style={{
              width: '20%',
            }}
          >
            <Option value="86">+86</Option>
            <Option value="87">+87</Option>
          </Select>
          <FormItem
            style={{
              width: '80%',
            }}
            name="mobile"
            rules={[
              {
                required: true,
                message: '请输入手机号！',
              },
              {
                pattern: /^\d{11}$/,
                message: '手机号格式错误！',
              },
            ]}
          >
            <Input size="large" placeholder="手机号" />
          </FormItem>
        </InputGroup>
        <Row gutter={8}>
          <Col span={16}>
            <FormItem
              name="captcha"
              rules={[
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ]}
            >
              <Input size="large" placeholder="验证码" />
            </FormItem>
          </Col>
          <Col span={8}>
            <Button
              size="large"
              disabled={!!count}
              className={styles.getCaptcha}
              onClick={onGetCaptcha}
            >
              {count ? `${count} s` : '获取验证码'}
            </Button>
          </Col>
        </Row>
        <FormItem>
          <Button
            size="large"
            loading={submitting}
            className={styles.submit}
            type="primary"
            htmlType="submit"
          >
            注册
          </Button>
          <Link className={styles.login} to="/user/login">
            使用已有账户登录
          </Link>
        </FormItem>
      </Form>
    </div>
  );
};

export default connect(({ userAndregister, loading }) => ({
  userAndregister,
  submitting: loading.effects['userAndregister/submit'],
}))(Register);
