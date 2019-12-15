import {
  config
} from '../config.js'

const tips = {
  8888: '抱歉！暂未匹配到您的入住信息',
  1001: '抱歉！暂未匹配到您的入住信息',
  1005: 'appkey无效，请前往www.7yue.pro申请',
  3000: '期刊不存在'
}

let header = {
  'content-type': 'application/json'
}


class HTTP {
  request({
    url,
    data = {},
    method = 'GET'
  }) {
    return new Promise((resolve, reject) => {
      this._request(url, resolve, reject, data, method)
    }).catch((e)=>{
      console.log('e-catch: ', e)
    })
  }

  _request(url, resolve, reject, data = {}, method = 'GET') {
    let local_token = wx.getStorageSync('token')
    console.log('url: ', url)
    let reg = RegExp(/http|https/)
    if (local_token) {
      header['token'] = local_token       // https://www.hansuku.com/archives/128
    }
    if (!reg.exec(url)) {
      url = `${config.shimao_url}${url}`
    }


    console.log('url-end: ', url)
    
    wx.request({
      url,
      method: method,
      data: data,
      header: header,
      success: (res) => {
        // console.log('success - res.data: ', res.data)
        const code = res.statusCode.toString()
        if (code.startsWith('2')) {
          if (res.data.retcode == 1 || res.data.retcode == 1001) {
            console.log('1001: ', res.data.retcode)
            const error_code = res.data.retcode
            // console.log('error_code: ', error_code)
            this._show_error(error_code)
            reject(error_code)
          } else {
            resolve(res.data)
          }
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
    console.log('error_code: ', error_code)
    // console.log('_show_error-token: ', wx.getStorageSync('token'))
    // return
    if (error_code == 1001){
      wx.removeStorageSync('token')
      wx.navigateTo({
        url: '/pages/guide/guide',
      })
    }
    const tip = tips[error_code]
    // return
    wx.showToast({
      title: tip ? tip : tips[8888],
      icon: 'none',
      duration: 2000
    })
  }
}

export {
  HTTP
}