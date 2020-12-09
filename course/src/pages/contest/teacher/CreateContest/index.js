import React, { useState, useRef, useCallback } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import { Steps, Row, Col, message } from 'antd'
import BasicInfo from '@/pages/contest/components/ContestBasicInfo'
import SelectQuestions from '@/pages/contest/components/SelectQuestions'
import ConfirmCreateQuestion from '@/pages/contest/components/ConfrimCreateContest'
import ContestDescription from '@/pages/contest/components/ContestDescrption'
import { connect } from 'umi'
import { useMount } from 'react-use'
import omit from 'lodash/omit'
import onError from '@/utils/onError'

const mapStateToProps = ({ Contest = {} }) => ({
  newContest: Contest.newContest,
  questions: Contest.questions,
  currentContest: Contest.currentContest,
})

const stepTitles = ['填写比赛信息', '选择比赛题目', '完成']

const stepsDom = stepTitles.map((title) => <Steps.Step title={title} key={title} />)

export const Match = ({
  newContest = {},
  questions = [],
  currentContest = {},
  dispatch = () => {},
}) => {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(true)

  const basicInfoFormRef = useRef(null)

  const getCurrentContest = useCallback(() => {
    setLoading(true)
    dispatch({
      type: 'Contest/fetchCurrentContest',
      payload: {
        courseId: 1,
      },
      onError,
      onFinish: setLoading.bind(this, false),
    })
  }, [dispatch])

  useMount(() => {
    getCurrentContest()
  })

  const onStepChange = async (newStep) => {
    if (step === 0) {
      try {
        const values = await basicInfoFormRef.current.validateFileds()
        const contestInfo = { ...values }
        contestInfo.startTime = values.time[0].toISOString(true)
        contestInfo.endTime = values.time[1].toISOString(true)

        dispatch({
          type: 'Contest/setNewContest',
          payload: {
            ...newContest,
            ...omit(contestInfo, ['time']),
          },
        })
      } catch (err) {
        err.errorFields && message.error('请正确输入表单项')
        return
      }
    } else if (step === 1) {
      if (!newContest.randomQuestions && !newContest.questions.length) {
        message.error('请先选择题目')
        return
      }
    }
    setStep(newStep)
  }

  const handleConfirmCreateContest = useCallback(() => {
    dispatch({
      type: 'Contest/createContest',
      onError,
    })
  }, [dispatch])

  const basicInfoDom = (
    <BasicInfo
      ref={basicInfoFormRef}
      onNextStep={onStepChange.bind(this, 1)}
      contest={newContest}
    />
  )
  const selectQuestionsDom = <SelectQuestions onNextStep={onStepChange.bind(this, 2)} />
  const descriptionsDom = (
    <ConfirmCreateQuestion
      questions={questions}
      newContest={newContest}
      onConfirm={handleConfirmCreateContest}
    />
  )

  const domItems = [basicInfoDom, selectQuestionsDom, descriptionsDom]

  console.log('currentContest: ', currentContest)

  return (
    <PageContainer>
      <ProCard title='创建比赛' headerBordered loading={loading}>
        <div style={{ minHeight: '60vh' }}>
          <Row justify='center'>
            <Col span={18} xs={24} sm={20} lg={16}>
              {Object.keys(currentContest).length ? (
                <React.Fragment>
                  <ContestDescription contest={currentContest} />
                  <h1 style={{ color: 'red', textAlign: 'center', fontSize: 20 }}>
                    当前已有一场正在进行中的比赛，无法创建新比赛
                  </h1>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <header style={{ margin: '30px 0 50px 0' }}>
                    <Steps current={step} onChange={onStepChange}>
                      {stepsDom}
                    </Steps>
                  </header>
                  {domItems[step]}
                </React.Fragment>
              )}
            </Col>
          </Row>
        </div>
      </ProCard>
    </PageContainer>
  )
}

export default React.memo(connect(mapStateToProps)(Match))
