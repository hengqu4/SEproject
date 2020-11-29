import React from 'react'
import { Tag, Radio, Checkbox, Divider } from 'antd'
import Option from '@/pages/contest/components/Option'

const Question = ({
  question: {
    questionContent: content,
    questionType: type,
    questionAnswer: answer,
    answer: userAnswer,
    ...questionProps
  },
  onChange = () => {},
  ...restProps
}) => {
  const isSingleChoice = type === 0
  const answerArr = answer.split('')
  const userAnswerArr = userAnswer && userAnswer.split('')
  const options = ['A', 'B', 'C', 'D']
  const optionsDom = options.map((op) => (
    <Option
      key={op}
      value={op}
      content={questionProps[`questionChoice${op}Content`]}
      isSingleChoice={isSingleChoice}
      answer={answerArr}
      userAnswer={userAnswerArr}
    />
  ))

  let optionsContainerDom = null
  let questionFooter = null

  if (userAnswerArr) {
    optionsContainerDom = <React.Fragment>{optionsDom}</React.Fragment>

    questionFooter = (
      <React.Fragment>
        <Divider dashed />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>
            正确答案：{answerArr.join(', ')}&nbsp;&nbsp;&nbsp;你的答案：{userAnswerArr.join(', ')}
          </span>
          <span>得分：{answer === userAnswer ? '2 / 2' : '0 / 2'}</span>
        </div>
      </React.Fragment>
    )
  } else if (isSingleChoice) {
    optionsContainerDom = (
      <Radio.Group onChange={onChange} {...restProps}>
        {optionsDom}
      </Radio.Group>
    )
  } else {
    optionsContainerDom = (
      <Checkbox.Group onChange={onChange} {...restProps}>
        {optionsDom}
      </Checkbox.Group>
    )
  }

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span>
          <Tag color='processing'>{isSingleChoice ? '单选' : '多选'}</Tag>
        </span>
        <h3>{content}</h3>
      </div>
      <div className='question-options-block'>{optionsContainerDom}</div>
      {questionFooter}
    </div>
  )
}

export default React.memo(Question)
