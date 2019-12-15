// miniprogram/pages/device/corridorLamp/corridorLamp.js
import { showLoading, hideLoading, shimaoModel, getDeviceList, disjunctor, getPreOrNextData } from '../../../util/mixins.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOn: false,
    entityId: '',
    openStr: 'https://ym-smartspace.yunzhisheng.cn:8088/hotel/im_bg_home@2x.png',
    closeStr: 'https://ym-smartspace.yunzhisheng.cn:8088/hotel/img_light.png',
    deviceDetailsData: '',
    colorTemperature: 0, // 色温
    hasColorTemperature: false,
    level: 0,  // 亮度
    hasLevel: false,
    deviceData: [],
    pageForm:'',
    preOrNextData: {}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      entityId: options.entityId
    })
    // console.log('corrid - options: ', options)
    // console.log('corrid - options.pageForm: ', options.pageForm)
    // console.log('this.data.pageForm: ', this.data.pageForm)
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
      // console.log('corrdorlamp-res: ', res)
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
      // console.log('preOrNextData: ', this.data.preOrNextData)
    })
  },
  getPreOrNextData,
  // 获得设备详情
  getDeviceDetailsData(list, entityId) {
    list.forEach(item => {
      // 数据中找出本设备
      if (item.entityId == entityId) {
        console.log('deviceDetailsData: ', item)
          item.attributesEntities.forEach(o => {
            // console.log('o: ', o)
            
            if (o.attributeCode == 'state') {
              console.log('o.value: ', o.value)
              let isOn = o.value == 'on' ? true : false
              this.setData({
                isOn
              })
            }
            if (o.attributeCode == 'colorTemperature') {
              console.log('colorTemperature: ', o.value)
              this.setData({
                colorTemperature: o.value,
                hasColorTemperature: true
              })
            }
            if (o.attributeCode == 'level') {
              this.setData({
                level: o.value,
                hasLevel: true
              })
            }
          })
        
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