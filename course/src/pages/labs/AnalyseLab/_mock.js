import moment from 'moment'
// mock data
const salesTypeData = [
  {
    x: '90+',
    y: 30,
  },
  {
    x: '80~90',
    y: 20,
  },
  {
    x: '70~80',
    y: 30,
  },
  {
    x: '60~70',
    y: 15,
  },
  {
    x: '60-',
    y: 5,
  },
  {
    x: '未批改',
    y: 10,
  },
]
const salesTypeDataOnline = [
  {
    x: '未批改',
    y: 54,
  },
  {
    x: '未提交',
    y: 5,
  },
  {
    x: '已批改',
    y: 51,
  },
]

const otherLabsData = [
  {
    key: '1',
    name: '第一次实验',
  },
  {
    key: '2',
    name: '第二次实验',
  },
  {
    key: '3',
    name: '第三次实验',
  },
  {
    key: '4',
    name: '第四次实验',
  },
  {
    key: '5',
    name: '第四次实验',
  },
]

const getFakeChartData = {
  salesTypeData,
  salesTypeDataOnline,
  otherLabsData,
}
export default {
  'GET  /api/fake_chart_data': getFakeChartData,
}
