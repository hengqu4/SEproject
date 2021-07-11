import { ConsoleSqlOutlined, EllipsisOutlined } from '@ant-design/icons'
import { Col, Dropdown, Menu, Row, Button } from 'antd'
import React, { Component, Suspense } from 'react'
import { GridContent } from '@ant-design/pro-layout'
import { connect } from 'umi'
import PageLoading from './components/PageLoading'
import { getTimeDistance } from './utils/utils'
import styles from './style.less'
import TableEditRow from './TableEditRow'
import FormDynamicRule from './FormDynamicRule'
import { Importer, ImporterField } from 'react-csv-importer'
import { DownloadOutlined } from '@ant-design/icons'

import 'react-csv-importer/dist/index.css'

const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'))
const SalesCard = React.lazy(() => import('./components/SalesCard'))
const TopSearch = React.lazy(() => import('./components/TopSearch'))
const ProportionSales = React.lazy(() => import('./components/ProportionSales'))
const gradeKeys = [
  'student_id',
  'assignment_point',
  'exam1_point',
  'exam2_point',
  'experiment_point',
  'contest_point',
  'attendance_point',
  'bonus_point',
]

class Analysis extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
  }

  reqRef = 0

  timeoutId = 0

  componentDidMount() {
    const { dispatch, Course, user } = this.props
    console.log(Course.currentCourseInfo.courseId, '*&*')
    console.log(user.currentUser.id, '*&*')
    // this.reqRef = requestAnimationFrame(() => {
    //   dispatch({
    //     type: 'teacherDashboard/fetch',
    //   })
    // })
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    console.log(this.props, '*&*')
    dispatch({
      type: 'teacherDashboard/clear',
    })
    cancelAnimationFrame(this.reqRef)
    clearTimeout(this.timeoutId)
  }

  handleChangeSalesType = (e) => {
    this.setState({
      salesType: e.target.value,
    })
  }

  handleTabChange = (key) => {
    this.setState({
      currentTabKey: key,
    })
  }

  handleRangePickerChange = (rangePickerValue) => {
    const { dispatch } = this.props
    console.log(this.props, '*&*')
    this.setState({
      rangePickerValue,
    })
    dispatch({
      type: 'teacherDashboard/fetchSalesData',
    })
  }

  selectDate = (type) => {
    const { dispatch } = this.props
    console.log(this.props, '*&*')
    this.setState({
      rangePickerValue: getTimeDistance(type),
    })
    dispatch({
      type: 'teacherDashboard/fetchSalesData',
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

  exportCSV = (obj) => {
    const { Course } = this.props
    const titleForKey = Object.keys(obj.data[0])
    const { data } = obj
    let str = []
    str.push(`${obj.title.join(',')}\n`)
    for (let i = 0; i < data.length; i++) {
      let temp = []
      for (let j = 0; j < titleForKey.length; j++) {
        temp.push(data[i][titleForKey[j]])
      }
      console.log(temp)
      str.push(`${temp.join(',')}\n`)
    }
    const blob = new Blob([`\uFEFF${str.join('')}`], {
      type: 'text/plain;charset=utf-8',
    })
    const downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(blob)
    downloadLink.download = `《${Course.currentCourseInfo.courseName}》成绩导入模板.csv`
    downloadLink.click()
  }

  downloadCSV = () => {
    const { teacherDashboard } = this.props
    const gradeDataa = teacherDashboard.gradeData
    console.log(gradeDataa)
    const title = ['Student_ID', 'Student_Name', 'Matriculation_ID', 'Bonus']
    let data = []
    for (const item of gradeDataa) {
      data.push({
        Student_ID: item.studentId,
        Student_Name: item.name,
        Matriculation_ID: item.m_id,
        Bonus: '',
      })
    }
    this.exportCSV({ title, data })
  }

  updateBulkRow = (row) => {
    const { dispatch, Course } = this.props
    let bonus_point = Number(row.bonus_point)
    if (!(bonus_point >= 0 && bonus_point <= 100)) bonus_point = 0
    dispatch({
      type: 'teacherDashboard/setBonus',
      payload: {
        courseId: Course.currentCourseInfo.courseId,
        studentId: row.student_id,
        bonus_point,
      },
    })
  }

  onFinishBulkImport = () => {
    const { dispatch, Course } = this.props
    let studentMap = Course.courseStudentMap
    dispatch({
      type: 'teacherDashboard/getGrade',
      payload: {
        courseId: Course.currentCourseInfo.courseId,
        studentMap: studentMap.get(Course.currentCourseInfo.courseId),
      },
    })
  }

  render() {
    const { rangePickerValue, salesType, currentTabKey } = this.state
    const { Course, teacherDashboard, loading } = this.props
    const { studentGradeWeight, weightPieData } = teacherDashboard
    console.log(Course.currentCourseInfo)
    let courseName = Course.currentCourseInfo.courseName
    return (
      <GridContent>
        <div style={{ fontSize: '20px', margin: '10px' }}>《{courseName}》成绩权重设置</div>
        <Row
          gutter={24}
          style={{
            marginTop: 24,
          }}
        >
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <ProportionSales loading={loading} salesPieData={weightPieData} />
            </Suspense>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <FormDynamicRule />
          </Col>
        </Row>
        <div style={{ fontSize: '20px', margin: '10px', marginTop: '24px' }}>
          《{courseName}》成绩管理
        </div>
        <div style={{ fontSize: '18px', margin: '10px', marginTop: '24px' }}>成绩详情</div>
        <Row
          gutter={24}
          style={{
            marginTop: 24,
          }}
        >
          <Col xl={24} lg={48} md={48} sm={48} xs={48}>
            <TableEditRow />
          </Col>
        </Row>
        <Row
          gutter={24}
          style={{
            marginTop: 24,
          }}
        >
          <div style={{ fontSize: '18px', marginLeft: '10px' }}>批量导入</div>
          <Button
            type='primary'
            shape='round'
            icon={<DownloadOutlined />}
            size={'default'}
            style={{ marginLeft: '10px' }}
            loading={loading}
            onClick={this.downloadCSV}
          >
            下载成绩导入模板
          </Button>
        </Row>
        <Row
          gutter={24}
          style={{
            marginTop: 24,
          }}
        >
          <Col xl={24} lg={48} md={48} sm={48} xs={48}>
            <Importer
              chunkSize={10000} // optional, internal parsing chunk size in bytes
              assumeNoHeaders={false} // optional, keeps "data has headers" checkbox off by default
              restartable={false} // optional, lets user choose to upload another file when import is complete
              onStart={({ file, fields, columns, skipHeaders }) => {
                // optional, invoked when user has mapped columns and started import
                // prepMyAppForIncomingData()
              }}
              processChunk={async (rows, { startIndex }) => {
                // required, receives a list of parsed objects based on defined fields and user column mapping;
                // may be called several times if file is large
                // (if this callback returns a promise, the widget will wait for it before parsing more data)
                // eslint-disable-next-line no-restricted-syntax

                for (let row of rows) {
                  console.log(row)
                  this.updateBulkRow(row)
                }
              }}
              onComplete={({ file, preview, fields, columnFields }) => {
                // optional, invoked right after import is done (but user did not dismiss/reset the widget yet)
                // showMyAppToastNotification()
              }}
              onClose={({ file, preview, fields, columnFields }) => {
                // optional, invoked when import is done and user clicked "Finish"
                // (if this is not specified, the widget lets the user upload another file)
                // goToMyAppNextPage()
                this.onFinishBulkImport()
              }}
            >
              <ImporterField name='student_id' label='Student_ID' />
              <ImporterField name='name' label='Student_Name' optional />
              <ImporterField name='m_id' label='Matriculation_ID' optional />
              <ImporterField name='bonus_point' label='Bonus' />
            </Importer>
          </Col>
        </Row>
      </GridContent>
    )
  }
}

export default connect(({ Course, user, teacherDashboard, loading }) => ({
  Course,
  user,
  teacherDashboard,
  loading: loading.effects['teacherDashboard/fetch'],
}))(Analysis)
