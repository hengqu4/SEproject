import React from 'react'
import { Radio, Checkbox } from 'antd'
import c from 'classnames'

const Option = ({ value, content, answer, isSingleChoice, userAnswer }) => {
  const OptionElement = isSingleChoice ? Radio : Checkbox

  let className = 'link'

  if (userAnswer && userAnswer.includes(value)) {
    className = answer.includes(value) ? 'success' : 'error'
  }

  return (
    <OptionElement
      className={c('question-option', className)}
      value={value}
      checked={userAnswer && (answer.includes(value) || className === 'error')}
    >
      <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>{content}</span>
    </OptionElement>
  )
}

export default React.memo(Option)
