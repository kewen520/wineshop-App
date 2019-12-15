// components/device/progress-bar/progress-bar.js
import { showLoading, hideLoading, shimaoModel } from '../../../util/mixins.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    controlType: {
      type: String
    },
    entityId: {
      type: Number
    },
    isOn: {
      type: Boolean,
      value: false
    },
    isVal: {
      type: Boolean,
      value: true
    },
    val: {
      type: Number,
      value: 0
    },
    leftImg: {
      type: String,
      value: ''
    },
    rightImg: {
      type: String,
      value: ''
    }
  },

  observers: {
    val(count) {
      this.setData({
        comVal: count
      })
    },
    isOn(count) {
      if (!count) {
        console.log('pro-count: ', count)
        setTimeout(()=>{
          this.setData({
            comVal: '__'
          })
        }, 100)
        
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    comVal: 0
  },

  lifetimes: {
    ready() {
      
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      this.setData({
        comVal: event.detail
      })
      let param = {
        attributesEntities: [{
          attributeCode: this.data.controlType,
          value: event.detail
        }],
        entityId: this.data.entityId,
        serviceCode: ""
      }

      const control = shimaoModel.control(param)
      control.then(res => {
        console.log('disjunctor-res.retcode: ', res.retcode)
        if (!res.retcode) {
          this.triggerEvent('refData')
          wx.showToast({
            title: `修改成功`,
            icon: 'none',
            duration: 2000
          })
        }
      })
      
    }
  }
})
