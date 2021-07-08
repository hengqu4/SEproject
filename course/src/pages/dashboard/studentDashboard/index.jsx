import { EllipsisOutlined } from '@ant-design/icons'
import { Col, Dropdown, Menu, Row } from 'antd'
import React, { Component, Suspense } from 'react'
import { GridContent } from '@ant-design/pro-layout'
import { connect } from 'umi'
import PageLoading from './components/PageLoading'
import { getTimeDistance } from './utils/utils'
import styles from './style.less'

const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'))
const SalesCard = React.lazy(() => import('./components/SalesCard'))
const TopSearch = React.lazy(() => import('./components/TopSearch'))
const ProportionSales = React.lazy(() => import('./components/ProportionSales'))
const OfflineData = React.lazy(() => import('./components/OfflineData'))

class Analysis extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
  }

  reqRef = 0

  timeoutId = 0

  componentDidMount() {
    const { dispatch } = this.props
    console.log(this.props, '*&*')
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'studentDashboard/fetch',
      })
    })
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    console.log(this.props, '*&*')
    dispatch({
      type: 'studentDashboard/clear',
    })
    cancelAnimationFrame(this.reqRef)
    clearTimeout(this.timeoutId)
  }

  handleChangeSalesType = (e) => {
    const { dispatch } = this.props
    this.setState({
      salesType: e.target.value,
    })
    dispatch({
      type: 'studentDashboard/fetchSalesData',
    })
    console.log('aaaaaa')
  }

  handleTabChange = (key) => {
    this.setState({
      currentTabKey: key,
    })
  }


  selectDate = (type) => {
    const { dispatch } = this.props
    console.log(this.props, '*&*')
    this.setState({
      rangePickerValue: getTimeDistance(type),
    })
    dispatch({
      type: 'studentDashboard/fetchSalesData',
    })
  }

  isActive = (type) => {
    const { rangePickerValue } = this.state

    if (!rangePickerValue) {
      return ''
    }

    const value = getTimeDistance(type)

    if (!value) {
      return ''
    }

    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return ''
    }

    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate
    }

    return ''
  }

  render() {
    const { rangePickerValue, salesType, currentTabKey } = this.state
    const { studentDashboard, loading } = this.props
    const {
      studentGrade
    } = studentDashboard
    let salesPieData

    if (salesType === 'all') {
      salesPieData = studentGrade
    } else {
      salesPieData = salesType === 'online' ? studentGrade : studentGrade
    }

    const dropdownGroup = (
      <span className={styles.iconGroup}>
      </span>
    )
    return (
      <GridContent>
        <React.Fragment>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <ProportionSales
                dropdownGroup={dropdownGroup}
                salesType={salesType}
                loading={loading}
                salesPieData={studentGrade}
                handleChangeSalesType={this.handleChangeSalesType}
              />
            </Suspense>
          </Col>
        </React.Fragment>
      </GridContent>
    )
  }
}

export default connect(({ studentDashboard, loading }) => ({
  studentDashboard,
  loading: loading.effects['studentDashboard/fetch'],
}))(Analysis)
