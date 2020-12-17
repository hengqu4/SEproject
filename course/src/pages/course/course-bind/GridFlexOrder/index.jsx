import React from 'react';
import styles from './index.less';
import { Row, Col } from 'antd';
import CourseSelection from '../CourseSelection';
import TeacherSelection from '../TeacherSelection';
export default () => (
  <div className={styles.container}>
    <div id="components-grid-demo-flex-order">
      <Row>
        <Col span={12} order={1}>
          <CourseSelection/>
        </Col>
        <Col span={12} order={2}>
          <TeacherSelection />
        </Col>
      </Row>
    </div>
  </div>
);
