// miniprogram/pages/mall/order/order.js
import util from '../../../../util/util.js'
import {
  showLoading,
  hideLoading,
  mallModel
} from '../../../../util/mixins.js'
import {
  config
} from '../../../../config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetails: {},
    hotelName: "",
    residue: 0,
    timeout: false, // true 表示已取消
    totalNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const id = options.id
    this.setData({
      hotelName: wx.getStorageSync("userInfo").hotelName,
      roomNum: wx.getStorageSync("userInfo").roomNum
    })
    console.log("hotelName: ", this.data.hotelName)
    this.getOrderDetails(id)
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

  },
  getOrderDetails(id) {
    const param = {
      openid: wx.getStorageSync('openId'),
      id
    }
    const orderDetail = mallModel.orderDetail(param)
    orderDetail.then(res => {
      console.log('orderDetail-res: ', res)
      if (res.error == 0) {
        let totalNum = 0
        res.goods.forEach(item => {
          totalNum += parseInt(item.total)
        }) // createtime
        
        if (res.order.status == '0') {
          let createtimeStr = res.order.createtime
          let timestamp = new Date(createtimeStr.replace(new RegExp('-', 'g'), '/')).getTime()
          let cutOffTime = timestamp + 15 * 60 * 1000
          let currentDate = new Date();
          let currentTime = currentDate.getTime(); //获取时间戳

          console.log('cutOffTime: ', cutOffTime)
          console.log('currentTime: ', currentTime)
          let residue = cutOffTime - currentTime
          console.log('residue: ', residue)
          if (residue > 0) {
            this.setData({
              orderDetails: res,
              totalNum,
              residue
            })
          } else {
            this.setData({
              orderDetails: res,
              totalNum,
              timeout: true
            })
          }
        } else {
          this.setData({
            orderDetails: res,
            totalNum,
            timeout: true
          })
        }

      }
    })
  },
  CanceledOrder() { // 取消订单
    clearTimeout(this.data.timing)
    this.setData({
      timeout: true
    })
  }
})