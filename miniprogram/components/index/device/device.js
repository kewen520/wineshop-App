// components/index/device/device.js
import {
  showLoading,
  hideLoading,
  shimaoModel,
  toDetailPage
} from '../../../util/mixins.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    entityCode: {
      type: String
    },
    fromPage: {
      type: String
    },
    deviceDetailsData: {
      type: Object
    },
    isOn: {
      type: Number
    },
    entityId: { // 设备id
      type: Number
    },
    cnName: {
      type: String
    },
    enName: {
      type: String
    },
    deviceType: {
      type: String
    },
    devSrc: {
      type: String
    }
  },

  observers: {
    isOn(count) {
      // console.log('device-entityId: ', this.data.entityId)
      // console.log('device-isOn: ', count)
      if (count == 1) {
        this.setData({
          comIsOn: true
        })
      } else if(count == 2) {
        this.setData({
          comIsOn: false
        })
      }
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    comIsOn: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 开关
    disjunctor() {
      console.log('dev-this.data.entityId: ', this.data.entityId)
      if (this.data.entityId !== -100){   // 不是总开关
        const data = {
          attributesEntities: [{
            attributeCode: "state",
            value: !this.data.comIsOn ? 'on' : 'off'
          }],
          entityId: this.data.entityId,
          serviceCode: ""
        }
        const control = shimaoModel.control(data)
        control.then(res => {
          // console.log('disjunctor-res.retcode: ', res.retcode)
          if (!res.retcode) {
            console.log('refDevice')
            this.triggerEvent('refDevice')
          }
        })
      } else {  // 总开关
        let data = {
          spaceId: wx.getStorageSync('userInfo').roomSpaceId,
          touchOperate: wx.getStorageSync('mainSwitch')?1:0    // 0为总开，1为总关
        }
        console.log('mainSwitch-status: ', wx.getStorageSync('mainSwitch'))
        console.log('data: ', data)
        let spaceDeviceAllSwitch = shimaoModel.spaceDeviceAllSwitch(data)
        spaceDeviceAllSwitch.then(res => {
          console.log('res: ', res)
          if (res.retcode == 0) {
            if (wx.getStorageSync('mainSwitch')) {
              wx.setStorageSync('mainSwitch', false)
            } else {
              wx.setStorageSync('mainSwitch', true)
            }
          }
          this.triggerEvent('refDevice', { name: '总开关'})
        })
      }


    },
    toDetailPage,
    // 进入详情页
    toDerailDetails() {
      // console.log('toDerailDetails')
      // console.log('this.data.entityId: ', this.data.entityId)
      // console.log('this.data.deviceDetailsData.panType: ', this.data.deviceDetailsData.panType)
      if (this.data.isVisitor) {
        return
      }
      this.toDetailPage(this.data.deviceDetailsData.panType, this.data.entityId, this.data.entityCode)
    }
  }
})