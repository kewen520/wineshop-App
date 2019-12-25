// miniprogram/pages/mall/revAddress/revAddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: "刘璐婕",
    userPhone: "15658100319",
    wineshopName: "世茂酒店",
    roomNum: "B座608",
    radio: '1',
    picker: ['喵喵喵', '汪汪汪', '哼唧哼唧'],
    index: null,
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
  roomNumChange(e) {
    console.log("e: ", e)
    this.setData({
      index: e.detail.value
    })
  }
})