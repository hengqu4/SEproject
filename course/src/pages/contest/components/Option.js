import React from 'react'
import { Radio, Checkbox } from 'antd'
import c from 'classnames'

const Option = ({ value, content, answer, isSingleChoice, userAnswer }) => {
  const OptionElement = isSingleChoice ? Radio : Checkbox

  let className = 'link'

  if (answer && userAnswer.includes(value)) {
    className = answer.includes(value) ? 'success' : 'error'
  }

  return (
    <OptionElement
      className={answer ? c('question-option', 'modified', className) : 'question-option'}
      value={value}
      checked={answer && (answer.includes(value) || className === 'error')}
    >
      <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>{content}</span>
    </OptionElement>
  )
}

export default React.memo(Option)
