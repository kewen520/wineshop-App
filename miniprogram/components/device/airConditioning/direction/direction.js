// components/device/airConditioning/direction/direction.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mode: {
      type: Number,
      value: 0
    },
    statu: {
      type: Number,
      value: 0
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
    onMode(e) {
      console.log('e: ', e.currentTarget.dataset.index)
      const { index } = e.currentTarget.dataset
      this.triggerEvent('selectMode', {
        index
      }, {})
    }
  }
})

