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
      console.log('obj: ', obj)
      obj.time = util.dateFormat(obj.createtime, "YYYY-mm-dd HH:MM")
      let cutOffTime = obj.createtime * 1000 + 15 * 60 * 1000
      console.log('cutOffTime: ', cutOffTime)

      let currentDate = new Date();
      let currentTime = currentDate.getTime(); //获取时间戳
      let residue = cutOffTime - currentTime
      if (residue > 0) {
        this.setData({
          residue,
          comOrderGoods: obj,
          cutOffTime
        })
      } else {
        this.setData({
          comOrderGoods: obj,
          cutOffTime
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    comOrderGoods: {},
    timeout: false,
    cutOffTime: 0,
    residue: 0
  },

  attached() {
    // console.log('orderGoods: ', this.data.orderGoods)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goCountdown(numTime) {
      // console.log('this.data.cutOffTime: ', this.data.cutOffTime)
      // console.log('this.data.countdownStr: ', this.data.countdownStr)
      console.log('numTime: ', numTime)
      let currentDate = new Date();
      let currentTime = currentDate.getTime(); //获取时间戳
      let formatRemainTime = util.formatRemainTime(numTime)
      this.setData({
        countdownStr: formatRemainTime
      })
      if (currentTime < this.data.cutOffTime) {
        let timer = setTimeout(() => {
          this.goCountdown(this.data.cutOffTime)
        }, 1000)
        this.setData({
          timing: timer
        })
      } else {
        console.log('CanceledOrder')
        clearTimeout(this.data.timing)
        this.setData({
          timeout: true
        })
      }
    },
    CanceledOrder() {
      clearTimeout(this.data.timing)
      this.triggerEvent('CanceledOrder', {}, {})
      this.setData({
        timeout: true
      })
    }
  }
})