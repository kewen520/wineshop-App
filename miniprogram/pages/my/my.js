// miniprogram/pages/my/my.js

import { showLoading, hideLoading, setStorageSyncMemberDetail, shimaoModel } from '../../util/mixins.js'

Page({
  showLoading, 
  msgTotal: 0,
  hideLoading, 
  setStorageSyncMemberDetail,
  /**
   * 页面的初始数据
   */
  data: {
    avatarImg: '',
    msgNum: 0,
    memberDetail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMemberDetail()
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
    this.getMemberDetail()
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

  getMemberDetail() {
    const data = {}
    const getMemberDetail = shimaoModel.getMemberDetail(data)
    // this.showLoading()
    getMemberDetail.then(res => {
      // this.hideLoading()
      console.log('getUserInfoData-res: ', res)
      this.getMessageByUse()
      this.setData({
        memberDetail: res.data
      })
    }).catch(err => {
      console.log('err:')
      wx.showToast({
        title: "接口获取失败",
        icon: none,
        duration: 2000
      })
    })
  },

  // 获取用户信息
  getMessageByUse() {
    let data = {
      userId: this.data.memberDetail.id,
      pageNo: 1,
      pageSize: 10
    }
    let queryMessageByUser = shimaoModel.queryMessageByUser(data)
    queryMessageByUser.then(res => {
      console.log('res: ', res)
      let msgTotal=res.data.total
      this.setData({
        msgTotal
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log('res: ', res)
    if (res.from === 'button') {
      console.log('res: ', res)
    }
    return {
      title: '转发',
      path: '/pages/guide/guide',
      imageUrl: 'https://ym-smartspace.yunzhisheng.cn:8088/hotel/poster.png',
      success: function (res) {
        console.log('成功', res)
        wx.showToast({
          title: "分享成功",
          icon: 'success',
          duration: 2000
        })
      }
    }   
  },
  handleShare() {
    wx.showActionSheet({
      itemList: [
        '分享到朋友圈', '分享到qq空间', '分享到微博',
      ],
      success(res) {
        
      }
    })
  },
  handlePage(e) {
    console.log(e.currentTarget.dataset.id)
    const id = e.currentTarget.dataset.id
    if(id == 4) {
      wx.navigateTo({
        url: '/pages/feedback/feedback',
      })
    }
  },
  toMemberDetail() {
    wx.navigateTo({
      url: '/pages/userInfo/userInfo',
    })
  },
  toBill() {
    wx.navigateTo({
      url: '/pages/bill/bill',
    })
  },
  toAbout() {
    wx.navigateTo({
      url: '/pages/edition/edition',
    })
  },
  toMallOrder() {
    wx.navigateTo({
      url: '/pages/mall/mallOrder/mallOrder',
    })
  }
})