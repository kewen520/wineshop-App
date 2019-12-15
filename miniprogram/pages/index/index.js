// miniprogram/pages/index/index.js
import { showLoading, hideLoading, shimaoModel, mode } from '../../util/mixins.js'
import Dialog from '../../dist/dialog/dialog'
import {
  config
} from '../../config.js'

Page({

  showLoading,
  hideLoading,

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    swiperCurrent: 0,
    viewPageNum: 0,
    userInfo: {},
    strategyList: [],
    bannerTop: [],
    deviceId: 518,
    isVisitor: false,
    modelImg: config.modelImg,
    deviceImg: config.deviceImg,
    deviceData: [],
    swiperImgUrls: [{
      url: 'https://ym-smartspace.yunzhisheng.cn:8088/hotel/img_no-disturbing.png'
    }, {
        url: 'https://ym-smartspace.yunzhisheng.cn:8088/hotel/img_room-cleaning.png'
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log('onload')
    // console.log('token： ', !!wx.getStorageSync('token'))
    if (wx.getStorageSync('token')){
      // console.log('fyk')
      this.getUserInfo()
    } else {
      this.visitorInit()
    }
    // console.log('config.modelImg: ', config.modelImg)
  },
  // 游客数据初始化
  visitorInit() {
    // console.log('n')
    this.visitorGetBannerTop()
    this.visitorGetDeviceList()
    this.visitorGetStrategyData()
    this.setData({
      isVisitor: true
    })
  },
  // 游客banner
  visitorGetBannerTop() {
    let data = {
      hotelId: 'cda49783d8f24561aa8abfd42d5c4edf'
    }
    let header = {
      'content-type': 'application/json',
      token: config.visitorToken
    }
    let _this = this
    wx.request({
      url: `${config.shimao_url}api/app/hotel/applet/welcomes-bg`,
      data,
      header: header,
      method: 'POST',
      success: function (res) {
        // console.log('visitorGetBannerTop: ', res.data.data)
        _this.setData({
          bannerTop: res.data.data
        })
      }
    })
  },
  // 游客设备
  visitorGetDeviceList() {
    let data = {
      hotelId: config.visitorHotelId,
      spaceId: config.visitorSpaceId
    }
    let header = {
      'content-type': 'application/json',
      token: config.visitorToken
    }
    let _this = this
    wx.request({
      url: `${config.shimao_url}api/app/hotel/deviceRoomList`,
      data,
      header: header,
      method: 'POST',
      success: function (res) {
        // console.log('visitorGetDeviceList: ', res.data.data)
        let list = res.data.data
        let pages = []
        if (list) {
          list.forEach((item, i) => {
            if (item.attributesEntities) {
              if (item.iconUrl) {
                item.devSrc = JSON.parse(item.iconUrl)['hotel-appletIcon']
              }
              item.yzsStatus = 0
              item.attributesEntities.forEach((childItem, cI) => {
                if (childItem.attributeCode == 'state') {
                  item.yzsStatus = childItem.value == 'on' ? 1 : 2  // 1为真，2为假
                }
              })
            }
            const page = Math.floor(i / 6)
            if (!pages[page]) {
              pages[page] = []
            }
            pages[page].push(item)
          })
        }
        // console.log(pages)
        _this.setData({
          deviceData: pages
        })
      }
    })
  },
  // 游客模式
  visitorGetStrategyData() {
    let data = {
      spaceId: config.visitorSpaceId
    }
    let header = {
      'content-type': 'application/json',
      token: config.visitorToken
    }
    let _this = this
    wx.request({
      url: `${config.shimao_url}api/strategy/selectPageStrategyBySpaceId`,
      data,
      header: header,
      method: 'POST',
      success: function (res) {
        // console.log('visitorGetBannerTop: ', res.data.data)
        _this.setData({
          strategyList: res.data.data.list,
          viewPageNum: res.data.data.list.length * 64
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
    if (wx.getStorageSync('userInfo')) {
      this.refDevice()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    if (wx.getStorageSync('token')) {
      this.refDevice()
    }
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
    this._pullDown()
  },
  _pullDown() {
    if (!wx.getStorageSync('userInfo')) {
      this.onTip()
    }
    wx.stopPullDownRefresh()
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

  // 获取设备列表
  getDeviceList() {
    this.showLoading()
    let mainSwitchStatus = wx.getStorageSync('mainSwitch')
    // console.log('mainSwitchStatus: ', mainSwitchStatus == '')
    // console.log('kv', wx.getStorageSync('kv') == '')
    const data = {
      hotelId: wx.getStorageSync('userInfo').hotelId,
      spaceId: wx.getStorageSync('userInfo').roomSpaceId
    }
    const deviceRoomList = shimaoModel.deviceRoomList(data)
    deviceRoomList.then(res => {
      this.hideLoading()
      if (!res || !res.data) {
        return
      }
      let list = res.data
      console.log('getDeviceList - list: ', list)
      let mainSwitch = {
        entityName: "总开关",
        entityId: -100,
        devSrc: "http://shimaoiot.oss-cn-shanghai.aliyuncs.com/image/jpeg/img_main switch@2x.png",
        yzsStatus: mainSwitchStatus?1:2
      }
      list.unshift(mainSwitch)
      let SpaceInfo = {
        SpaceName: 'all'
      }
      // 缓存空间设备
      wx.setStorageSync('SpaceInfo', SpaceInfo)
      const pages = []
      if (list) {
        list.forEach((item, i) => {
          if (item.attributesEntities) {
            if (item.iconUrl) {
              item.devSrc = JSON.parse(item.iconUrl)['hotel-appletIcon']
            }
            item.yzsStatus = 0
            item.attributesEntities.forEach((childItem, cI) => {
              if (childItem.attributeCode == 'state') {
                item.yzsStatus = childItem.value == 'on' ? 1 : 2
              }
            })
          }
          const page = Math.floor(i / 6)
          if (!pages[page]) {
            pages[page] = []
          }
          pages[page].push(item)
        })
      } else {
        wx.showToast({
          title: '暂无设备',
          icon: 'none',
          duration: 2000
        })
      }
      // console.log(pages)
      this.setData({
        deviceData: pages
      })
      return pages
    })
  },
  // 获取用户信息
  getUserInfo() {
    const data = {}
    let userInfo = shimaoModel.userInfo(data)
    userInfo.then(res => {
      // console.log('getUserInfo-res: ', res)
      if (!res.retcode) {
        if (res.data){
          // console.log('userInfo: ', res.data)
          this.setData({
            userInfo: res.data
          })
          wx.setStorageSync('userInfo', res.data)
          this.getDeviceList()
          this.getStrategyData()
          this.visitorGetBannerTop()
        } else {
          wx.removeStorageSync('userInfo')
          this.visitorInit()
        }
      }
    })
  },
  // 获取模式数据
  getStrategyData() {
    const data = {
      "spaceId": 613
    }
    const getStrategy = shimaoModel.getStrategy(data)
    getStrategy.then(res => {
      // console.log('getStrategy-res: ', res)
      // 查出已生效的
      let strategyList = []
      res.data.list.forEach((item, i) => {
        item.src = mode[0].src
        if (item.status == 0) {
          // console.log('mode: ', mode)
          mode.forEach(o => {
            if (o.name == item.name) {
              // console.log('1')
              item.src = o.src
            }
          })
          // console.log('item.src: ', item.src)
          strategyList.push(item)
        }
      })
      // console.log('strategyList-1: ', strategyList)
      this.setData({
        strategyList,
        viewPageNum: strategyList.length * 64
      })
    })
  },
  // 游客弹窗
  onTip() {
    Dialog.alert({
      message: '抱歉！暂未匹配到您的入住信息'
    }).then(() => {
      // on close
    });
  },
  refDevice(d) {
    this.getDeviceList()    
  },
  // 启用模式
  runStrategy(e) {
    const strategyId = e.currentTarget.dataset.id
    const strategyName = e.currentTarget.dataset.name
    const data = {
      strategyId
    }
    const runNowStrategy = shimaoModel.runNowStrategy(data)
    runNowStrategy.then(res => {
      // console.log('res: ', res)
      if (!res.retcode) {
        wx.showToast({
          title: `${strategyName}已开启`,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 头部轮播
  getBannerTop() {
    let data = {
      hotelId: wx.getStorageSync('userInfo').hotelId
    }
    let bannerTop = shimaoModel.bannerTop(data)
    bannerTop.then(res => {
      // console.log('bannerTop-res: ', res)
      this.setData({
        bannerTop: res.data
      })
    })
  },
  swiperChange: function (e) {
    // console.log('e.detail.current: ', e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //轮播图点击事件
  swipclick: function (e) {
    // console.log(this.data.swiperCurrent)
    // return
    let data = {
      hotelId: wx.getStorageSync('userInfo').hotelId,
      roomNum: wx.getStorageSync('userInfo').roomNum,
      state: 0
    }
    if (this.data.swiperCurrent == 0){      
      data.type = 0
    } else {
      data.type = 1
    }
    let guestNeeds = shimaoModel.guestNeeds(data)
    guestNeeds.then(res => {
      // console.log('res: ', res)
      if(!res.retcode) {
        if (this.data.swiperCurrent == 0) {
          wx.showToast({
            title: `勿扰模式已开启`,
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: `清扫模式已开启`,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
})