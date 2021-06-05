import { Button, Tabs, Card, Radio, notification } from 'antd'
import React, { useEffect, useState } from 'react'
import { GridContent } from '@ant-design/pro-layout'
import { ArrowRightOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { connect } from 'umi'
import { useMount } from 'react-use'
import Pie from './components/Charts/Pie'
import Submit from './components/Submit'

const { TabPane } = Tabs

const AllLabCase = ({ lab, Course }) => ({
  isSuccess: lab.isSuccess,
  allLabsData: lab.allLabCaseList,
  labStatistics: lab.labStatistics,
  courseId: Course.currentCourseInfo.courseId
})

const AnalyseLabCase = ({ allLabsData = [], labStatistics = {}, courseId, dispatch = () => {} }) => {
  const [analyseType, setAnalyseType] = useState(0)
  const [currentLab, setCurrentLab] = useState(0)
  const [labAnalyseDataSum, setLabAnalyseDataSum] = useState(0)
  const [labAnalyseDataArray, setAnalyseDataArray] = useState([])
  const [submitVisible, setSubmitVisible] = useState(false)
  const [labAnaylyseDataTitle, setLabAnaylyseDataTitle] = useState('提交总数')

  const modifyStatistics = (prop, type) => {
    if (type === 0) {
      if (prop.scoreDistributed == null) {
        setAnalyseDataArray([
          {
            x: '90+',
            y: 0,
          },
          {
            x: '80~90',
            y: 0,
          },
          {
            x: '70~80',
            y: 0,
          },
          {
            x: '60~70',
            y: 0,
          },
          {
            x: '60-',
            y: 0,
          },
          {
            x: '未批改',
            y: 0,
          },
        ])
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
      setLabAnaylyseDataTitle('提交总数')
      setLabAnalyseDataSum(prop.remarkedNum + prop.unremarkedNum)
    } else {
      if (prop.submittedNum == null) {
        setAnalyseDataArray([
          {
            x: '已提交',
            y: 0,
          },
          {
            x: '未提交',
            y: 0,
          },
        ])
        setLabAnalyseDataSum(0)
        return
      }
      const statisticsData = [
        {
          x: '已提交',
          y: prop.submittedNum,
        },
        {
          x: '未提交',
          y: prop.unsubmittedNum,
        },
      ]
      setAnalyseDataArray(statisticsData)
      setLabAnaylyseDataTitle('总学生数')
      setLabAnalyseDataSum(prop.submittedNum + prop.unsubmittedNum)
    }
  }

  const statisticsData = () =>{
    const result = {
      array:[],
      title: '提交总数',
      sum: 0,
    }
    if(analyseType == 0){
      if(labStatistics.scoreDistributed == null){
        result.array = [
          {
            x: '90+',
            y: 0,
          },
          {
            x: '80~90',
            y: 0,
          },
          {
            x: '70~80',
            y: 0,
          },
          {
            x: '60~70',
            y: 0,
          },
          {
            x: '60-',
            y: 0,
          },
          {
            x: '未批改',
            y: 0,
          },
        ]
      }else{
        result.array = [
          {
          x: '90+',
          y: labStatistics.scoreDistributed[4],
        },
        {
          x: '80~90',
          y: labStatistics.scoreDistributed[3],
        },
        {
          x: '70~80',
          y: labStatistics.scoreDistributed[2],
        },
        {
          x: '60~70',
          y: labStatistics.scoreDistributed[1],
        },
        {
          x: '60-',
          y: labStatistics.scoreDistributed[0],
        },
        {
          x: '未批改',
          y: labStatistics.unremarkedNum,
        },
      ]
        result.sum = labStatistics.remarkedNum + labStatistics.unremarkedNum
      }
    }else{
      if(labStatistics.submittedNum == null){
        result.array = [
          {
            x: '已提交',
            y: 0,
          },
          {
            x: '未提交',
            y: 0,
          },
        ]
      }else{
        result.array = [
          {
            x: '已提交',
            y: labStatistics.submittedNum,
          },
          {
            x: '未提交',
            y: labStatistics.unsubmittedNum,
          },
        ]
        result.title = '总学生数'
        result.sum = labStatistics.submittedNum + labStatistics.unsubmittedNum
      }
    }
    return result
  }

  const fetchLabStatistics = () => {
    dispatch({
      type: 'lab/fetchLabStatistics',
      payload: currentLab,
      onError: (err) => {
        notification.error({
          message: '获取统计信息失败',
          description: err.message,
        })
      },
      onSuccess: () => {
        modifyStatistics(labStatistics, analyseType)
      },
    })
  }

  useEffect(() => {
    if(currentLab != 0){
      fetchLabStatistics()
    }
  }, [currentLab])

  const handleAnalyseChange = (e) => {
    modifyStatistics(labStatistics, e.target.value)
    setAnalyseType(e.target.value)
  }

  const onLabTabChange = (key) => {
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

  //FIXME: undefined courseCaseId when allLabsData is []
  useMount(() => {
    dispatch({
      type: 'lab/fetchAllLabCase',
      payload: courseId,
      onError: (err) => {
        notification.error({
          message: '获取统计信息失败',
          description: err.message,
        })
      },
      onSuccess: () => {
        modifyStatistics(labStatistics, analyseType)
        setCurrentLab(allLabsData[0].courseCaseId)
      },
    })
  })

  useEffect(() => {
    dispatch({
      type: 'lab/fetchAllLabCase',
      payload: courseId,
      onError: (err) => {
        notification.error({
          message: '获取统计信息失败',
          description: err.message,
        })
      },
      onSuccess: () => {
        modifyStatistics(labStatistics, analyseType)
      },
    })
  }, [courseId])

  return (
    <GridContent>
      <React.Fragment>
        <Card
          title='学生实验得分统计'
          style={{
            height: '100%',
          }}
          extra={
            <div>
              <Radio.Group defaultValue={analyseType} onChange={handleAnalyseChange}>
                <Radio.Button value={0}> 得分分布 </Radio.Button>
                <Radio.Button value={1}> 提交情况 </Radio.Button>
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
                <TabPane tab={i.experimentName} key={i.courseCaseId}>
                  <div>
                    <span
                      style={{
                        marginTop: 8,
                        marginBottom: 32,
                      }}
                    >
                      统计数据
                    </span>
                    <Button
                      type='primary'
                      style={{ marginLeft: '60%' }}
                      onClick={() => {
                        setSubmitVisible(true)
                      }}
                    >
                      发布成绩
                    </Button>
                    <Link
                      to={{
                        pathname: `/labs/pending-list/${
                          currentLab == null ? allLabsData[0].courseCaseId : currentLab
                        }`,
                      }}
                      onClick={onLinkClicked}
                      style={{ marginLeft: 16 }}
                    >
                      查看学生提交记录
                      <ArrowRightOutlined />
                    </Link>
                  </div>
                  <div style={{ marginTop: 40 }}>
                    <Pie
                      hasLegend
                      subTitle={statisticsData().title}
                      total={() => <p>{statisticsData().sum}</p>}
                      data={statisticsData().array}
                      valueFormat={(value) => <p>{value}</p>}
                      height={248}
                      lineWidth={4}
                    />
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
