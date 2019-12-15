// components/resultStatus/success/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status: {
      type: Boolean,
      observer(newVal, oldVal, changedPath) {
        // console.log('newVal: ', newVal)
        if(!newVal) {
          this.setData({
            message: '录入失败，请重试'
          })
        }        
      }
    },
    udid: {type: String},
  },

  /**
   * 组件的初始数据
   */
  data: {
    message: '录入成功'
  },

  /**
   * 组件生命周期
   */
  attached() {
    console.log('status-res: ', this.data.status)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    submit() {
      let url = '/pages/cj/addUser/index'
      console.log('url: ', url)
      // return
      wx.redirectTo({
        url
      })
    },
    cg() {
      let url = '/pages/cj/userList/index'
      console.log('url: ', url)
      // return
      wx.redirectTo({
        url
      })
    }
  }
})
