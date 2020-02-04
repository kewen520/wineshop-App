// miniprogram/pages/mall/settleAccounts/checkoutSuc.js
import {
  showLoading,
  hideLoading,
  mallModel
} from '../../../../util/mixins.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStatus: 0,  // 1成功，0加载，2失败
    codeNum: '',
    step: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options: ', options)
    this.setTimer()
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
  setTimer() {
    let timer
    this.setData({
      step: ++this.data.step,
      orderStatus: 0
    })
    console.log('step: ', this.data.step)
    const param = {
      openid: wx.getStorageSync('openId'),
      id: wx.getStorageSync('payOrderId')
    }
    const orderDetail = mallModel.orderDetail(param)
    orderDetail.then(res => {
      console.log('orderDetail-res: ', res)
      if (res.error == 0 && res.order.pickUpCode) {
        this.setData({
          orderStatus: 1,
          codeNum: res.order.pickUpCode
        })
      } else {
        if (this.data.step < 3) {
          timer = setTimeout(() => {
            this.setTimer()
          }, 5000)
        } else {
          console.log('clearTimeout')
          clearTimeout(timer) //清理定时任务
          this.setData({
            step: 0,
            orderStatus: 2,
          })
        }
      }
    })
  },
  toMallOrder() {
    console.log('toMallOrder')
    wx.navigateTo({
      url: `/pages/mall/mallOrder/mallOrder`
    })
  }
})