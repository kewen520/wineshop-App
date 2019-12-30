const md5 = require('./md5.js')
const utils = {
  // 是否有值
  isVal(val = '') {
    if (typeof val === 'number') {
      val = val + '';
    }
    if (val == null || val.length == 0) {
      return false
    } else if (val.replace(/\s/g, "") === '') {
      return false
    } else {
      return true
    }
  },

  // 移除空格
  trim2(val = '') {
    return val.replace(/\s/g, "")
  },

  // 弹出吐司消息
  showToast(val = '') {
    wx.showToast({
      title: val,
      icon: 'none'
    })
  },

  // 弹出吐司消息
  showToast(val = '', icon = 'none', duc = 4000, suc, fail, com) {
    wx.showToast({
      title: val,
      icon: icon,
      duration: duc,
      success: suc && suc(),
      fail: fail && fail(),
      complete: com && com()
    })
  },

  // loading
  showLoading(val = '', mask = false, suc, fail, com) {
    wx.showLoading({
      title: val,
      mask: mask,
      success: suc && suc(),
      fail: fail && fail(),
      complete: com && com()
    })
  },

  // 判断是否是一个手机号
  isPhoneNum(val = '') {
    var phonereg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    return phonereg.test(val);
  },

  // 将对象参数按照顺序排列
  objKeySort(obj) { //排序的函数
    var newkey = Object.keys(obj).sort(); //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
    for (var i = 0; i < newkey.length; i++) { //遍历newkey数组
      newObj[newkey[i]] = obj[newkey[i]]; //向新创建的对象中按照排好的顺序依次增加键值对
    }
    return newObj; //返回排好序的新对象
  },

  // 返回对应的sign值
  setSignVal(parameters) {
    var obj = {};
    for (const key in parameters) {
      if (key !== 'api') {
        obj[key] = parameters[key]
      }
    }
    // console.log(obj);
    let sortObj = utils.objKeySort(obj)
    // console.log(sortObj);
    var signPar = ''
    for (const key in sortObj) {
      signPar += sortObj[key]
    }
    // console.log(signPar);
    // console.log(md5(signPar))
    return md5(signPar)
  },

  /**
   * 封封微信的的request
   */
  request(url, data = {}, method = "GET", contentType = "application/json") {
    return new Promise(function(resolve, reject) {
      wx.request({
        url: url,
        data: data,
        method: method,
        header: {
          'Content-Type': contentType,
          'X-Litemall-Token': wx.getStorageSync('token')
        },
        success: function(res) {

          if (res.status == 1) {
            resolve(res.data);
          } else {
            reject(res.errMsg);
          }

        },
        fail: function(err) {
          reject(err)
        }
      })
    });
  }


}



module.exports = utils;