// miniprogram/pages/mall/index/index.js
import {
  showLoading,
  hideLoading,
  shimaoModel,
  mallModel,
  setStorageSyncMemberDetail
} from '../../../util/mixins.js'

import utils from '../../../util/util.js'
import {
  config
} from '../../../config.js'
Page({
  setStorageSyncMemberDetail,
  /**
   * 页面的初始数据
   */
  data: {
    activeId: 0,
    containers: [], // 货柜信息，用户产品列表接口使用
    productCategory: [],
    shopList: [],
    TabCur: 0,
    cartTotal: 0,
    isShowDetail: false,
    shopdetail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 先获取货柜信息
    // this.getCounter().then(() => {
    //   this.getShopAndCartList()
    // })
    this.setStorageSyncMemberDetail()
    this.getShopAndCartList()

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    // 先获取货柜信息
    // this.getCounter().then(() => {
    //   this.getShopAndCartList()
    // })
    this.getShopAndCartList()

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

  // 获取货柜信息shimaoModel
  getCounter() {
    const param = {
      typeCode: 'counter',
      hotelId: wx.getStorageSync('userInfo').hotelId
    }
    const getCounter = shimaoModel.getCounter(param)
    return new Promise((resolve, reject) => {
      getCounter.then(res => {
        console.log('getCounter-res: ', res)
        if (res.retcode == 0) {
          console.log('getCounter-res.data: ', res.data)
          this.setData({
            containers: res.data
          })
        }
        resolve()
      })

    })
  },

  // 产品购物车整合列表
  getShopAndCartList(i) {
    console.log('this.data.containers: ', this.data.containers)
    const ShopListParam = {
      containers: ["wsd4b37d9cd9"],
      // constainers: this.data.containers,
      merchid: "14"
    }
    const getShopListData = mallModel.getShopList(ShopListParam);
    const CartListParam = {
      openid: wx.getStorageSync('openId')
    }

    const getCartListData = mallModel.getCartList(CartListParam)
    Promise.all([getShopListData, getCartListData]).then(res => {
      console.log('getShopAndCartList-res: ', res)
      let shopResult = res[0].result   // 商品集
      const cartResult = res[1]        // 回收站商品集
      if (!cartResult.empty) {
        cartResult.merch_list[0].list.forEach(item => {
          // console.log('item: ', item)
          shopResult.list.forEach(o => {
            // console.log('o: ', o)
            if (o.id == item.goodsid) {
              o.currentBuyTotal = item.total    // 购买总数
              o.cartId = item.id                // 购物车id
            }
          })
        })
      }
      // shopResult.buyTotal = cartResult.total
      // shopResult.totalprice = cartResult.totalprice
      console.log("shopResult-聚合后的: ", shopResult)
      const {
        list
      } = shopResult
      const goodsList = utils.buildTree(list)
      let categoryArr = []
      goodsList.forEach(item => {
        categoryArr.push(item.categorName)
      })
      this.setData({
        cartTotal: cartResult.total,
        productCategory: categoryArr,
        TabCur: i ? i : 0,
        shopList: i ? goodsList[i].childList : goodsList[0].childList
      })
    })
  },

  refShopAndCartList() {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 切换菜单
  onChange(event) {
    console.log('event: ', event)
    const {
      index
    } = event.currentTarget.dataset
    this.getShopAndCartList(index)
    // wx.showToast({
    //   icon: 'none',
    //   title: `切换至第${event.detail}项`
    // });
  },

  openDetail(e) {
    console.log('e: ', e)
    const {
      shopdata
    } = e.currentTarget.dataset
    const param = {
      id: shopdata.id
    }
    const header = {
      'content-type': 'application/x-www-form-urlencoded'
    }
    const getDetail = mallModel.getDetail(param, header)
    getDetail.then(res => {
      console.log('getDetail - res: ', res)
      if (!res.error) {
        // this.data.isShowDetail = true;
        const {
          goods
        } = res
        goods.subtitle = shopdata.subtitle
        goods.cartId = shopdata.cartId
        goods.currentBuyTotal = shopdata.currentBuyTotal
        this.setData({
          isShowDetail: true,
          shopdetail: goods
        })
      }
    })
  },
  closeDetail() {
    this.setData({
      isShowDetail: false
    })
  },
  // 进入购物车页面
  goShoppingCart() {
    wx.navigateTo({
      url: `/pages/mall/shoppingCart/shoppingCart`
    })
  },
  refShopAndCartList() {
    console.log('index-refShopAndCartList:')
    this.getShopAndCartList(this.data.TabCur)
  }
})