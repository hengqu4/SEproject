import React, { useCallback, useState } from 'react'
import { Button } from 'antd'
import ContestDescription from '@/pages/contest/components/ContestDescrption'

const ConfirmCreateContest = ({
  newContest = {},
  onConfirm = () => {},
  onShowQuestionDetail = () => {},
}) => {
  const [loading, setLoading] = useState(false)

  const onOk = useCallback(() => {
    setLoading(true)
    onConfirm()
  }, [onConfirm])

  return (
    <React.Fragment>
      <ContestDescription contest={newContest} onShowQuestionDetail={onShowQuestionDetail} />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button loading={loading} type='primary' onClick={onOk}>
          确认该创建比赛
        </Button>
      </div>
    </React.Fragment>
  )
}

export default ConfirmCreateContest
