// miniprogram/pages/mall/shoppingCart/shoppingCart.js
import {
  showLoading,
  hideLoading,
  shimaoModel,
  mallModel
} from '../../../util/mixins.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: [], // 不是数据双向绑定的是通过event.detail赋值过来的
    total: 0,
    totalprice: 0,
    comStyle: {
      width: '300px'
    },
    isAllSelect: false, // 是否全选，false不全选
    cartList: [], // 经过处理的购物车数据，删掉了数量为零的产品
    originalCartData: {} // 原始购物车数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCartList().then(res => {
      if (res == 1) {
        this.onAllSelect()
        this.setData({
          isAllSelect: true
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 单选框选择
  onChange(event) {
    console.log('event: ', event);
    console.log('event.detail.length: ', event.detail.length);
    console.log('this.data.cartList.length: ', this.data.cartList.length);
    console.log('result: ', this.data.result)
    const selectCartList = event.detail
    this.setData({
      result: selectCartList
    });
    this.selectedCartData()

    console.log(this.data.total, this.data.totalprice)
    if (selectCartList.length < this.data.cartList.length) {
      this.setData({
        isAllSelect: false
      })
    }
    if (selectCartList.length == this.data.cartList.length) {
      this.setData({
        isAllSelect: true
      })
    }
  },
  // 选中购物车数据，用于计算底部总数，合计
  selectedCartData() {
    let total = 0
    let totalprice = 0
    let list = this.data.result
    list.forEach((item) => {
      this.data.cartList.forEach(o => {
        console.log(item, o.id)
        if (item == o.id) {
          total += o.total * 1
          totalprice += o.total * o.marketprice
        }
      })
    })
    this.setData({
      total,
      totalprice: parseFloat(totalprice.toFixed(10))
    })
  },
  //全选
  onAllSelect() {
    console.log('onAllSelect')
    const cartListAllData = this.getCartListAllData()
    this.setData({
      total: cartListAllData.total,
      totalprice: cartListAllData.totalprice.toFixed(2),
      result: cartListAllData.cartListAllId
    })
  },
  // 全选或全不选
  onAllSelectOrNoAllSelect(e) {
    console.log("onAllSelect-e: ", e)
    if (e.detail) {
      // 全选
      this.onAllSelect()
    } else {
      // 全不选
      this.setData({
        total: 0,
        totalprice: 0,
        result: []
      })
    }
    this.setData({
      isAllSelect: e.detail
    });
  },
  // 获取购物车所有数据，用于全选后底部数据
  getCartListAllData() {
    let cartList = this.data.cartList
    let cartListAllId = []
    let data = {
      total: 0,
      totalprice: 0,
      cartListAllId: []
    }
    cartList.forEach(item => {
      data.total += item.total * 1
      data.totalprice += item.marketprice * item.total
      data.cartListAllId.push(item.id)
    })
    return data
  },
  // 购物车数据
  getCartList() {
    const CartListParam = {
      openid: wx.getStorageSync('openId')
    }
    const getCartListData = mallModel.getCartList(CartListParam)
    return new Promise((resolve, reject) => {
      getCartListData.then(res => {
        // console.log('getCartListData-res: ', res)
        if (res.merch_list) {
          let {
            list
          } = res.merch_list[0]
          let cartList = list.filter((item) => {
            return item.total * 1 > 0
          })
          this.setData({
            cartList,
            originalCartData: res
          })
        } else {
          this.setData({
            cartList: [],
            originalCartData: res
          })
        }
        resolve('1')
      })
    })
  },
  // 刷新购物车选中的数据
  refCartList() {
    this.getCartList().then(res => {
      if (res == 1) {
        this.selectedCartData()
      }
    })
  },
  // 删除购物车商品
  delCartGoods() {
    console.log("this.data.result: ", this.data.result)
    console.log('this.data.result.length: ', this.data.result.length)
    if (this.data.result.length) {
      const param = {
        ids: this.data.result
      }
      console.log("param: ", param)
      // return
      const cartDel = mallModel.cartDel(param)
      cartDel.then(res => {
        console.log('cartDel-res: ', res)
        if (res.error == 0) {
          this.setData({
            result: []
          })
          this.getCartList().then(res => {
            if (res == 1) {
              this.selectedCartData()
            }
          })
        }
      })
    } else {
      wx.showToast({
        title: "请选择商品",
        icon: 'none'
      })
    }
  },
  // 提交订单
  submitOrder() {
    const openid = wx.getStorageSync('openId')
    const {
      originalCartData,
      result
    } = this.data
    const originalCartList = originalCartData.merch_list[0].list
    console.log('submitOrder')
    console.log('result: ', result)
    console.log('originalCartData: ', originalCartData)
    console.log('originalCartList: ', originalCartList)
    let selectCartList = originalCartList.filter(v => result.includes(v.id))
    let goods = []
    selectCartList.forEach((item) => {
      const {
        goodsid,
        total,
        optionid
      } = item
      let obj = {
        goodsid: goodsid * 1,
        total: total * 1,
        optionid: optionid * 1
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
      address: ""
    } // 联系人 非必填
    console.log(wx.getStorageSync('userInfo'))
    const param = {
      openid,
      goods,
      remark,
      carriers,
      hotelId,
      roomId,
      roomNum
    }
    console.log('param: ', param)
    // return
    const generateOrder = mallModel.generateOrder(param)
    generateOrder.then(res => {
      console.log('generateOrder-res: ', res)
      const {
        data: id
      } = res
      if (res.code == 0) {
        wx.showToast({
          title: `提交订单成功`,
          icon: 'none'
        });
        this.delCartGoods()
        wx.navigateTo({
          url: `/pages/mall/order/order?id=${id}`
        })
      } else {
        wx.showToast({
          title: `提交订单失败`,
          icon: 'none'
        });
      }
    })
  }
})