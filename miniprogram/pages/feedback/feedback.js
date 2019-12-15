// miniprogram/pages/feedback/feedback.js
import {
  ShimaoModel
} from '../../models/shimao.js'

const shimaoModel = new ShimaoModel()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio: '0',
    message: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onChange(event) {
    this.setData({
      radio: event.detail
    });
  },

  onChangeMessage(e) {
    this.setData({
      message: e.detail
    })
  },

  toHisFeedback() {
    wx.navigateTo({
      url: '/pages/historicalFeedback/historicalFeedback',
    })
  },

  submit() {
    console.log('radio: ', this.data.radio)
    console.log('message: ', this.data.message)
    if(!this.data.message) {
      wx.showToast({
        title: '请输入反馈内容',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }
    console.log('ok')
    const data = {
      type: this.data.radio,
      content: this.data.message,
      hotelId: 'cda49783d8f24561aa8abfd42d5c4edf'
    }
    const addFeedback = shimaoModel.addFeedback(data)
    addFeedback.then(res => {
      console.log('addFeedback-res: ', res)
      if (!res.retcode) {
        wx.navigateTo({
          url: '/pages/historicalFeedback/historicalFeedback',
        })
      }
    })
  }
})