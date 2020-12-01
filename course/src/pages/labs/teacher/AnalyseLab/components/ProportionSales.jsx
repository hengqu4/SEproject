import { Card, Radio, Button, Tabs } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { Pie } from './Charts'
import styles from '../style.less'

const { TabPane } = Tabs

const ProportionSales = ({
  dropdownGroup,
  salesType,
  loading,
  salesPieData,
  handleChangeSalesType,
  otherLabsData = [],
}) => (
  <Card
    loading={loading}
    className={styles.salesCard}
    bordered={false}
    title='实验统计'
    style={{
      height: '100%',
    }}
    extra={
      <div className={styles.salesCardExtra}>
        {dropdownGroup}
        <div className={styles.salesTypeRadio}>
          <Radio.Group value={salesType} onChange={handleChangeSalesType}>
            <Radio.Button value='all'>得分分布</Radio.Button>
            <Radio.Button value='online'>提交情况</Radio.Button>
          </Radio.Group>
        </div>
      </div>
    }
  >
    <div>
      <Tabs
        defaultActiveKey='1'
        tabPosition='left'
        style={{
          height: '100%',
          width: '80%',
        }}
        size='large'
      >
        {otherLabsData.map((i) => (
          <TabPane tab={i.name} key={i.key}>
            <div>
              <h4
                style={{
                  marginTop: 8,
                  marginBottom: 32,
                }}
              >
                统计数据
              </h4>
              <Pie
                hasLegend
                subTitle='总提交数'
                total={() => <p>{salesPieData.reduce((pre, now) => now.y + pre, 0)}</p>}
                data={salesPieData}
                valueFormat={(value) => <p>{value}</p>}
                height={248}
                lineWidth={4}
              />
              <Button
                type='primary'
                style={{
                  height: 35,
                  width: 100,
                  marginLeft: 0,
                }}
              >
                发布成绩
              </Button>
              <Button
                type='link'
                style={{
                  height: 35,
                  width: 120,
                  marginLeft: '50%',
                }}
              >
                <Link to='/labs/pending-list'>查看学生提交记录</Link>
              </Button>
            </div>
          </TabPane>
        ))}
      </Tabs>
    </div>
  </Card>
)

export default ProportionSales
