import { EllipsisOutlined } from '@ant-design/icons';
import { Col, Dropdown, Menu, Row } from 'antd';
import React, { Component, Suspense } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'umi';
import PageLoading from './components/PageLoading';
import { getTimeDistance } from './utils/utils';
import styles from './style.less';
import TableEditRow from './TableEditRow';
import FormDynamicRule from './FormDynamicRule';
const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'));
const SalesCard = React.lazy(() => import('./components/SalesCard'));
const TopSearch = React.lazy(() => import('./components/TopSearch'));
const ProportionSales = React.lazy(() => import('./components/ProportionSales'));

class Analysis extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
  };
  reqRef = 0;
  timeoutId = 0;

  componentDidMount() {
    const { dispatch, Course, user } = this.props;
    console.log(Course.currentCourseInfo.courseId, '*&*');
    console.log(user.currentUser.id, '*&*'); // this.reqRef = requestAnimationFrame(() => {
    //   dispatch({
    //     type: 'teacherDashboard/fetch',
    //   })
    // })
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    console.log(this.props, '*&*');
    dispatch({
      type: 'teacherDashboard/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };
  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };
  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props;
    console.log(this.props, '*&*');
    this.setState({
      rangePickerValue,
    });
    dispatch({
      type: 'teacherDashboard/fetchSalesData',
    });
  };
  selectDate = type => {
    const { dispatch } = this.props;
    console.log(this.props, '*&*');
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });
    dispatch({
      type: 'teacherDashboard/fetchSalesData',
    });
  };
  isActive = type => {
    const { rangePickerValue } = this.state;

    if (!rangePickerValue) {
      return '';
    }

    const value = getTimeDistance(type);

    if (!value) {
      return '';
    }

    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }

    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }

    return '';
  };

  render() {
    const { rangePickerValue, salesType, currentTabKey } = this.state;
    const { teacherDashboard, loading } = this.props;
    const { salesTypeData } = teacherDashboard;
    let salesPieData;

    if (salesType === 'all') {
      salesPieData = salesTypeData;
    } else {
      salesPieData = salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;
    }

    const dropdownGroup = <span className={styles.iconGroup}></span>;
    return (
      <GridContent>
        <FormDynamicRule />
        {/* <TableEditRow /> */}
      </GridContent>
    );
  }
}

export default connect(({ Course, user, teacherDashboard, loading }) => ({
  Course,
  user,
  teacherDashboard,
  loading: loading.effects['teacherDashboard/fetch'],
}))(Analysis);
