import moment from 'moment'
// mock data
const visitData = []
const beginDay = new Date().getTime()
const fakeY = [7, 5, 4, 12, 4, 7, 5, 6, 5, 9]

function convertToChinaNum(num) {
  const arr1 = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const arr2 = [
    '',
    '十',
    '百',
    '千',
    '万',
    '十',
    '百',
    '千',
    '亿',
    '十',
    '百',
    '千',
    '万',
    '十',
    '百',
    '千',
    '亿',
  ] // 可继续追加更高位转换值
  if (!num || isNaN(num)) {
    return '零'
  }
  const english = num.toString().split('')
  let result = ''
  for (let i = 0; i < english.length; i++) {
    const des_i = english.length - 1 - i // 倒序排列设值
    result = arr2[i] + result
    const arr1_index = english[des_i]
    result = arr1[arr1_index] + result
  }
  // 将【零千、零百】换成【零】 【十零】换成【十】
  result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十')
  // 合并中间多个零为一个零
  result = result.replace(/零+/g, '零')
  // 将【零亿】换成【亿】【零万】换成【万】
  result = result.replace(/零亿/g, '亿').replace(/零万/g, '万')
  // 将【亿万】换成【亿】
  result = result.replace(/亿万/g, '亿')
  // 移除末尾的零
  result = result.replace(/零+$/, '')
  // 将【零一十】换成【零十】
  // result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十
  // 将【一十】换成【十】
  result = result.replace(/^一十/g, '十')
  return result
}

for (let i = 0; i < fakeY.length; i += 1) {
  visitData.push({
    x: `${(i * 10).toString()}-${(i * 10 + 10).toString()}`,
    y: fakeY[i],
  })
}

const visitData2 = []
const fakeY2 = [1, 6, 4, 8, 3, 7, 2]

for (let i = 0; i < fakeY2.length; i += 1) {
  visitData2.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: fakeY2[i],
  })
}

const salesData = []

for (let i = 0; i < 12; i += 1) {
  salesData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200,
  })
}

const searchData = []

for (let i = 0; i < 50; i += 1) {
  searchData.push({
    index: i + 1,
    keyword: '114514',
    count: `熊${convertToChinaNum(i)}鹏`,
    range: 100,
    status: Math.floor((Math.random() * 10) % 2),
  })
}

const salesTypeData = [
  {
    x: 'A:90+',
    y: 6,
  },
  {
    x: 'B:80-90',
    y: 23,
  },
  {
    x: 'C:70-80',
    y: 12,
  },
  {
    x: 'D:60-70',
    y: 4,
  },
  {
    x: 'F:0-60',
    y: 5,
  },
  {
    x: '异常',
    y: 1,
  },
]
const salesTypeDataOnline = [
  {
    x: 'A:90+',
    y: 5,
  },
  {
    x: 'B:80-90',
    y: 3,
  },
  {
    x: 'C:70-80',
    y: 32,
  },
  {
    x: 'D:60-70',
    y: 14,
  },
  {
    x: 'F:0-60',
    y: 2,
  },
  {
    x: '异常',
    y: 2,
  },
]
const salesTypeDataOffline = [
  {
    x: 'A:90+',
    y: 12,
  },
  {
    x: 'B:80-90',
    y: 13,
  },
  {
    x: 'C:70-80',
    y: 2,
  },
  {
    x: 'D:60-70',
    y: 4,
  },
  {
    x: 'F:0-60',
    y: 15,
  },
  {
    x: '异常',
    y: 6,
  },
]

const offlineData = []

for (let i = 0; i < 10; i += 1) {
  offlineData.push({
    name: `Stores ${i}`,
    cvr: Math.ceil(Math.random() * 9) / 10,
  })
}

const offlineChartData = []

for (let i = 0; i < 20; i += 1) {
  offlineChartData.push({
    x: new Date().getTime() + 1000 * 60 * 30 * i,
    y1: Math.floor(Math.random() * 100) + 10,
    y2: Math.floor(Math.random() * 100) + 10,
  })
}

const radarOriginData = [
  {
    name: '个人',
    ref: 10,
    koubei: 8,
    output: 4,
    contribute: 5,
    hot: 7,
  },
  {
    name: '团队',
    ref: 3,
    koubei: 9,
    output: 6,
    contribute: 3,
    hot: 1,
  },
  {
    name: '部门',
    ref: 4,
    koubei: 1,
    output: 6,
    contribute: 5,
    hot: 7,
  },
]
const radarData = []
const radarTitleMap = {
  ref: '引用',
  koubei: '口碑',
  output: '产量',
  contribute: '贡献',
  hot: '热度',
}
radarOriginData.forEach((item) => {
  Object.keys(item).forEach((key) => {
    if (key !== 'name') {
      radarData.push({
        name: item.name,
        label: radarTitleMap[key],
        value: item[key],
      })
    }
  })
})
const getFakeChartData = {
  visitData,
  visitData2,
  salesData,
  searchData,
  offlineData,
  offlineChartData,
  salesTypeData,
  salesTypeDataOnline,
  salesTypeDataOffline,
  radarData,
}
export default {
  'GET  /api/fake_chart_data': getFakeChartData,
}
