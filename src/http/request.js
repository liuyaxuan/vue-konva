import axios from 'axios'
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-urlencoded'
const http = axios.create()

http.defaults.timeout = 3000

http.interceptors.request.use(config => { // 请求拦截器配置 // 可不配置
  // do sth
  return config
}, error => {
  console.log(error)
  return Promise.reject(error)
})

http.interceptors.response.use(response => { // 响应拦截器配置 // 可不配置
  // do something
  return response
}, error => {
  console.log(error)
  return Promise.reject(error)
})

export function fetch (url, params) { // 封装axios的post请求
  return new Promise((resolve, reject) => { // promise 用法,自行查阅
    axios.post(url, params).then(response => {
      resolve(response.data) // promise相关
    }).catch(error => {
      reject(error) // promise相关
    })
  })
}

export default { // 暴露htto_mock方法，即后面页面中用到的方法
  http_mock (url, params) {
    return fetch(url, params)
  }
}
