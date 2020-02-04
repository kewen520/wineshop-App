// components/mall/order/orderItem/orderItem.js
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

  attached () {
    console.log('orderGoods: ', this.data.orderGoods)
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
