// components/mall/detailed/detailed.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shopdetail: {
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
    stopMove() {
      return;
    },
    closeBox() {
      console.log('closeBox');
      this.triggerEvent('closeDetail', {}, {})
    }
  }
})
