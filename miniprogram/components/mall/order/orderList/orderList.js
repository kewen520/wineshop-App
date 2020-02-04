// components/mall/order/orderList/orderList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderGoods: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goOrderDetail() {
      // wx.setStorageSync('orderDetails', this.data.orderGoods)
      wx.navigateTo({
        url: `/pages/mall/mallOrder/orderDetails/orderDetails?id=${this.data.orderGoods.id}`
      })
    }
  }
})
