import {
  ble
} from "../../utils/BLE";
Page({
  data: {
    logs: ['日志:'],
    options: {}
  },
  onLoad: function (options) {

  },

  //开锁
  unlock() {
    let that = this

    this.setData({
      logs: [],
    })

    getApp().globalData.that = that;

    //参数
    let options = {
      mac: 'C5041B3BDD4A', //蓝牙mac地址
      moduleType: 2, //蓝牙模块版本
    }

    //蓝牙开锁
    ble(options).then((res) => {
      // 开锁成功
      that.data.logs.push(`电量：${res}`)
      that.setData({
        logs: that.data.logs
      })
    }).catch((res) => {
      // 开锁失败
      that.data.logs.push(res.errMsg)
      that.setData({
        logs: that.data.logs
      })
    })
  },
})