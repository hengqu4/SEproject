import React, { useState, useRef } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import { Steps, Row, Col, message } from 'antd'
import BasicInfo from '@/pages/contest/components/ContestBasicInfo'
import SelectQuestions from '@/pages/contest/components/SelectQuestions'
import ContestDescription from '@/pages/contest/components/ContestDescription'
import { connect } from 'umi'
import { useUnmount } from 'react-use'
import omit from 'lodash/omit'

const mapStateToProps = ({ Contest = {} }) => ({
  newContest: Contest.newContest,
  questions: Contest.questions,
})

const stepTitles = ['填写比赛信息', '选择比赛题目', '完成']

const stepsDom = stepTitles.map((title) => <Steps.Step title={title} key={title} />)

export const Match = ({ newContest = {}, questions = [], dispatch = () => {} }) => {
  const [step, setStep] = useState(0)

  const basicInfoFormRef = useRef(null)

  useUnmount(() => {
    dispatch({
      type: 'Contest/setNewContest',
    })
    dispatch({
      type: 'Contest/setQuestions',
    })
  })

  const onStepChange = async (newStep) => {
    if (step === 0) {
      try {
        const values = await basicInfoFormRef.current.validateFileds()
        const contestInfo = { ...values }
        contestInfo.startTime = values.time[0].toISOString()
        contestInfo.endTime = values.time[1].toISOString()

        console.log('contestInfo: ', contestInfo)

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
      if (!newContest.questions.length) {
        message.error('请先选择题目')
        return
      }
    }
    setStep(newStep)
  }

  const basicInfoDom = (
    <BasicInfo
      ref={basicInfoFormRef}
      onNextStep={onStepChange.bind(this, 1)}
      contest={newContest}
    />
  )
  const selectQuestionsDom = <SelectQuestions onNextStep={onStepChange.bind(this, 2)} />
  const descriptionsDom = <ContestDescription questions={questions} newContest={newContest} />

  const domItems = [basicInfoDom, selectQuestionsDom, descriptionsDom]

  return (
    <PageContainer>
      <ProCard title='创建比赛' headerBordered>
        <div style={{ minHeight: '60vh' }}>
          <Row justify='center'>
            <Col span={18} xs={24} sm={20} lg={16}>
              <header style={{ margin: '30px 0 50px 0' }}>
                <Steps current={step} onChange={onStepChange}>
                  {stepsDom}
                </Steps>
              </header>
              {domItems[step]}
            </Col>
          </Row>
        </div>
      </ProCard>
    </PageContainer>
  )
}

export default React.memo(connect(mapStateToProps)(Match))
