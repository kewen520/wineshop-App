// pages/my/cell/cell.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    img: {
      type: String
    },
    describe: {
      type: String
    },
    iconType: {
      type: Number
    },
    title: {
      type: String
    },
    arrow: {
      type: Boolean,
      value: false
    }
  },

  observers: {
    iconType(data) {
      console.log('data: ', data)
      this.setData({
        iconSrc: this.data.icon[data-1]
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    icon: [
      'icon_face_recognition@2x.png',
      'icon_message@2x.png',
      'icon_message@2x(1).png',
      '/icon_feedback@2x.png'
    ],
    iconSrc: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
