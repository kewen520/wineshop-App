// miniprogram/pages/historicalFeedback/historicalFeedback.js
import { showLoading, hideLoading } from '../../util/mixins.js'

import {
  ShimaoModel
} from '../../models/shimao.js'

const shimaoModel = new ShimaoModel()


Page({
  
  showLoading,
  hideLoading,
  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    stay: [],
    intellect: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getFeedbackData()
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

  onChange(event) {
    // wx.showToast({
    //   title: `切换到标签 ${event.detail.name}`,
    //   icon: 'none'
    // });
  },

  //shimaoModel
  getFeedbackData() {
    this.showLoading()
    const stayData = {
      type: '0'
    }
    const intellectData = {
      type: '1'
    }
    const stayFeedback = shimaoModel.feedback(stayData)
    const intellectback = shimaoModel.feedback(intellectData)
    Promise.all([stayFeedback, intellectback]).then(res => {
      this.hideLoading()
      this.setData({
        stay: res[0].data,
        intellect: res[1].data
      })
    })
  }
})