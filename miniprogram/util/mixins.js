import {
  ShimaoModel
} from '../models/shimao.js'

import {
  MallModel
} from '../models/mall.js'

const shimaoModel = new ShimaoModel()
const mallModel = new MallModel()
const mode = [{
  name: '明亮模式',
  src: 'https://ym-smartspace.yunzhisheng.cn:8088/hotel/icon_bright_mode@2x.png'
}, {
    name: '浪漫模式',
    src: 'https://ym-smartspace.yunzhisheng.cn:8088/hotel/icon_romantic_mode@2x.png'
  }, {
    name: '睡眠模式',
    src: 'https://ym-smartspace.yunzhisheng.cn:8088/hotel/icon_sleeping_mode@2x.png'
  }, {
    name: '观影模式',
    src: 'https://ym-smartspace.yunzhisheng.cn:8088/hotel/icon_watching_mode@2x.png'
  }, {
    name: '阅读模式',
    src: 'https://ym-smartspace.yunzhisheng.cn:8088/hotel/icon_reading_mode@2x.png'
  }]

let spaceRoom = [{
  name: '客厅',
  src: 'https://ym-smartspace.yunzhisheng.cn:8088/hotel/icon_living-room_unselected.svg'
}, {
    name: '房间',
    src: 'https://ym-smartspace.yunzhisheng.cn:8088/hotel/icon_bedroom_unselected.svg'
  }, {
    name: '主卧',
    src: 'https://ym-smartspace.yunzhisheng.cn:8088/hotel/icon_bedroom_unselected.svg'
  }, {
    name: '卧室',
    src: 'https://ym-smartspace.yunzhisheng.cn:8088/hotel/icon_bedroom_unselected.svg'
  }, {
    name: '次卧',
    src: 'https://ym-smartspace.yunzhisheng.cn:8088/hotel/icon_bedroom_unselected.svg'
  }, {
    name: '餐厅',
    src: 'https://ym-smartspace.yunzhisheng.cn:8088/hotel/icon_living-room.svg'
  }, {
    name: '餐吧',
    src: 'https://ym-smartspace.yunzhisheng.cn:8088/hotel/icon_living-room.svg'
  }, {
    name: '浴室',
    src: 'https://ym-smartspace.yunzhisheng.cn:8088/hotel/icon_bathroom_unselected.svg'
  }]

let showLoading = () => {
  wx.showLoading({
    title: '加载中',
  })
}

let hideLoading = () => {
  wx.hideLoading()
}

let setStorageSyncMemberDetail = () => {
  const data = {}
  const getMemberDetail = shimaoModel.getMemberDetail(data)
  getMemberDetail.then(res => {
    console.log('getUserInfo-res.data: ', res.data)
    wx.setStorageSync('memberDetail', res.data)
  })
}

let getDeviceList = (pageFrom) => {
  showLoading()
  let param = {}
  let deviceRoomList = ''
  // 如果首页
  if (wx.getStorageSync('SpaceInfo').SpaceName == 'home') {
    param = {
      hotelId: wx.getStorageSync('userInfo').hotelId,
      spaceId: wx.getStorageSync('userInfo').roomSpaceId
    }
    deviceRoomList = shimaoModel.deviceRoomList(param)
  } else if (wx.getStorageSync('SpaceInfo').SpaceName == 'all') {
    console.log('mixin-all')
    let param = {
      spaceId: wx.getStorageSync('userInfo').roomSpaceId
    }
    deviceRoomList = shimaoModel.queryAllDeviceList(param)
  } else if (wx.getStorageSync('SpaceInfo').SpaceName == 'childrenSpace') {
    let param = {
      spaceId: wx.getStorageSync('SpaceInfo').SpaceId
    }
    deviceRoomList = shimaoModel.queryDeviceListBySpaceId(param)
  }
  return new Promise((resolve, reject) => {
    deviceRoomList.then(res => {
      console.log('deviceRoomList: ', res)
      hideLoading()
      if (res.retcode == 0) {
        let list = ''
        if (wx.getStorageSync('SpaceInfo').SpaceName == 'all') {
          list = res.data.list
        } else {
          list = res.data
        }
        console.log('list: ', list)
        resolve(list)
      } else {
        reject(res)
      }
    })
  })

}

// 开关
let disjunctor = (entityId, status) => {
  const data = {
    attributesEntities: [{
      attributeCode: "state",
      value: !status ? 'on' : 'off'
    }],
    entityId: entityId,
    serviceCode: ""
  }
  const control = shimaoModel.control(data)
  control.then(res => {
    console.log('disjunctor-res.retcode: ', res.retcode)
    if (!res.retcode) {
      wx.showToast({
        title: `修改成功 - ${status}`,
        icon: 'none',
        duration: 2000
      })
    }
  })
}


// 用于获取详情页上下页设备信息
let getPreOrNextData = (deviceData, entityId) => {
  let preOrNextData = {}
  deviceData.forEach((item, i) => {
    if (item.entityId == entityId) {
      preOrNextData.isStart = true
      preOrNextData.isEnd = true
      console.log('i: ', i)
      if (i > 0) {
        preOrNextData.isStart = false
        preOrNextData.preEntityId = deviceData[i - 1].entityId
        preOrNextData.prePanType = deviceData[i - 1].panType
      }
      if (i < deviceData.length - 1) {
        preOrNextData.isEnd = false
        preOrNextData.nextEntityId = deviceData[i + 1].entityId
        preOrNextData.nextPanType = deviceData[i + 1].panType
      }
    }
  })

  return preOrNextData

}

let toDetailPage = (panType, entityId, entityCode) => {
  if (panType == 'light') {
    wx.navigateTo({
      url: '/pages/device/corridorLamp/corridorLamp?entityId=' + entityId,
    })
  } else if (panType == 'curtain') {
    wx.navigateTo({
      url: '/pages/device/curtain/curtain?entityId=' + entityId,
    })
  } else if (panType == 'air-c') {
    wx.navigateTo({
      url: '/pages/device/airConditioning/airConditioning?entityId=' + entityId,
    })
  } else if (panType == 'lock') {
    wx.navigateTo({
      url: '/pages/device/doorLock/doorLock?entityId=' + entityId + '&entityCode=' + entityCode,
    })
  } else {
    // wx.showToast({
    //   title: '暂无此设备详情页',
    //   icon: 'none',
    //   duration: 2000
    // })
  }
}

let initDeviceDetails = (spaceDevice, entityId, wxThis) => {
  wxThis.setData({
    deviceData: spaceDevice,
    entityId: entityId,
    preOrNextData: getPreOrNextData(spaceDevice, entityId)
  })
}

export {
  showLoading,
  hideLoading,
  setStorageSyncMemberDetail,
  shimaoModel,
  mallModel,
  getDeviceList,
  disjunctor,
  getPreOrNextData,
  toDetailPage,
  initDeviceDetails,
  mode,
  spaceRoom
}