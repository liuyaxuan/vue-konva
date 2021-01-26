// 引入mockjs
const Mock = require('mockjs')

const Random = Mock.Random
// 左侧导航菜单模拟数据
Mock.mock('/api/menu', (req, res) => {
  let list = []
  list = [
    {
      name: '首页',
      path: '/home',
      icon: 'ios-home'
    },
    {
      name: '地图',
      path: '/konva/index',
      icon: 'ios-navigate'
    },
    {
      name: '详情',
      path: '/detail/index',
      icon: 'ios-list-box-outline'
    }
  ]
  return {
    data: list
  }
})

// 标记点模拟数据
let markerData = function() {
  let list = []
  for (let i = 0; i < 10; i++) {
    let newList = {
      class: 'marker',
      name: Random.cname(),
      width: 20,
      height: 30,
      "x|1-820.1-10": 1,
      "y|1-520.1-10": 1
    }
    list.push(newList)
  }
  const defaultList = list
  return { list, defaultList }
}
// 电子围栏模拟数据
let fenceData = function() {
  let list = []
  for (let i = 0; i < 3; i++) {
    let newList = {
      "x|1-820.1-10": 1,
      "y|1-520.1-10": 1
    }
    list.push(newList)
  }
  const defaultList = list
  return { list, defaultList }
}


// 标记点模拟数据
Mock.mock('/api/marker', 'get', markerData())
// 电子围栏模拟数据
Mock.mock('/api/fence', 'get', fenceData())
