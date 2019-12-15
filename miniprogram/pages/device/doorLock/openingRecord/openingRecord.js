// miniprogram/pages/openingRecord/openingRecord.js
import {
  showLoading,
  hideLoading,
  shimaoModel,
  getDeviceList,
  disjunctor,
  getPreOrNextData
} from '../../../../util/mixins.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openlog: [],
    todayLog: [],
    yesterdayLog: [],
    earlierLog: [],
    yesterday: '',
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let data = {
      entityCode: options.deviceCode,
      pageNum: 1,
      pageSize: 10000
    }
    console.log('查看开锁记录 - data: ', data)
    let getOpenLog = shimaoModel.getOpenLog(data)
    getOpenLog.then(res => {
      console.log("res: ", res)
      // var data = new Date('2019/11/02T07:11:28.158+0000')
      // console.log(data)
      // return
      if (res.data.list) {
        let log = []
        let descLog = []
        let todayLog = []
        let yesterdayLog = []
        let todayFormat = []
        let yesterdayFormat = []
        let earlierLog = []
        let earlierFormat = []
        res.data.list.forEach(item => {
          var logTime = item.logTime.replace(/T/g, ' ')
          item.sj = logTime.toLocaleString().substr(0, 19)
          let date = new Date(logTime.toLocaleString().substr(0, 19))
          let time = item.logTime.replace(/-/g, ':').replace(' ', ':')
          time = time.split(':')
          let time1 = new Date(time[0], (time[1] - 1), time[2], time[3], time[4], time[5])
          console.log('time1: ', time1.getTime())
          log.push(time1.getTime())
        })
        console.log('log: ', log)
        console.log('getTodayLog', this.getTodayLog(log))
        todayLog = this.quickSort(this.getTodayLog(log))
        yesterdayLog  = this.quickSort(this.getYesterday(log))
        earlierLog = this.quickSort(this.getEarlier(log))
        
        todayLog.forEach(i => {
          todayFormat.push(this.dateFormat("YYYY-mm-dd HH:MM", i))
        })
        yesterdayLog.forEach(i => {
          yesterdayFormat.push(this.dateFormat("YYYY-mm-dd HH:MM", i))
        })
        earlierLog.forEach(i => {
          earlierFormat.push(this.dateFormat("YYYY-mm-dd HH:MM", i))
        })
        console.log('quickSort: ', this.quickSort(log))
        this.setData({
          openlog: res.data.list,
          todayLog: todayFormat,
          yesterdayLog: yesterdayFormat,
          earlierLog: earlierFormat
        })
      }
    })
  },
  getTodayLog(arr) {
    let todayArr = []
    const today = new Date(new Date().toLocaleDateString()).getTime()
    console.log('arr: ', arr)
    arr.forEach(item => {
      if (item > today) {
        todayArr.push(item)
      }
    })
    return todayArr
  },

  getYesterday(arr) {
    let yesterdayArr = []
    const todayDate = new Date(new Date().toLocaleDateString())
    const today = todayDate.getTime()
    const yesterday = todayDate.setTime(today - 3600 * 1000 * 24 * 1)
    this.setData({
      yesterday
    })
    arr.forEach(item => {
      if (item < today && item > yesterday) {
        yesterdayArr.push(item)
      }
    })
    return yesterdayArr
  },

  getEarlier(arr) {
    let earlierArr = []
    arr.forEach(item => {
      if (item < this.data.ea) {
        earlierArr.push(item)
      }
    })
    return earlierArr
  },

  quickSort(arr) {
    console.time('2.快速排序耗时');　　
    if (arr.length <= 1) {
      return arr;
    }　　
    var pivotIndex = Math.floor(arr.length / 2);　　
    var pivot = arr.splice(pivotIndex, 1)[0];　　
    var left = [];　　
    var right = [];　　
    for (var i = 0; i < arr.length; i++) {　　　　
      if (arr[i] > pivot) {　　　　　　
        left.push(arr[i]);　　　　
      } else {　　　　　　
        right.push(arr[i]);　　　　
      }　　
    }
    console.timeEnd('2.快速排序耗时');　　
    return this.quickSort(left).concat([pivot], this.quickSort(right));
  },

  dateFormat(fmt, date) {
    date = new Date(date)
    let ret
    let opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "m+": (date.getMonth() + 1).toString(),     // 月
      "d+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "M+": date.getMinutes().toString(),         // 分
      "S+": date.getSeconds().toString()          // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    }
    for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
        fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
      };
    };
    return fmt;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})