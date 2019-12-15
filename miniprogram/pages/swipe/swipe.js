// miniprogram/pages/swipe/swipe.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [{
      url: 'https://ym-smartspace.yunzhisheng.cn:8088/hotel/img_no-disturbing.png'
    }, {
      url: 'https://ym-smartspace.yunzhisheng.cn:8088/hotel/img_room-cleaning.png'
    }],
    //是否显示指适点
    indicatorDots: true,
    //是否轮播
    autoplay: true,
    //
    interval: 5000,
    duration: 1000,
    inputShowed: false,
    inputVal: "",
    //轮播页当前index
    swiperCurrent: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //轮播图点击事件
  swipclick: function (e) {
    console.log(this.data.swiperCurrent)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})