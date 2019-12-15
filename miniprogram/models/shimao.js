import { HTTP } from '../util/http-p.js'
import {
  config
} from '../config.js'

export class ShimaoModel extends HTTP {
  getHomeList() {
    return this.request({
      url: '/member/app/homeList',
      method: 'POST'
    })
  }
  //https://pre-api.shimaoiot.com/member/weixinCodeLogin
  weixinCodeLogin(data, header) {
    return this.request({
      url: 'member/weixinCodeLogin',
      method: 'POST',
      data,
      header
    })
  }

  // /member/weixinRegister
  weixinRegister(data, header) {
    return this.request({
      url: 'member/weixinRegister',
      method: 'POST',
      data,
      header
    })
  }

  // /member/getMemberDetail 用户信息
  getMemberDetail(data) {
    return this.request({
      url: 'member/getMemberDetail',
      method: 'POST',
      data
    })
  }

  // /member/updateMemberInfo修改用户信息
  updateMemberInfo(data) {
    return this.request({
      url: 'member/updateMemberInfo',
      method: 'POST',
      data
    })
  }

  // /api/app/hotel/addFeedback  新增反馈信息
  addFeedback(data) {
    return this.request({
      url: 'api/app/hotel/addFeedback',
      method: 'POST',
      data
    })
  }

  // /api/app/hotel/feedback  查询反馈信息
  feedback(data) {
    return this.request({
      url: 'api/app/hotel/feedback',
      method: 'POST',
      data
    })
  } 

  // /device/queryDeviceListBySpaceId  首页设备列表
  queryDeviceListBySpaceId(data) {
    return this.request({
      url: 'device/queryDeviceListBySpaceId',
      method: 'POST',
      data
    })
  } 
  // https://pre-api.shimaoiot.com/device/control
  control(data) {
    return this.request({
      url: 'device/control',
      method: 'POST',
      data
    })
  }

  // /api/strategy/selectPageStrategyBySpaceId
  getStrategy(data) {
    return this.request({
      url: 'api/strategy/selectPageStrategyBySpaceId',
      method: 'POST',
      data
    })
  }

  // /api/strategy/runNowStrategy
  runNowStrategy(data) {
    return this.request({
      url: 'api/strategy/runNowStrategy',
      method: 'POST',
      data
    })
  }

  // /api/app/hotel/userInfo
  userInfo(data) {
    return this.request({
      url: 'api/app/hotel/userInfo',
      method: 'POST',
      data
    })
  }

  // /api/app/home/spaceList
  spaceList(data) {
    return this.request({
      url: 'api/app/home/spaceList',
      method: 'POST',
      data
    })
  }

  // /api/app/hotel/deviceRoomList
  deviceRoomList(data) {
    return this.request({
      url: 'api/app/hotel/deviceRoomList',
      method: 'POST',
      data
    })
  }

  // /api/app/hotel/applet/welcomes-bg
  bannerTop(data) {
    return this.request({
      url: 'api/app/hotel/applet/welcomes-bg',
      method: 'POST',
      data
    })
  }

  // /api/app/hotel/applet/guest-needs
  guestNeeds(data) {
    return this.request({
      url: 'api/app/hotel/applet/guest-needs',
      method: 'POST',
      data
    })
  }

  // https://pre-api.shimaoiot.com/message/queryMessageByUser
  queryMessageByUser(data) {
    return this.request({
      url: 'message/queryMessageByUser',
      method: 'POST',
      data
    })
  }

  // lock/saveLockLogData
  saveLockLogData(data) {
    return this.request({
      url: 'lock/saveLockLogData',
      method: 'POST',
      data
    })
  }

  // lock/getOpenLog
  getOpenLog(data) {
    return this.request({
      url: 'lock/getOpenLog',
      method: 'POST',
      data
    })
  }

  // 总开关 /api/app/hotel/applet/spaceDeviceAllSwitch
  spaceDeviceAllSwitch(data) {
    return this.request({
      url: 'api/app/hotel/applet/spaceDeviceAllSwitch',
      method: 'POST',
      data
    })
  }

  // /device/queryAllDeviceList
  queryAllDeviceList(data) {
    return this.request({
      url: 'device/queryAllDeviceList',
      method: 'POST',
      data
    })
  }

  getShopList(data) {
    return this.request({
      url: `${config.shop_url}`,
      method: 'GET',
      data
    })
  }
  
}

