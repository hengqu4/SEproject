import { Button, Tabs, Card, Radio, notification } from 'antd'
import React, { useState } from 'react'
import { GridContent } from '@ant-design/pro-layout'
import { Link } from 'react-router-dom'
import { connect } from 'umi'
import { useMount } from 'react-use'
import Pie from './components/Charts/Pie'
import Submit from './components/Submit'

const salesTypeData = [
  {
    x: '90+',
    y: 30,
  },
  {
    x: '80~90',
    y: 20,
  },
  {
    x: '70~80',
    y: 30,
  },
  {
    x: '60~70',
    y: 15,
  },
  {
    x: '60-',
    y: 5,
  },
  {
    x: '未批改',
    y: 10,
  },
]

const { TabPane } = Tabs

const AllLabCase = ({ lab }) => ({
  isSuccess: lab.isSuccess,
  allLabsData: lab.allLabCaseList,
  labStatistics: lab.labStatistics,
})

const AnalyseLabCase = ({ allLabsData = [], labStatistics = {}, dispatch = () => {} }) => {
  const [analyseType, setAnalyseType] = useState(0)
  const [currentLab, setCurrentLab] = useState()
  const [labAnalyseDataSum, setLabAnalyseDataSum] = useState(0)
  const [labAnalyseDataArray, setAnalyseDataArray] = useState([])
  const [submitVisible, setSubmitVisible] = useState(false)
  const [labAnaylyseDataTitle, setLabAnaylyseDataTitle] = useState('提交总数')

  const fetchLabStatistics = () => {
    dispatch({
      type: 'lab/fetchLabStatistics',
      payload: currentLab == null ? allLabsData[0].courseCaseId : currentLab,
      onError: (err) => {
        notification.error({
          message: '获取统计信息失败',
          description: err.message,
        })
      },
      onSuccess: () => {
        console.log(labStatistics)
      },
    })
  }

  const modifyStatistics = (prop) => {
    if (prop.scoreDistributed == null) {
      setAnalyseDataArray([])
      setLabAnalyseDataSum(0)
      return
    }
    const statisticsData = [
      {
        x: '90+',
        y: prop.scoreDistributed[4],
      },
      {
        x: '80~90',
        y: prop.scoreDistributed[3],
      },
      {
        x: '70~80',
        y: prop.scoreDistributed[2],
      },
      {
        x: '60~70',
        y: prop.scoreDistributed[1],
      },
      {
        x: '60-',
        y: prop.scoreDistributed[0],
      },
      {
        x: '未批改',
        y: prop.unremarkedNum,
      },
    ]
    setAnalyseDataArray(statisticsData)
    setLabAnalyseDataSum(labStatistics.remarkedNum + labStatistics.unremarkedNum)
  }

  const handleAnalyseChange = (e) => {
    setAnalyseType(e.target.value)
    // TODO: update analyseData
  }

  const onLabTabChange = (key) => {
    // TODO: change labs' data
    setCurrentLab(key)
  }

  const onLinkClicked = () => {
    // TODO: get currentLab course_case_id
    console.log(currentLab == null ? allLabsData[0].courseCaseId : currentLab)
  }

  const onSubmitCanceled = () => {
    setSubmitVisible(false)
  }

  const onSubmitOk = () => {
    const labKey = currentLab == null ? allLabsData[0].courseCaseId : currentLab
    dispatch({
      type: 'lab/remarkSubmission',
      payload: labKey,
      onError: (err) => {
        notification.error({
          message: '得分发布失败',
          description: err.message,
        })
      },
      onSuccess: () => {
        notification.success({
          message: '得分发布成功',
          description: '得分已发布',
        })
      },
    })
    setSubmitVisible(false)
  }

  useMount(() => {
    dispatch({
      type: 'lab/fetchAllLabCase',
      payload: 1,
      onError: (err) => {
        notification.error({
          message: '获取统计信息失败',
          description: err.message,
        })
      },
      onSuccess: () => {
        modifyStatistics(labStatistics)
      },
    })
  })

  return (
    <GridContent>
      <React.Fragment>
        <Card
          title='实验统计'
          style={{
            height: '100%',
          }}
          extra={
            <div>
              <Radio.Group value={analyseType} onChange={handleAnalyseChange}>
                <Radio.Button value={0}> 得分分布 </Radio.Button>
                <Radio.Button value={1}>提交情况</Radio.Button>
              </Radio.Group>
            </div>
          }
        >
          <div>
            <Tabs
              tabPosition='left'
              style={{
                height: '100%',
                width: '80%',
              }}
              size='large'
              onChange={onLabTabChange}
            >
              {allLabsData.map((i) => (
                <TabPane tab={i.caseId} key={i.courseCaseId}>
                  <div>
                    <h4
                      style={{
                        marginTop: 8,
                        marginBottom: 32,
                      }}
                    >
                      统计数据
                    </h4>
                    <Pie
                      hasLegend
                      subTitle={labAnaylyseDataTitle}
                      total={() => <p>{labAnalyseDataSum}</p>}
                      data={labAnalyseDataArray}
                      valueFormat={(value) => <p>{value}</p>}
                      height={248}
                      lineWidth={4}
                    />
                    <Button
                      type='primary'
                      style={{
                        height: 35,
                        width: 100,
                        marginLeft: 0,
                      }}
                      onClick={() => {
                        setSubmitVisible(true)
                      }}
                    >
                      发布成绩
                    </Button>
                    <Button
                      type='link'
                      style={{
                        height: 35,
                        width: 120,
                        marginLeft: '50%',
                      }}
                    >
                      <Link
                        to={{
                          pathname: `/labs/pending-list/${
                            currentLab == null ? allLabsData[0].courseCaseId : currentLab
                          }`,
                        }}
                        onClick={onLinkClicked}
                      >
                        查看学生提交记录
                      </Link>
                    </Button>
                  </div>
                </TabPane>
              ))}
            </Tabs>
          </div>
        </Card>
        <Submit
          modelVisible={submitVisible}
          handleOk={onSubmitOk}
          handleCancel={onSubmitCanceled}
        />
      </React.Fragment>
    </GridContent>
  )
}

export default connect(AllLabCase)(AnalyseLabCase)
