// miniprogram/pages/device/doorLock.js
import { showLoading, hideLoading, shimaoModel, getDeviceList, disjunctor, getPreOrNextData } from '../../../util/mixins.js'
import {
  ble
} from "../../../utils/BLE";
Page({

  /**
   * 页面的初始数据
   */

  data: {
    logs: ['日志:'],
    options: {},
    status: '已关闭',
    preOrNextData: {},
    entityCode: '',
    isOpen: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options: ', options)
    this.setData({
      entityId: options.entityId,
      entityCode: options.entityCode
    })
    this.refData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  getDeviceList,
  refData() {

    this.getDeviceList().then(res => {
      // console.log('corrdorlamp-res: ', res)
      this.setData({
        deviceData: res,
        entityId: this.data.entityId
      })
      this.setData({
        preOrNextData: this.getPreOrNextData(res, this.data.entityId)
      })
      // console.log('preOrNextData: ', this.data.preOrNextData)
    })
  },
  getPreOrNextData,
  
  //开锁
  unlock() {
    console.log('this.data.entityCode: ', this.data.entityCode)
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

    console.log('options: ', options)

    //蓝牙开锁
    ble(options).then((res) => {
      // 开锁成功
      that.data.logs.push(`电量：${res}`)
      console.log('that.data.logs: ', that.data.logs)
      that.setData({
        logs: that.data.logs,
        status: '开锁成功',
        isOpen: true
      })
      this.sendLockLogData()
      
      setTimeout(()=>{
        that.setData({
          status: '已关闭',
          isOpen: false
        })
      },10000)
    }).catch((res) => {
      // 开锁失败
      this.sendLockLogData()
      that.data.logs.push(res.errMsg)
      console.log('that.data.logs: ', that.data.logs)
      that.setData({
        logs: that.data.logs,
        status: '开锁失败',
        isOpen: false
      })

      setTimeout(() => {
        that.setData({
          status: '已关闭'
        })
      }, 3000)
    })
  },

  sendLockLogData() {
    let data = {
      deviceCode: 'C5041B3BDD4A',
      deviceName: '小程序门锁',
      openLockType: 4,
      openLockResult: 1
    }
    let saveLockLogData = shimaoModel.saveLockLogData(data)
    saveLockLogData.then(res => {
      console.log('res: ', res)
    })
  },

  toLockLogData() {
    wx.redirectTo({
      url: '/pages/device/doorLock/openingRecord/openingRecord',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})