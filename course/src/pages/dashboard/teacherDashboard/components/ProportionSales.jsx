import { Card, Radio } from 'antd'
import { FormattedMessage } from 'umi'
import React from 'react'
import { Pie } from './Charts'
import Yuan from '../utils/Yuan'
import styles from '../style.less'

const ProportionSales = ({
  dropdownGroup,
  salesType,
  loading,
  salesPieData,
  handleChangeSalesType,
}) => (
  <Card
    loading={loading}
    className={styles.salesCard}
    bordered={false}
    title='成绩权重分配'
    style={{
      height: '100%',
    }}
  >
    <div>
      <h4
        style={{
          marginTop: 8,
          marginBottom: 32,
        }}
      >
        权重
      </h4>
      <Pie
        hasLegend
        data={salesPieData}
        valueFormat={(value) => {
          return `${value.toString()}分`
        }}
        height={248}
        lineWidth={4}
      />
    </div>
  </Card>
)

export default ProportionSales
