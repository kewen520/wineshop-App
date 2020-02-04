// miniprogram/pages/mall/mallOrder/mallOrder.js
import {
  showLoading,
  hideLoading,
  mallModel
} from '../../../util/mixins.js'
const statusArr = ['', '0', '1', '2', '3']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    currentTag: 0,
    orderListData: [],
    currentPage: 0,
    orderListTotal: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('mallorder-show')
    this.getOrderList(1, '')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.dataPaging()
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
    console.log('event.detail.name: ', event.detail.name)
    this.setData({
      currentTag: event.detail.name
    })
    this.getOrderList(1, statusArr[this.data.currentTag])
  },
  // 数据分页 此处要改，切换做切换分页做分页
  dataPaging() {
    if (this.data.orderListTotal > this.data.orderListData.length)
      this.getOrderList(++this.data.currentPage, statusArr[this.data.currentTag])
  },
  getOrderList(i, status) {
    // console.log('getOrderList-i: ', i)
    // console.log('getOrderList-status: ', status)
    // return
    wx.showLoading({
      title: '加载中',
    })
    const param = {
      openid: wx.getStorageSync('openId'),
      status,
      page: i
    }
    const orderList = mallModel.orderList(param)
    orderList.then(res => {
      // console.log('getAllOrderList - res: ', res)
      if (res.error == 0) {
        wx.hideLoading()
        // 如果为1页，将清空数据
        if (i == 1) {
          this.setData({
            orderListData: []
          })
        }
        this.setData({
          orderListData: this.data.orderListData.concat(res.list),
          currentPage: i,
          orderListTotal: res.total
        })
        // console.log("this.data.orderListData: ", this.data.orderListData)
      }
    })
  }
})