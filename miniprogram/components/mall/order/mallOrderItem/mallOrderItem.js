// components/mall/order/mallOrderItem/mallOrderItem.js
import util from '../../../../util/util.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderGoods: {
      type: Object
    }
  },

  observers: {
    orderGoods(obj) {
      // console.log('obj: ', obj)
      obj.time = util.dateFormat(obj.createtime, "YYYY-mm-dd HH:MM")
      // console.log('obj-time: ', obj)
      this.setData({
        comOrderGoods: obj
      })      
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    comOrderGoods: {}
  },

  attached() {
    console.log('orderGoods: ', this.data.orderGoods)
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
