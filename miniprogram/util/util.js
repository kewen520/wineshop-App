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
  },

  /*数据结构化*/
  /**
   * 将一维的扁平数组转换为多层级对象
   * @param  {[type]} list 一维数组，数组中每一个元素需包含id和parent_id两个属性 
   * @return {[type]} tree 多层级树状结构
   */
  buildTree(list) {
    // console.log('list: ', list)
    const tmp = new Map();
    const categoryArr = list.filter(item => {
      return !tmp.has(item.category_shop.name) && tmp.set(item.category_shop.name, 1);
    })
    let categor = []
    categoryArr.forEach(item => {
      categor.push(item.category_shop.name)
    })
    console.log('categor: ', categor)
    let res = []
    categor.forEach(item => {
      let resItemObj = {
        categorName: item,
        childList: []
      }
      list.forEach(o => {
        if (o.category_shop.name == item) {
          resItemObj.childList.push(o)
        }
      })
      res.push(resItemObj)
    })
    return res
  },

  dateFormat(date, fmt) {
    date = new Date(date * 1000);
    let ret;
    let opt = {
      "Y+": date.getFullYear().toString(), // 年
      "m+": (date.getMonth() + 1).toString(), // 月
      "d+": date.getDate().toString(), // 日
      "H+": date.getHours().toString(), // 时
      "M+": date.getMinutes().toString(), // 分
      "S+": date.getSeconds().toString() // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    console.log('opt: ', opt);
    for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
        fmt = fmt.replace(
          ret[1],
          ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
        );
      }
    }
    return fmt;
  },

  // 时间距离
  formatRemainTime(endTime) {
    var startDate = new Date(); //开始时间
    var endDate = new Date(endTime); //结束时间
    var t = endDate.getTime() - startDate.getTime(); //时间差
    var d = 0,
      h = 0,
      m = 0,
      s = 0;
    if (t >= 0) {
      d = Math.floor(t / 1000 / 3600 / 24);
      h = Math.floor(t / 1000 / 60 / 60 % 24);
      m = Math.floor(t / 1000 / 60 % 60);
      s = Math.floor(t / 1000 % 60);
    }
    if (m > 0) {
      return m + "分钟 ";
    } else {
      return s + "秒";
    }
  }

}



module.exports = utils;