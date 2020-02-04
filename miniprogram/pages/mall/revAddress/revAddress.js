// miniprogram/pages/mall/revAddress/revAddress.js
import {
  showLoading,
  hideLoading,
  mallModel,
  shimaoModel,
  setStorageSyncMemberDetail
} from '../../../util/mixins.js'
Page({
  setStorageSyncMemberDetail,
  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    mobile: "",
    roomId: "",
    hotelId: "",
    hotelName: "",
    roomNum: "",
    gender: '0',
    originalRoomList: [], // 原始房间信息
    roomList: [],
    index: -1,
    orderId: '',
    selRoom: '请选择楼栋和房间号'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setStorageSyncMemberDetail()
    const {
      id
    } = options
    this.setData({
      orderId: id,
      hotelName: wx.getStorageSync('userInfo').hotelName,
    })
    console.log("wx.getStorageSync('carrier'): ", wx.getStorageSync('carrier'))
    const {
      carrier_mobile,
      hotelId,
      roomID,
      roomNum,
      gender,
      carrier_realname
    } = wx.getStorageSync('carrier')
    // 订单用户信息有数据时就用订单用户信息
    if (carrier_mobile) {
      this.setData({
        mobile: carrier_mobile,
        gender,
        roomId: roomID,
        hotelId: wx.getStorageSync('userInfo').hotelId,
        name: carrier_realname,
        roomNum: roomNum
      })
    } else {  // 否则用userInfo的数据
      let sex = wx.getStorageSync('memberDetail').sex
      let gender = '-1'
      // console.log('sex: ', sex)
      if (sex == 1) {
        gender = '0'
      } else if (sex == 2) {
        gender = '1'
      }
      // console.log('gender: ', gender)
      this.setData({
        mobile: wx.getStorageSync('memberDetail').mobile,
        gender,
        roomId: wx.getStorageSync('userInfo').roomId,
        hotelId: wx.getStorageSync('userInfo').hotelId,
        name: wx.getStorageSync('userInfo').name,
        roomNum: wx.getStorageSync('userInfo').roomNum
      })
    }
    
    console.log('this.data', this.data)

    this.getRoomList()
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
  onChange(event) {
    this.setData({
      gender: event.detail
    });
  },
  roomNumChange(e) {
    console.log("e: ", e)
    console.log('this.data.roomList: ', this.data.roomList)
    this.setData({
      index: e.detail.value,
      roomNum: this.data.originalRoomList[e.detail.value].roomNum
    })
    console.log('roomNum:', this.data.roomNum)
  },
  modifyAddress() {
    const param = {
      order_id: this.data.orderId,
      hotelId: "",
      roomID: "",
      roomNum: "",
      contacts: "",
      mobile: "",
      sex: ""
    }
    const modifyAddress = mallModel.modifyAddress(param)
  },
  getRoomList() {
    const param = {
      hotelId: this.data.hotelId
    }
    const getRoomList = shimaoModel.getRoomList(param)
    getRoomList.then(res => {
      console.log('getRoomList-res: ', res)
      if (res.retcode == 0) {
        let roomList = []
        res.data.forEach((item, i) => {
          if (wx.getStorageSync('carrier').roomNum) {
            if(item.roomNum == wx.getStorageSync('carrier').roomNum) {
              this.setData({
                index: i
              })
            }
          } else {
            if (item.roomNum == wx.getStorageSync('userInfo').roomNum) {
              item.houseTypeName = item.houseTypeName + '(默认)'
              this.setData({
                index: i
              })
            }
          }
          roomList.push(item.houseTypeName)
        })
        this.setData({
          originalRoomList: res.data,
          roomList
        })
      }
    })
  },
  getName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  getMobile(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  submit() {
    if (this.data.name == "") {
      wx.showToast({
        title: `联系人姓名不能为空`,
        icon: 'none'
      });
      return
    }
    if (this.data.mobile == "") {
      wx.showToast({
        title: `联系人手机号不能为空`,
        icon: 'none'
      });
      return
    }
    const param = {
      order_id: this.data.orderId,
      hotelId: this.data.hotelId,
      roomID: this.data.roomId,
      roomNum: this.data.roomNum,
      contacts: this.data.name,
      mobile: this.data.mobile,
      sex: this.data.gender,
    }
    const modifyAddress = mallModel.modifyAddress(param)
    modifyAddress.then(res => {
      console.log('modifyAddress-res: ', res)
      if (res.code == 0) {
        wx.showToast({
          title: `地址修改成功`,
          icon: 'none'
        });
        wx.redirectTo({
          url: `/pages/mall/order/order?id=${this.data.orderId}`
        })
      } else {
        wx.showToast({
          title: `地址修改失败`,
          icon: 'none'
        });
      }
    })
  }
})