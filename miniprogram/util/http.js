import {
  config
} from '../config.js'

const tips = {
  1: '抱歉，出现了一个错误',
  1005: 'appkey无效，请前往www.7yue.pro申请',
  3000: '期刊不存在'
}

let local_token = wx.getStorageSync('token') || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MiIsImlzcyI6ImF1dGgwIiwiZXhwIjoxNTczMTE3OTk4LCJ1c2VySWQiOjkyfQ.Q9dNRahIlgJdQCgDbqSo9nhBYkYXc50iGEKx8JgAqNo'
let header = {
  'content-type': 'application/json'
}
if (local_token) {
  header['Authorization'] = local_token       // https://www.hansuku.com/archives/128
}

class HTTP {
  request({
    url,
    data = {},
    method = 'GET'
  }) {
    return new Promise((resolve, reject) => {
      this._request(url, resolve, reject, data, method)
    })
  }

  _request(url, resolve, reject, data = {}, method = 'GET') {
    
    wx.request({
      url: `${config.api_base_url}${url}`,
      method: method,
      data: data,
      header: {
        'content-type': 'application/json',
        'appkey': config.appkey
      },
      success: (res) => {
        console.log('suc - res: ', res)
        const code = res.statusCode.toString()
        if (code.startsWith('2')) {
          resolve(res.data)
        } else {
          const error_code = res.data.error_code
          this._show_error(error_code)
          reject(error_code)
        }
      },
      fail: (err) => {
        this._show_error(1)
        reject(err)
      }
    })
  }

  _show_error(error_code) {
    if (!error_code) {
      error_code = 1
    }
    const tip = tips[error_code]
    wx.showToast({
      title: tip ? tip : tips[1],
      icon: 'none',
      duration: 2000
    })
  }
}

export {
  HTTP
}