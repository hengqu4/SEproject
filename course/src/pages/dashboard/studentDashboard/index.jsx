import { EllipsisOutlined } from '@ant-design/icons'
import { Col, Result, Card } from 'antd'
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

  handleChangeSalesType = (e) => {
    const { dispatch } = this.props
    this.setState({
      salesType: e.target.value,
    })
    dispatch({
      type: 'studentDashboard/fetchSalesData',
    })
  }

  render() {
    const { salesType } = this.state
    const { studentDashboard, loading } = this.props
    const { studentGrade, isReleased } = studentDashboard
    let salesPieData

    if (salesType === 'all') {
      salesPieData = studentGrade
    } else {
      salesPieData = salesType === 'online' ? studentGrade : studentGrade
    }
    console.log(isReleased)
    const dropdownGroup = <span className={styles.iconGroup}></span>
    if (isReleased)
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
    else
      return (
        <GridContent>
          <React.Fragment>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Card
                loading={loading}
                bordered={false}
                title='成绩构成'
                style={{
                  height: '100%',
                  width: '120%',
                }}
              >
                <Result status='warning' title='成绩尚未发布' />
              </Card>
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
