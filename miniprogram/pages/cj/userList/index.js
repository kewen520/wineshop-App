// pages/userList/index.js
// AppSecret: e6da21754918e93f6b3422210c7ed93f
import {
  UserListModel
} from '../../../models/userList.js'
import {
  DelUserModel
} from '../../../models/delUser.js'
import {
  config
} from '../../../config.js'

let userListModel = new UserListModel()
let delUserModel = new DelUserModel()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    userList: [],
    delUserId: '',
    ifShow: false,
    maxNum: config.maxNum
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('this.options.udid: ', this.options.udid)
    let udid = this.options.udid || "box001"

    wx.setStorage({
      key: "udid",
      data: udid
    })

    this.getUserList(udid)
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
  getUserList(udid) {
    console.log('userListModel.getUserList - udid', udid)
    userListModel.getUserList(udid, (res) => {
      console.log('res: ', res)
      if (!res.status) {
        let userList = res.data
        this.setData({
          userList,
          ifShow: true
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1000,
          mask: true
        })
      }
    })
  },
  onDelUser(e) {
    let delUserId = e.detail.delUserId
    this.setData({
      delUserId
    })
    this.setData({
      show: true
    })
  },
  onClose() {
    this.setData({
      show: false
    })
  },
  cancel() {
    console.log('cancel')
  },
  confirm() {
    console.log('删除时-delUserModel.delUser-udid： ', this.data.delUserId)
    delUserModel.delUser(this.data.delUserId, (res) => {
      if (res.status == 0) {
        var udid = wx.getStorageSync('udid')
        this.getUserList(udid)
      }else{
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1000,
          mask: true
        })
      }
    })
  },
  onAddUser() {
    wx.redirectTo({
      url: "/pages/cj/addUser/index",
    })
  }
})