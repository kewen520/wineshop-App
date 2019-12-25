// miniprogram/pages/mall/index/index.js
import { showLoading, hideLoading, shimaoModel, mallModel } from '../../../util/mixins.js'
import {
  config
} from '../../../config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeId: 0,
    productCategory: ["食品", "饮品", "美妆", "成人用品", "电子数码", "美食", "书籍", "水果", "蔬菜", "教程", "家居", "电器"],
    shopList: [],
    TabCur: 0,
    isShowDetail: false,
    shopdetail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const param = {
    //   openid: 'o0qqL5e3eNhnHCNidf60RjAxQEvg',
    //   type,
    //   id
    // }
    // const header = {
    //   'content-type': 'application/x-www-form-urlencoded'
    // }
    // mallModel.placeOrder.then(res => {

    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getShopList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  getShopList() {
    let _this = this
    // https://ym-smartspace.yunzhisheng.cn:8088/hotel/shop.json

    // let param = {}

    let header = {
      'content-type': 'application/json'
    }
    wx.request({
      url: 'https://shopping.shimaoiot.com/app/index.php?i=2&c=entry&m=ewei_shopv2&do=mobile&r=goods.get_list&keywords=&isrecommand=&ishot=&isnew=&isdiscount=&issendfree=&istime=&cate=&order=&by=&merchid=&page=1&frommyshop=0',
      method: 'POST',
      data: {
        "container": "12",
        "box": "11"
      },
      header,
      success: (res) => {
        console.log('res-1: ', res)
        _this.setData({
          shopList: res.data.result.list
        })
      }
    })
  },
  onShareAppMessage: function () {

  },

  onChange(event) {
    wx.showToast({
      icon: 'none',
      title: `切换至第${event.detail}项`
    });
  },

  openDetail(e) {
    console.log('e: ', e)
    const { id } = e.currentTarget.dataset
    const param = {
      id
    }
    const header = {
      'content-type': 'application/x-www-form-urlencoded'
    }
    const getDetail = mallModel.getDetail(param, header)
    getDetail.then(res => {
      console.log('getDetail - res: ', res)
      if(!res.error){
        // this.data.isShowDetail = true;
        const { shopdetail } = res.goods
        this.setData({
          isShowDetail: true,
          shopdetail
        })
      }
    })
  },
  closeDetail() {
    this.setData({
      isShowDetail: false
    })
  }
})