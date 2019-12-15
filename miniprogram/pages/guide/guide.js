// miniprogram/pages/guide/guide.js
// import {
//   ShimaoModel
// } from '../../models/shimao.js'

import {
  config
} from '../../config.js'
// const app = getApp()

// const shimaoModel = new ShimaoModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tit: '欢迎您下榻皇家艾美酒店',
    info: '上海世茂皇家艾美酒店地处市中心，矗立于久负盛名的南京东路和满目绿荫的人民广场之间',
    copyright: '世茂集团 版权所有 copyright © 2019',
    openId: '',
    unionid: '',
    regEncryptedData: '',
    iv: '',
    isRegister: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.removeStorageSync('token')
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
  bindGetUserInfo(e) {
    // console.log('e: ', e.datail)
    // const data = {
    //   code: app.globalData.userInfo.code,
    //   iv: e.datail.iv,
    //   appid: 'wx64eb9e2828c2b180'
    // }
    // console.log('bindGetUserInfo-data: ', data)
  },
  getPhoneNumber(res) {
    console.log('getPhoneNumber: ', res)
    console.log('jm: ', res.detail.encryptedData)
    let param = {
      encryptedData: res.detail.encryptedData,
      iv: res.detail.iv,
      openid: this.data.openId,
      unionid: this.data.unionid
    }
    console.log('param: ', param)
    // return
    wx.request({
      url: `https://pre-api.shimaoiot.com/member/weixinRegister`,
      data: param,
      method: 'POST',
      header: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      success: function (res) {
        console.log('weixinRegister-res: ', res)
        console.log('weixinRegister-res.data.data.token.token: ', res.data.data.token.token)
        let token = res.data.data.token.token
        // return
        wx.setStorageSync('token', res.data.data.token.token)
        // return
        if (token) {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
      }
    })    
  },

  // 进入首页
  onGotUserInfo: function (e) {
    console.log('onGotUserInfo: ', e)
    let _this = this
    wx.login({
      success(res) {
        console.log('wx.login: ', res)
        const data = {
          code: res.code,
          iv: e.detail.iv,
          appid: config.appId
        }
        // console.log('data: ', data)
        const header = {
          encryptedData: e.detail.encryptedData,
        }
        console.log('data: ', data)
        console.log('header: ', header)
        // const weixinCodeLogin = shimaoModel.weixinCodeLogin(data, header)
        wx.request({
          url: `https://pre-api.shimaoiot.com/member/weixinCodeLogin`,
          data, 
          method: 'POST',
          header,
          success: function (res) {
            console.log('res: ', res)
            if (res.data.retcode == 16) {
              _this.setData({
                iv: e.detail.iv,
                openId: res.data.data.openId,
                unionid: res.data.data.unionid,
                isRegister: true
              })
              console.log('res.data.retcode')
              console.log('data-iv: ', _this.data.iv)
              console.log('data-openId: ', _this.data.openId)
              console.log('data-unionid: ', _this.data.unionid)
              console.log('data-isRegister: ', _this.data.isRegister) 
            } else {
              // console.log('res.data.data.token.token: ', res.data.data.token.token)
              if (res.data.data){       
                let token = res.data.data.token.token
                wx.setStorageSync('token', res.data.data.token.token)
                // return
                if (token) {
                  wx.reLaunch({
                    url: '/pages/index/index',
                  })
                }
                
              }

            }
          }
        })





        
      }
    })
    
  },
})