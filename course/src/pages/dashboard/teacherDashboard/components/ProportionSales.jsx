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
    title='成绩分段占比'
    style={{
      height: '100%',
    }}
    extra={
      <div className={styles.salesCardExtra}>
        {dropdownGroup}
        <div className={styles.salesTypeRadio}>
          <Radio.Group value={salesType} onChange={handleChangeSalesType}>
            <Radio.Button value='all'>总分</Radio.Button>
            <Radio.Button value='online'>实验1</Radio.Button>
            <Radio.Button value='stores'>对抗1</Radio.Button>
          </Radio.Group>
        </div>
      </div>
    }
  >
    <div>
      <h4
        style={{
          marginTop: 8,
          marginBottom: 32,
        }}
      >
        得分
      </h4>
      <Pie
        hasLegend
        subTitle='平均分'
        total={() => `${salesPieData.reduce((pre, now) => now.y + pre + 4, 0)}`}
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
