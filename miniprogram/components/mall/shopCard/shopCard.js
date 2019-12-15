// components/mall/shopCard/shopCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shopData: {
      type: Object
    }
  },

  observers: {
    shopData(obj) {
      console.log('observers - obj: ', obj)
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

  }
})
