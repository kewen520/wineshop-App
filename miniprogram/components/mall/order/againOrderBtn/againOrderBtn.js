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
      const openid = wx.getStorageSync('openId')
      console.log("handleBtn-this.data.orderGoods: ", this.data.orderGoods)
      let goods = []
      this.data.orderGoods.forEach(item => {
        let obj = {
          goodsid: item.id || item.goodsid,
          total: item.total * 1,
          optionid: item.optionid * 1
        }
        goods.push(obj)
      })
      console.log('goods: ', goods)
      const {
        hotelId,
        roomId,
        roomNum,
        name
      } = wx.getStorageSync('userInfo')
      let remark = "" // 备注
      let carriers = {
        carrier_realname: name,
        carrier_mobile: "",
        address: "" // 联系人 非必填
      }
      if (this.data.btnType == 'again') {
        const param = {
          openid,
          goods,
          remark,
          carriers,
          hotelId,
          roomID: roomId,
          roomNum
        }
        const generateOrder = mallModel.generateOrder(param)
        generateOrder.then(res => {
          console.log('generateOrder-res: ', res)
          const {
            data: id
          } = res
          if (res.code == 0) {
            wx.navigateTo({
              url: `/pages/mall/order/order?id=${id}`
            })
          }
        })
      } else if (this.data.btnType == 'continue') {
        console.log('orderGoods[0]: ', this.data.orderGoods[0])
        console.log('orderGoods: ', this.data.orderGoods)
        const path = `/pages/index/index?id=${this.data.orderGoods.id}&appId=${config.appId}&returnUrl=pages/mall/settleAccounts/orderSuc/orderSuc&ordersn=${this.data.orderGoods.ordersn}&price=${this.data.orderGoods.price}&three=three&notify=https://shopping.shimaoiot.com/addons/ewei_shopv2/payment/wechat/notify.php`
        console.log("path: ", path)
        // return
        wx.navigateToMiniProgram({
          appId: 'wx2c1b7edee14d02dd',
          path,
          envVersion: 'develop',
          success(res) {
            console.log('res: ', res)
          }
        })
      }
    }
  }
})