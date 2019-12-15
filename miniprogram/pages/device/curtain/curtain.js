// miniprogram/pages/device/curtain/curtain.js
import { showLoading, hideLoading, shimaoModel, getDeviceList, disjunctor, getPreOrNextData } from '../../../util/mixins.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOn: true,
    entityId: '',
    deviceDetailsData: '',
    level:'',
    isLevel: false,
    deviceData: [],
    preOrNextData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      entityId: options.entityId
    })
    console.log('options: ', options)
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
    this.refData()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getDeviceList,
  refData(n) {
    this.getDeviceList().then(res => {
      console.log('deviceData: ', res)
      this.setData({
        deviceData: res,
        entityId: this.data.entityId
      })
      this.getDeviceDetailsData(res, this.data.entityId)
      this.setData({
        preOrNextData: this.getPreOrNextData(res, this.data.entityId)
      })
      if (n) {
        wx.showToast({
          title: `${n}${this.data.isOn ? '已开启' : '已关闭'}`,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  getPreOrNextData,
  // 获得设备详情
  getDeviceDetailsData(list, entityId) {
    list.forEach(item => {
      // 数据中找出本设备
      if (item.entityId == entityId) {
        console.log('deviceDetailsData: ', item)
        if (item.attributesEntities.length > 1) {
          item.attributesEntities.forEach(o => {
            // console.log('o: ', o)
            if (o.attributeCode == 'state') {
              let isOn = o.value == 'on' ? true : false
              this.setData({
                isOn
              })
            }
            if (o.attributeCode == 'level') {
              this.setData({
                isLevel: true,
                level: o.value
              })
            }
          })
        } else {
          item.attributesEntities.forEach(o => {
            console.log('o: ', o)
            if (o.attributeCode == 'state') {
              let isOn = o.value == 'on' ? true : false
              this.setData({
                isOn
              })
            }
          })
          this.setData({
            level: 'false'
          })
        }
        this.setData({
          deviceDetailsData: item
        })
      }
    })
  },
  disjunctor() {
    const data = {
      attributesEntities: [{
        attributeCode: "state",
        value: !this.data.isOn ? 'on' : 'off'
      }],
      entityId: this.data.entityId,
      serviceCode: ""
    }
    const control = shimaoModel.control(data)
    control.then(res => {
      console.log('disjunctor-res.retcode: ', res.retcode)
      if (!res.retcode) {
        this.refData(this.data.deviceDetailsData.entityName)
      }
    })
  }
})