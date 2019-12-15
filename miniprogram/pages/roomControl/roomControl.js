// miniprogram/pages/roomControl/roomControl.js
import { showLoading, hideLoading, shimaoModel, spaceRoom } from '../../util/mixins.js'
import {
  config
} from '../../config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isMenu: true,   // 是否显示菜单
    selIndex: '',   // 菜单选中第几个
    allSpace: true, // 全部设备
    subsetHomeRoomVoList: [], // 空间列表
    deviceData: [],   // 设备数据
    spaceName: '',    // 空间名字
    isNoSpace: true   // 是否有设备
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      console.log('userInfo: ', userInfo)
      this.getSpaceList(userInfo.roomSpaceId)
    }
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
    this.refDevice()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

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
  showLoading,
  hideLoading,
  menuSlide() {
    this.setData({
      isMenu: !this.data.isMenu
    })
  },

  // 做菜单点选方法
  selectDeviceSpace(e) {
    this.setData({
      allSpace: false
    })
    let SpaceInfo = {
      SpaceName: 'childrenSpace',
      SpaceId: e.currentTarget.dataset.spaceid
    }
    // 缓存空间信息
    wx.setStorageSync('SpaceInfo', SpaceInfo)
    this.getDeviceList('childrenSpace', e.currentTarget.dataset.spaceid, e.currentTarget.dataset.spacename)
    this.setData({
      selIndex: e.currentTarget.dataset.index
    })
  },

  // 做菜单点选全部的事件
  selAllSapce() {
    this.setData({
      allSpace: true
    })
    let SpaceInfo = {
      SpaceName: 'all',
      SpaceId: -100
    }
    // 缓存空间信息
    wx.setStorageSync('SpaceInfo', SpaceInfo)
    this.getDeviceList('all', wx.getStorageSync('userInfo').roomSpaceId, '全部')
    
  },

  // 获取房间列表，且根据allSpace和selIndex获得右边的数据
  getSpaceList(spaceId) {
    let param = {
      spaceId
    }
    let spaceList = shimaoModel.spaceList(param)
    spaceList.then(res => {
      if (!res || !res.data) {
        return
      }
      // console.log('res: ', res)
      if (res.data.subsetHomeRoomVoList) {
        let subsetHomeRoomVoList = res.data.subsetHomeRoomVoList
        let spaceRoomList = []
        res.data.subsetHomeRoomVoList.forEach(item => {
          // console.log('spaceRoom: ', spaceRoom)
          // 匹配右边的图标
          spaceRoom.forEach(o => {
            if (item.spaceName == o.name) {
              // console.log('item.spaceName: ', item.spaceName)
              item.src = o.src
            }
          })
          spaceRoomList.push(item)
        })
        // console.log('spaceRoomList: ', spaceRoomList)
        this.setData({
          subsetHomeRoomVoList: spaceRoomList,
          isNoSpace: false
        })

        // 如果allSpace右边就是用全部设备，
        if (this.data.allSpace) { // 全部
          this.selAllSapce()
        } else {// 用子空间设备
          this.getDeviceList('childrenSpace', subsetHomeRoomVoList[this.data.selIndex].spaceId, subsetHomeRoomVoList[this.data.selIndex].spaceName)
          let SpaceInfo = {
            SpaceName: 'childrenSpace',
            SpaceId: subsetHomeRoomVoList[this.data.selIndex].spaceId
          }
          // 缓存空间信息
          wx.setStorageSync('SpaceInfo', SpaceInfo)
        }        
      } else { // 没有房间
      
        this.setData({
          isNoSpace: true
        })
        let SpaceInfo = {
          SpaceName: 'all'
        }
        // 缓存空间信息
        wx.setStorageSync('SpaceInfo', SpaceInfo)
        this.getDeviceList('all', wx.getStorageSync('userInfo').roomSpaceId, '全部')
      }
    })
  },

  // 设备列表,获取空间的设备列表，且右边所需的信息，全部要插入总开关
  getDeviceList(type, spaceId, spaceName) {
    // console.log('getDeviceList')
    // return
    this.showLoading()
    let param = {
      spaceId
    }
    if (type == 'childrenSpace') {    // 子空间
      // console.log('childrenSpace')
      const queryDeviceListBySpaceId = shimaoModel.queryDeviceListBySpaceId(param)
      queryDeviceListBySpaceId.then(res => {
        this.hideLoading()
        console.log('getDeviceList-res: ', res.data)
        // 存储空间设备
        wx.setStorageSync('SpaceDevice', res.data)
        this.getDeviceData(res, spaceName)
      })
    } else {  // 全部设备
      // console.log('all')
      const queryAllDeviceList = shimaoModel.queryAllDeviceList(param)
      queryAllDeviceList.then(res => {
        this.hideLoading()
        // console.log('all-res: ', res)
        let deviceData = {
          data: []
        }
        let mainSwitchStatus = wx.getStorageSync('mainSwitch') || false
        let mainSwitch = {
          entityName: "总开关",
          entityId: -100,
          devSrc: "http://shimaoiot.oss-cn-shanghai.aliyuncs.com/image/jpeg/img_main switch@2x.png",
          yzsStatus: mainSwitchStatus ? 1 : 2
        }
        deviceData.data.unshift(mainSwitch)
        res.data.list.forEach(item => {
          if (item.isShow) {
            deviceData.data.push(item)
          }
        })
        console.log('deviceData: ', deviceData)
        // 存储空间设备
        wx.setStorageSync('SpaceDevice', deviceData.data)
        this.getDeviceData(deviceData, '全部')
      })
    }
  },

  // 获取设备信息 state状态, 给右区的数据, 插入图片, 过滤出开关状态
  getDeviceData(deviceList, spaceName) {
    if (deviceList.data) {
      deviceList.data.forEach(item => {
        if (item.attributesEntities) {
          if (item.iconUrl) {
            item.devSrc = JSON.parse(item.iconUrl)['hotel-appletIcon']
          }
          item.attributesEntities.forEach((childItem, cI) => {
            if (childItem.attributeCode == 'state') {
              item.yzsStatus = childItem.value == 'on' ? 1 : 2
            }
          })
        }
      })
      this.setData({
        spaceName,
        deviceData: deviceList.data
      })
    } else {
      wx.showToast({
        title: '暂无设备',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        spaceName,
        deviceData: []
      })
    }
  },

  refDevice() {
    this.getSpaceList(wx.getStorageSync('userInfo').roomSpaceId)
  },
})