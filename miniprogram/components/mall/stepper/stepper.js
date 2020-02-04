// components/mall/stepper/stepper.js
import {
  showLoading,
  hideLoading,
  shimaoModel,
  mallModel
} from '../../../util/mixins.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    maxNum: {
      type: Number,
      value: 0
    },
    num: {
      type: Number,
      value: 0
    },
    setpperType: {
      type: String
    },
    cardid: {
      type: Number
    },
    goodsid: {
      type: Number
    }
  },

  observers: {
    num(v) {
      this.setData({
        comNum: v
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    comNum: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    addOrReduce(e) {
      // console.log('addOrReduce-e: ', e)
      // console.log('this: ', this)
      // console.log('setpperType: ', this.data.setpperType)
      // console.log('cardid: ', this.data.cardid)
      // console.log('comNum: ', this.data.comNum)
      // console.log('goodsid: ', this.data.goodsid)
      // console.log('maxNum', this.data.maxNum)
      // console.log('maxNum', typeof this.data.maxNum)
      if (e.currentTarget.dataset.type == "reduce") {
        if (this.data.setpperType == 'cart') {
          if (this.data.comNum > 1) {
            this.cartUpdate(this.data.cardid, this.data.comNum - 1).then(() => {
              this.setData({
                comNum: this.data.comNum - 1
              })
            })
          } else {
            wx.showToast({
              title: "购物车商品数量不能小于1",
              icon: 'none'
            })
          }
        } else {
          this.cartUpdate(this.data.cardid, this.data.comNum - 1).then(() => {
            this.setData({
              comNum: this.data.comNum - 1
            })
          })
        }
      } else {
        if (this.data.maxNum > this.data.comNum) {
          if (this.data.comNum == 0) {
            this.cartadd(this.data.goodsid, this.data.comNum).then(() => {
              this.setData({
                comNum: this.data.comNum + 1
              })
            })
          } else {
            this.cartUpdate(this.data.cardid, this.data.comNum + 1).then(() => {
              this.setData({
                comNum: this.data.comNum + 1
              })
            })
          }
        } else {
          wx.showToast({
            title: "产品库存不够",
            icon: 'none'
          })
        }
      }
    },
    cartUpdate(id, total) {
      // console.log('cartUpdate', id, total)
      // console.log('mallModel: ', mallModel)
      let param = {
        openid: wx.getStorageSync('openId'),
        id,
        total
      }
      showLoading()
      const cartUpdate = mallModel.cartUpdate(param)
      return new Promise((resolve, reject) => {
        cartUpdate.then(res => {
          console.log('cartUpdate-res: ', res)
          if (res.error == 0) {
            // wx.showToast({
            //   title: "购物车修改成功",
            //   icon: 'none'
            // })
            hideLoading()
            resolve()
            this.triggerEvent('refdata', {}, {})
          } else {
            hideLoading()
            wx.showToast({
              title: "购物车修改失败",
              icon: 'none'
            })
            reject()
          }
        })
      })


    },
    cartadd(goodsid, total) {
      // console.log('cartadd-goodsid: ', goodsid)
      let param = {
        openid: wx.getStorageSync('openId'),
        id: goodsid,
        total
      }
      showLoading()
      const cartadd = mallModel.cartadd(param)
      return new Promise((resolve, reject) => {
        cartadd.then(res => {
          // console.log('cartadd-res: ', res)
          if (res.error == 0) {
            // wx.showToast({
            //   title: "购物车新增成功",
            //   icon: 'none'
            // })
            hideLoading()
            resolve()
            this.triggerEvent('refdata', {}, {})
          } else {
            hideLoading()
            wx.showToast({
              title: "购物车新增失败",
              icon: 'none'
            })
            reject()
          }
        })
      })
    }
  }
})