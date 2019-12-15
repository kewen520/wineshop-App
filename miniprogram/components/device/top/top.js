// components/device/top/top.js
import { showLoading, hideLoading, shimaoModel, getDeviceList, disjunctor, toDetailPage } from '../../../util/mixins.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    preOrNextData: {
      type: Object
    },
    cnTit: {
      type: String
    },
    enTit: {
      type: String
    }
  },

  observers: {
    ['preOrNextData.preEntityId'](count) {
      console.log('preEntityId: ', count == undefined)
      if (count == undefined) {
        console.log('start')
        this.setData({
          topStart: 1
        })
      }
      console.log('start: ', this.data.start)
    },
    ['preOrNextData.nextEntityId'](count) {
      console.log('nextEntityId: ', count == undefined)
      if (count == undefined) {
        console.log('end')
        this.setData({
          topEnd: 1
        })
      }
      console.log('end: ', this.data.end)
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    topStart: 0,
    topEnd: 0
  },

  lifetimes: {
    ready() {
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    jumpPame(e) {
      console.log('e: ', e)
      let entityId = e.currentTarget.dataset.entityid
      let panType = e.currentTarget.dataset.pantype
      console.log('entityId: ', entityId)
      console.log('panType: ', panType)
      toDetailPage(panType, entityId)
      
    }
  }
})
