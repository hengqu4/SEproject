import { InfoCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  Input,
  Form,
  InputNumber,
  Radio,
  Select,
  Statistic,
  Tooltip,
  Table, 
  Tabs, 
  Tag,
  PageHeader,
  Typography,
} from 'antd';
import { connect, FormattedMessage, formatMessage } from 'umi';
import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './style.less';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const MarkLab = props => {
  const { submitting } = props;
  const [form] = Form.useForm();
  const [showPublicUsers, setShowPublicUsers] = React.useState(false);
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 2,
      },
    },
    wrapperCol: {
      xs: {
        span: 21,
      },
    },
  };
  const submitFormLayout = {
    wrapperCol: {
      xs: {
        span: 0,
        offset: 10,
      },
    },
  };
  const columns = [
    {
      title: '名称',
      dataIndex: 'fileName',
      key: 'fileName',
      render: text => <a>{text}</a>,
    },
    {
      title: '日期',
      dataIndex: 'fileDate',
      key: 'fileDate',
    },
    {
      title: '大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
    },
    {
      title: '操作',
      key: 'fileAction',
      render: (text, record) => (
        <span>
          <a
            style={{
              marginRight: 16,
            }}
          >
            下载
          </a>
        </span>
      ),
    },
  ];
  const data = [
    {
      key: '1',
      fileName: '实验说明书.jpg',
      fileDate: '2020-5-7',
      fileSize: '167 KB',
    },
  ];
  const onFinish = values => {
    const { dispatch } = props;
    dispatch({
      type: 'labsAndMarkLab/submitRegularForm',
      payload: values,
    });
  };

  const onFinishFailed = errorInfo => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };

  const onValuesChange = changedValues => {
    const { publicType } = changedValues;
    if (publicType) setShowPublicUsers(publicType === '2');
  };

  return (
    <PageContainer content="labsandmarklab.basic.description">
      <Card bordered={false}>
        <Form
          hideRequiredMark
          style={{
            marginTop: 8,
          }}
          form={form}
          name="basic"
          initialValues={{
            public: '1',
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onValuesChange={onValuesChange}
        >
          <FormItem {...formItemLayout} label="下载附件" name="goal">
            <Table pagination={false} columns={columns} dataSource={data} />
          </FormItem>
          <FormItem>
            <ProFormUploadDragger {...formItemLayout} max={4} label="提交报告" name="upload" />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={
              <span>
                labsandmarklab.weight.label
                <em className={styles.optional}>labsandmarklab.form.optional</em>
              </span>
            }
            name="weight"
          >
            <InputNumber placeholder=" " min={0} max={100} />
            <span className="ant-form-text">%</span>
          </FormItem>
          <FormItem {...formItemLayout} label="教师评语" name="labReview">
            <TextArea
              style={{
                minHeight: 32,
              }}
              placeholder=""
              rows={4}
            />
          </FormItem>
          <FormItem
            {...submitFormLayout}
            style={{
              marginTop: 48,
            }}
          >
            <Button>保存草稿</Button>
            <Button
              style={{
                marginLeft: 16,
              }}
              type="primary"
              htmlType="submit"
              loading={submitting}
            >
              提交作业
            </Button>
          </FormItem>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['labsAndMarkLab/submitRegularForm'],
}))(MarkLab);
