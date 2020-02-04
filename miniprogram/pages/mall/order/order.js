// miniprogram/pages/mall/order/order.js
import {
  showLoading,
  hideLoading,
  mallModel
} from '../../../util/mixins.js'
import {
  config
} from '../../../config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDialog: false,
    showPopup: false,
    commentsValue: "",
    orderGoods: [], // 订单商品
    carrier: {}, // 订单用户信息
    userInfo: {}, // 默认用户信息
    totalNum: 0,
    totalPrice: 0,
    ordersn: '',
    id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options: ', options)
    const {
      id
    } = options    
    this.getOrderDetail(id)
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
  commentsHandle() {
    console.log('commentsHandle')
    this.setData({
      showPopup: true
    })
  },
  closeComments() {
    this.setData({
      showPopup: false,
      commentsValue: ""
    })
  },
  // 购物车详情
  getOrderDetail(id) {
    const param = {
      openid: wx.getStorageSync('openId'),
      id
    }
    const orderDetail = mallModel.orderDetail(param)
    orderDetail.then(res => {
      console.log('orderDetail-res: ', res)
      if (res.error == 0) {
        let totalNum = 0
        let totalPrice = 0
        res.goods.forEach(item => {
          totalNum += parseInt(item.total)
        })
        if (res.carrier.carrier_mobile) {
          let carrier = res.carrier
          carrier.hotelName = wx.getStorageSync('userInfo').hotelName
          this.setData({
            carrier: res.carrier
          })
        } else {
          let userInfo = wx.getStorageSync('userInfo')
          userInfo.mobile = wx.getStorageSync('memberDetail').mobile
          let sex = wx.getStorageSync('memberDetail').sex
          // console.log('sex: ', sex)
          if (sex == 1) {
            userInfo.gender = '0'
          } else if (sex == 2) {
            userInfo.gender = '1'
          }
          this.setData({
            userInfo,
          })
        }
        this.setData({
          orderGoods: res.goods,
          totalNum,
          totalPrice: res.order.goodsprice,
          ordersn: res.order.ordersn,
          id: res.order.id
        })
      }
    })
  },
  // 提交留言
  submitComments() {
    console.log("commentsValue: ", this.data.commentsValue);
    this.setData({
      showPopup: false
    })
  },
  // 修改留言文本域
  commentsTextAreaBlur(e) {
    this.setData({
      commentsValue: e.detail.value
    })
  },
  // 提交订单
  submitOrder() {
    console.log('submitOrder-carrier: ', this.data.carrier)
    console.log('orderGoods: ', this.data.orderGoods)
    console.log('id: ', this.data.id)
    const {
      roomNum,
      roomId,
      carrier_realname,
      carrier_mobile,
      gender,
      hotelId
    } = this.data.carrier
    console.log('roomNum: ', roomNum)
    if (!roomNum) {
      wx.showToast({
        title: `房间号不能为空`,
        icon: 'none'
      });
      return
    }
    if (!roomId) {
      wx.showToast({
        title: `房间ID不能为空`,
        icon: 'none'
      });
      return
    }
    if (!carrier_realname) {
      wx.showToast({
        title: `联系人名字不能为空`,
        icon: 'none'
      });
      return
    }
    if (!carrier_mobile) {
      wx.showToast({
        title: `联系人电话不能为空`,
        icon: 'none'
      });
      return
    }
    if (!gender) {
      wx.showToast({
        title: `联系人性别不能为空`,
        icon: 'none'
      });
      return
    }
    if (!hotelId) {
      wx.showToast({
        title: `酒店ID不能为空`,
        icon: 'none'
      });
      return
    }
    console.log('this.data.ordersn: ', this.data.ordersn)
    // return
    const path = `/pages/index/index?id=${this.data.id}&appId=${config.appId}&returnUrl=pages/mall/settleAccounts/orderSuc/orderSuc&ordersn=${this.data.ordersn}&price=${this.data.totalPrice}&three=three&notify=https://shopping.shimaoiot.com/addons/ewei_shopv2/payment/wechat/notify.php`
    console.log("path: ", path)
    wx.setStorageSync('payOrderId', this.data.id),
      // return
      wx.navigateToMiniProgram({
        appId: 'wx2c1b7edee14d02dd',
        path,
        envVersion: 'develop',
        success(res) {
          console.log('res: ', res)
        }              
      })
  },
  // 跳转修改页面
  goRevAddress() {
    console.log('goRevAddress')
    console.log('this.data.id: ', this.data.id)
    console.log('carrier: ', this.data.carrier)
    // return
    wx.setStorageSync('carrier', this.data.carrier),
      // return
      wx.navigateTo({
        url: `/pages/mall/revAddress/revAddress?id=${this.data.id}`
      })
  }
})