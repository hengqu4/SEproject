import {Badge,Card,Descriptions,Popover,Table,} from 'antd';
import { GridContent, PageContainer, RouteContext } from '@ant-design/pro-layout';
import React, { Component, Fragment } from 'react';
import { connect } from 'umi';
import styles from './style.less';

const tmpData = {
  courseID: '1111',
  courseName: '计算机网络',
  courseCreatorSchoolId: '同济大学',
  courseCredit: '3',
  courseStudyTimeNeeded: '51',
  courseType: '理论课',
  courseDescription: '这是一门好课！！',
  courseStartTime: '2020-9-14',
  courseEndTime: '2021-1-22',
  lectureCount: '25',
  experimentCount: '17',
  homeworkCount: '2',
  contestCount:'2'
}

class CourseInfo extends Component {
  state = {
    operationKey: 'tab1',
    tabActiveKey: 'detail',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'courseAndCourseInfo/fetchAdvanced',
    });
  }

  onOperationTabChange = (key) => {
    this.setState({
      operationKey: key,
    });
  };
  onTabChange = (tabActiveKey) => {
    this.setState({
      tabActiveKey,
    });
  };

  render() {
    const { operationKey, tabActiveKey } = this.state;
    const { courseAndCourseInfo, loading } = this.props;
    const { advancedOperation1, advancedOperation2, advancedOperation3 } = courseAndCourseInfo;
    
    return (
      <PageContainer>
        <div className={styles.main}>
          <Card>
          <Descriptions bordered>
              <Descriptions.Item label="课程ID">{ tmpData.courseID}</Descriptions.Item>
              <Descriptions.Item label="课程名称">{ tmpData.courseName}</Descriptions.Item>
              <Descriptions.Item label="开课学校">{ tmpData.courseCreatorSchoolId}</Descriptions.Item>
              <Descriptions.Item label="课程学分">{ tmpData.courseCredit}</Descriptions.Item>
              <Descriptions.Item label="课程学时">{ tmpData.courseStudyTimeNeeded}</Descriptions.Item>
              <Descriptions.Item label="课程类型">{ tmpData.courseType}</Descriptions.Item>
              <Descriptions.Item label="课程开始时间">{ tmpData.courseStartTime}</Descriptions.Item>
              <Descriptions.Item label="课程结束时间">{ tmpData.courseEndTime}</Descriptions.Item>
              <Descriptions.Item label="理论课次数">{ tmpData.lectureCount}</Descriptions.Item>
              <Descriptions.Item label="实验课次数">{ tmpData.experimentCount}</Descriptions.Item>
              <Descriptions.Item label="作业次数">{ tmpData.homeworkCount}</Descriptions.Item>
              <Descriptions.Item label="对抗练习次数">{ tmpData.contestCount}</Descriptions.Item>
              <Descriptions.Item label="课程描述">{ tmpData.courseDescription}</Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      </PageContainer>
    );
  }
}

export default connect(({ courseAndCourseInfo, loading }) => ({
  courseAndCourseInfo,
  loading: loading.effects['courseAndCourseInfo/fetchAdvanced'],
}))(CourseInfo);
