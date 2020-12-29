import React, { useState, useRef, useCallback } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import { Steps, Row, Col, message } from 'antd'
import BasicInfo from '@/pages/contest/teacher/CreateContest/components/ContestBasicInfo'
import SelectQuestions from '@/pages/contest/teacher/CreateContest/components/SelectQuestions'
import ConfirmCreateQuestion from '@/pages/contest/teacher/CreateContest/components/ConfrimCreateContest'
import ContestDescription from '@/pages/contest/components/ContestDescrption'
import ModalQuestionDetail from '@/pages/contest/components/ModalQuestionDetail'
import { connect } from 'umi'
import { useMount } from 'react-use'
import omit from 'lodash/omit'
import onError from '@/utils/onError'

const mapStateToProps = ({ Contest, user }) => ({
  currentUser: user.currentUser,
  newContest: Contest.newContest,
  questionDetail: Contest.questionDetail,
  selectedQuestions: Contest.selectedQuestions,
  questions: Contest.questions,
  currentContest: Contest.currentContest,
})

const stepTitles = ['填写比赛信息', '选择比赛题目', '完成']

const stepsDom = stepTitles.map((title) => <Steps.Step title={title} key={title} />)

export const Match = ({
  currentUser: { id: userId = -1 } = {},
  newContest = {},
  questionDetail = {},
  selectedQuestions = [],
  currentContest = {},
  dispatch = () => {},
}) => {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(true)

  const modalRef = useRef(null)
  const basicInfoFormRef = useRef(null)

  const getCurrentContest = useCallback(() => {
    setLoading(true)
    dispatch({
      type: 'Contest/fetchCurrentContest',
      isTeacher: true,
      payload: {
        courseId: 1,
        userId,
      },
      onError,
      onFinish: setLoading.bind(this, false),
    })
  }, [dispatch, userId])

  useMount(() => {
    getCurrentContest()
  })

  const getQuestionDetail = useCallback(
    ({ questionId, questionType }) => {
      const dismiss = message.info('正在加载题目信息')
      dispatch({
        type: 'Contest/fetchQuestionDetail',
        payload: { questionId, questionType },
        onSuccess: () => {
          modalRef && modalRef.current.open()
        },
        onError,
        onFinish: dismiss,
      })
    },
    [dispatch],
  )

  const onModalOk = useCallback((_, closeModal) => {
    closeModal && closeModal()
  }, [])

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
      if (selectedQuestions?.length === 0) {
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
  const selectQuestionsDom = (
    <SelectQuestions
      onNextStep={onStepChange.bind(this, 2)}
      onShowQuestionDetail={getQuestionDetail}
    />
  )
  const descriptionsDom = (
    <ConfirmCreateQuestion
      newContest={{ ...newContest, questions: selectedQuestions }}
      onConfirm={handleConfirmCreateContest}
      onShowQuestionDetail={getQuestionDetail}
    />
  )

  const domItems = [basicInfoDom, selectQuestionsDom, descriptionsDom]

  return (
    <PageContainer title={false}>
      <ProCard title='创建比赛' headerBordered loading={loading}>
        <div style={{ minHeight: '60vh' }}>
          <Row justify='center'>
            <Col span={18} xs={24} sm={20} lg={16}>
              {Object.keys(currentContest).length ? (
                <React.Fragment>
                  <ContestDescription
                    contest={currentContest}
                    onShowQuestionDetail={getQuestionDetail}
                  />
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
      <ModalQuestionDetail
        ref={modalRef}
        mode='readonly'
        question={questionDetail}
        onOk={onModalOk}
      />
    </PageContainer>
  )
}

export default React.memo(connect(mapStateToProps)(Match))
