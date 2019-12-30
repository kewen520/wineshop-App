// miniprogram/pages/mall/shoppingCart/shoppingCart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: ['1', '2'],
    goodsNum: 2,
    totalPrice: 50,
    isAllSelect: false, // 是否全选，false不全选
    shopItem: {
      "id": "33",
      "title": "停车缴费",
      "subtitle": "",
      "thumb": "https://shopping.shimaoiot.com/attachment/images/2/2019/09/KlJiEiEXNJRj1JJEItnQJ4Ue1eJixj.jpg",
      "thumb_url": "a:0:{}",
      "merchid": "0",
      "cates": "",
      "marketprice": "0.00",
      "productprice": "0.00",
      "minprice": 0,
      "maxprice": 0,
      "isdiscount": "0",
      "isdiscount_time": "1568971200",
      "isdiscount_discounts": "{\"type\":0,\"default\":{\"option0\":\"\"},\"level1\":{\"option0\":\"\"}}",
      "sales": "0",
      "salesreal": "9",
      "total": "10033",
      "description": "",
      "bargain": "0",
      "type": "1",
      "ispresell": "0",
      "virtual": "0",
      "hasoption": "0",
      "video": "",
      "hascommission": "0",
      "nocommission": "0",
      "commission": "{\"type\":0}",
      "commission1_rate": "0.00",
      "commission1_pay": "0.00",
      "presellprice": "0.00",
      "seecommission": 0,
      "cansee": "0",
      "seetitle": ""
    }
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
    console.log('event: ', event);
    this.setData({
      result: event.detail
    });
  },
  onAllSelect(e) {
    console.log("onAllSelect-e: ", e)
    if(e.detail) {
      // 全选
      this.setData({
        goodsNum: 16,
        totalPrice: 25*16,
        result: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
      })
    } else {
      // 全不选
      this.setData({
        goodsNum: 0,
        totalPrice: 0,
        result: []
      })
    }
    this.setData({
      isAllSelect: e.detail
    });
  }
})