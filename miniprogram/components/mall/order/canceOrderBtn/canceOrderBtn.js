// components/mall/order/againOrderBtn/againOrderBtn.js
import {
  showLoading,
  hideLoading,
  shimaoModel,
  mallModel
} from '../../../../util/mixins.js'
import {
  config
} from '../../../../config.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderGoods: {
      type: Object
    },
    btnType: {
      type: String
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
    handleBtn() {
      console.log('orderGoods: ', this.data.orderGoods)
      // return
      const openid = wx.getStorageSync('openId')
      const param = {
        openid,
        id: this.data.orderGoods.id
      }
      const orderCancel = mallModel.orderCancel(param)
      orderCancel.then(res => {
        console.log('orderCancel-res: ', res)
        if (res.error == 0) {
          wx.showToast({
            title: `取消成功`,
            icon: 'none'
          });
          this.triggerEvent('CanceledOrder', {}, {})
        } else {
          wx.showToast({
            title: `取消失败`,
            icon: 'none'
          });
        }
      })

    }
  }
})