// import { PageContainer } from '@ant-design/pro-layout'
import React, { useState, useEffect } from 'react'
// import { Spin } from 'antd'
import styles from './index.less'
import LoginForm from './FormNormalLogin/index'

export default () => {
  const [, setLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }, [])
  return (
    <div className={styles.main}>
      <LoginForm />
    </div>
  )
}
