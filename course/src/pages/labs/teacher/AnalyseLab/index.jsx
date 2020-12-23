import { Button, Tabs, Card, Radio, notification } from 'antd'
import React, { useState } from 'react'
import { GridContent } from '@ant-design/pro-layout'
import { ArrowRightOutlined } from '@ant-design/icons'
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
})

const AnalyseLabCase = ({ allLabsData = [], dispatch = () => {} }) => {
  const [analyseType, setAnalyseType] = useState(0)
  const [currentLab, setCurrentLab] = useState()
  const [submitVisible, setSubmitVisible] = useState(false)

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
    })
  })

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
                      style={{marginLeft: "60%"}}
                      onClick={() => {
                        setSubmitVisible(true)
                      }}
                    >
                      发布成绩
                    </Button>
                    <Link
                      to={{pathname: `/labs/pending-list/${currentLab == null ? allLabsData[0].courseCaseId : currentLab}`}}
                      onClick={onLinkClicked}
                      style={{marginLeft: 16}}
                    >
                      查看学生提交记录<ArrowRightOutlined />
                    </Link>
                  </div>
                  <div style={{marginTop: 40}}>
                    <Pie
                      hasLegend
                      subTitle='总提交数'
                      total={() => <p>{salesTypeData.reduce((pre, now) => now.y + pre, 0)}</p>}
                      data={salesTypeData}
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