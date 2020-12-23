import React, { useState } from 'react'
import { InputNumber } from 'antd'

const RangeNumber = ({
  onMinChange = () => {},
  onMaxChange = () => {},
  title = '',
  placeholders = ['', ''],
}) => {
  const [minVal, setMinVal] = useState()
  const [maxVal, setMaxVal] = useState()

  const handleRangeChange = (type, value) => {
    if (type === 'min') {
      setMinVal(value)
      onMinChange && onMinChange(value)
    } else {
      setMaxVal(value)
      onMaxChange && onMaxChange(value)
    }
  }

  return (
    <>
      <span>{title}</span>
      <InputNumber
        placeholder={placeholders[0]}
        min={0}
        max={typeof maxVal === 'number' ? maxVal : Number.MAX_SAFE_INTEGER}
        onChange={handleRangeChange.bind(this, 'min')}
      />
      <InputNumber
        placeholder={placeholders[1]}
        min={typeof minVal === 'number' ? minVal : 0}
        max={Number.MAX_SAFE_INTEGER}
        onChange={handleRangeChange.bind(this, 'max')}
      />
    </>
  )
}

export default React.memo(RangeNumber)
