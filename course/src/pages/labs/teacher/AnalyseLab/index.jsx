import { Button, Tabs, Card, Radio, notification } from 'antd'
import React, { useState } from 'react'
import { GridContent } from '@ant-design/pro-layout'
import { Link } from 'react-router-dom'
import { connect } from 'umi'
import { useMount } from 'react-use'
import styles from './style.less'
import Pie from './components/Charts/Pie'

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
    console.log(currentLab == null ? allLabsData[0].course_case_id : currentLab)
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
                <TabPane tab={i.case_id} key={i.course_case_id}>
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
                      subTitle='总提交数'
                      total={() => <p>{salesTypeData.reduce((pre, now) => now.y + pre, 0)}</p>}
                      data={salesTypeData}
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
                      <Link to='/labs/pending-list' onClick={onLinkClicked}>
                        查看学生提交记录
                      </Link>
                    </Button>
                  </div>
                </TabPane>
              ))}
            </Tabs>
          </div>
        </Card>
      </React.Fragment>
    </GridContent>
  )
}

export default connect(AllLabCase)(AnalyseLabCase)
