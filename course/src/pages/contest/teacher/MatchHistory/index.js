import React, { useState, useCallback, useMemo } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import { Radio } from 'antd'
import ContestMatches from '@/pages/contest/components/ContestMatches'
import StudentMatches from '@/pages/contest/components/StudentMatches'

const MatchHistory = () => {
  const [viewMode, setViewMode] = useState('contest')

  const handleViewModeChange = useCallback((event) => {
    const mode = event.target.value

    setViewMode(mode)
  }, [])

  const cardExtra = useMemo(
    () => (
      <Radio.Group value={viewMode} onChange={handleViewModeChange}>
        <Radio.Button value='contest'>对抗</Radio.Button>
        <Radio.Button value='student'>学生</Radio.Button>
      </Radio.Group>
    ),
    [handleViewModeChange, viewMode],
  )

  return (
    <PageContainer>
      <ProCard
        title={viewMode === 'contest' ? '所有比赛' : '所有学生'}
        extra={cardExtra}
        headerBordered
      >
        {viewMode === 'contest' ? <ContestMatches /> : <StudentMatches />}
      </ProCard>
    </PageContainer>
  )
}

export default React.memo(MatchHistory)
