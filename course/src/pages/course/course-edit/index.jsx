import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Card, TimePicker, Input, Form, InputNumber, Radio, Select, Tooltip } from 'antd';
import { connect, FormattedMessage, formatMessage } from 'umi';
import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './style.less';
import { useState } from 'react';
import UploadAvatar from './UploadAvatar';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = TimePicker;
const { TextArea } = Input; // const { formLayout } = useState('inline')

const CourseEdit = props => {
  const { submitting } = props;
  const [form] = Form.useForm();
  const [showPublicUsers, setShowPublicUsers] = React.useState(false);
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 7,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 12,
      },
      md: {
        span: 10,
      },
    },
  };
  const submitFormLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 10,
        offset: 7,
      },
    },
  };

  const onFinish = values => {
    const { dispatch } = props;
    dispatch({
      type: 'courseSettingAndCourseEdit/submitRegularForm',
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
    <PageContainer >
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
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="courseedit.courseAvatar.label" />}
            name="courseAvatar"
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'courseedit.courseAvatar.required',
                }),
              },
            ]}
          >
            <UploadAvatar />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="courseedit.courseName.label" />}
            name="courseName"
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'courseedit.courseName.required',
                }),
              },
            ]}
          >
            <Input
              placeholder={formatMessage({
                id: 'courseedit.courseName.placeholder',
              })}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="courseedit.courseCredit.label" />}
            name="courseCredit"
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'courseedit.courseCredit.required',
                }),
              },
            ]}
          >
            <Input
              placeholder={formatMessage({
                id: 'courseedit.courseCredit.placeholder',
              })}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="courseedit.courseStudyTimeNeeded.label" />}
            name="courseStudyTimeNeeded"
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'courseedit.courseStudyTimeNeeded.required',
                }),
              },
            ]}
          >
            <Input
              placeholder={formatMessage({
                id: 'courseedit.courseStudyTimeNeeded.placeholder',
              })}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="courseedit.courseDescription.label" />}
            name="courseDescription"
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'courseedit.courseDescription.required',
                }),
              },
            ]}
          >
            <TextArea
              style={{
                minHeight: 32,
              }}
              placeholder={formatMessage({
                id: 'courseedit.courseDescription.placeholder',
              })}
              rows={4}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="courseedit.courseTime.label" />}
            name="courseTime"
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'courseedit.courseTime.required',
                }),
              },
            ]}
          >
            <RangePicker
              style={{
                width: '100%',
              }}
              placeholder={[
                formatMessage({
                  id: 'courseedit.courseTime.placeholder.start',
                }),
                formatMessage({
                  id: 'courseedit.courseTime.placeholder.end',
                }),
              ]}
            />

          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="courseedit.teacherName.label" />}
            name="courseName"
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'courseedit.teacherName.required',
                }),
              },
            ]}
          >
            <Input
              placeholder={formatMessage({
                id: 'courseedit.teacherName.placeholder',
              })}
            />
          </FormItem>

          {/* <Row>
           <Col span={12}> 
           
           </Col><Col span={12}> 
           <FormItem
           {...formItemLayout}
           label={<FormattedMessage id='courseedit.lectureCount.label' />}
           name='lectureCount'
          >
           <InputNumber
             placeholder={formatMessage({
               id: 'courseedit.lectureCount.placeholder',
             })}
             min={0}
             max={60}
           />
          </FormItem>
           </Col>
          </Row> */}

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="courseedit.lectureCount.label" />}
            name="lectureCount"
          >
            <InputNumber
              style={{
                width: '50%',
              }}
              placeholder={formatMessage({
                id: 'courseedit.lectureCount.placeholder',
              })}
              min={0}
              max={60}
            />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="courseedit.experimentCount.label" />}
            name="experimentCount"
          >
            <InputNumber
              style={{
                width: '50%',
              }}
              placeholder={formatMessage({
                id: 'courseedit.experimentCount.placeholder',
              })}
              min={0}
              max={60}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="courseedit.homeworkCount.label" />}
            name="homeworkCount"
          >
            <InputNumber
              style={{
                width: '50%',
              }}
              placeholder={formatMessage({
                id: 'courseedit.homeworkCount.placeholder',
              })}
              min={0}
              max={60}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="courseedit.contestCount.label" />}
            name="contestCount"
          >
            <InputNumber
              style={{
                width: '50%',
              }}
              placeholder={formatMessage({
                id: 'courseedit.contestCount.placeholder',
              })}
              min={0}
              max={60}
            />
          </FormItem>
          {/* <FormItem
          {...formItemLayout}
          label={
           <span>
             <FormattedMessage id="coursesettingandcourseedit.client.label" />
             <em className={styles.optional}>
               <FormattedMessage id="coursesettingandcourseedit.form.optional" />
               <Tooltip
                 title={<FormattedMessage id="coursesettingandcourseedit.label.tooltip" />}
               >
                 <InfoCircleOutlined
                   style={{
                     marginRight: 4,
                   }}
                 />
               </Tooltip>
             </em>
           </span>
          }
          name="client"
          >
          <Input
           placeholder={formatMessage({
             id: 'coursesettingandcourseedit.client.placeholder',
           })}
          />
          </FormItem> */}
          {/* <FormItem
          {...formItemLayout}
          label={
           <span>
             <FormattedMessage id="coursesettingandcourseedit.invites.label" />
             <em className={styles.optional}>
               <FormattedMessage id="coursesettingandcourseedit.form.optional" />
             </em>
           </span>
          }
          name="invites"
          >
          <Input
           placeholder={formatMessage({
             id: 'coursesettingandcourseedit.invites.placeholder',
           })}
          />
          </FormItem> */}
          {/* <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="coursesettingandcourseedit.public.label" />}
          help={<FormattedMessage id="coursesettingandcourseedit.label.help" />}
          name="publicType"
          >
          <div>
           <Radio.Group>
             <Radio value="1">
               <FormattedMessage id="coursesettingandcourseedit.radio.public" />
             </Radio>
             <Radio value="2">
               <FormattedMessage id="coursesettingandcourseedit.radio.partially-public" />
             </Radio>
             <Radio value="3">
               <FormattedMessage id="coursesettingandcourseedit.radio.private" />
             </Radio>
           </Radio.Group>
           <FormItem
             style={{
               marginBottom: 0,
             }}
             name="publicUsers"
           >
             <Select
               mode="multiple"
               placeholder={formatMessage({
                 id: 'coursesettingandcourseedit.publicUsers.placeholder',
               })}
               style={{
                 margin: '8px 0',
                 display: showPublicUsers ? 'block' : 'none',
               }}
             >
               <Option value="1">
                 <FormattedMessage id="coursesettingandcourseedit.option.A" />
               </Option>
               <Option value="2">
                 <FormattedMessage id="coursesettingandcourseedit.option.B" />
               </Option>
               <Option value="3">
                 <FormattedMessage id="coursesettingandcourseedit.option.C" />
               </Option>
             </Select>
           </FormItem>
          </div>
             </FormItem> */}
          <FormItem
            {...submitFormLayout}
            style={{
              marginTop: 32,
            }}
          >
            <Button type="primary" htmlType="submit" loading={submitting}>
              <FormattedMessage id="coursesettingandcourseedit.form.submit" />
            </Button>
            <Button
              style={{
                marginLeft: 8,
              }}
            >
              <FormattedMessage id="coursesettingandcourseedit.form.save" />
            </Button>
          </FormItem>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['courseSettingAndCourseEdit/submitRegularForm'],
}))(CourseEdit);
