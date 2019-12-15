// miniprogram/pages/device/airConditioning/airConditioning.js
import { showLoading, hideLoading, shimaoModel, getDeviceList, disjunctor, getPreOrNextData } from '../../../util/mixins.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOn: true,
    mode: 0,  // 模式
    modeName: '', // 模式名
    speed: 0, // 速度
    direction: 0, // 风向
    isHasDirection: false,
    entityId: '',
    deviceDetailsData: '',
    level: '',
    deviceData: [],
    temperatureNum: 0,   // 温度
    preOrNextData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      entityId: options.entityId
    })
    console.log('options: ', options)
    this.refData()

    console.log('preOrNextData: ', this.data.preOrNextData)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.refData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  disjunctor() {
    this.setData({
      isOn: !this.data.isOn
    })
  },
  selectMode(data) {
    console.log('data: ', data)
    const { style } = data.currentTarget.dataset  // 模式类型
    console.log('style: ', style)
    const { index } = data.detail     // 该类型中第几个
    console.log('index: ', index)
    let param = {}
    let msg = ''
    if (style == 0) {
      let value = ['cool', 'hot', 'air', 'auto']
      let msgArr = ['制冷模式', '制热模式', '送风模式', '自动模式', '除湿模式']
      msg = msgArr[index]
      param = {
        attributesEntities: [{
          attributeCode: "mode",
          value: value[index]
        }],
        entityId: this.data.entityId,
        serviceCode: ""
      }
    }

    if (style == 1) {
      let value = ['low', 'mid', 'high', 'auto']
      let msgArr = ['低速风', '中速风', '高速风', '自动风速']
      msg = msgArr[index]
      param = {
        attributesEntities: [{
          attributeCode: "fanSpeed",
          value: value[index]
        }],
        entityId: this.data.entityId,
        serviceCode: ""
      }
    }

    if (style == 2) {
      let value = ['leftRightWind', 'upDownWind']
      let msgArr = ['上下扫风', '左右扫风']
      param = {
        attributesEntities: [{
          attributeCode: value[index],
          value: 'on'
        }],
        entityId: this.data.entityId,
        serviceCode: ""
      }
    }


    const control = shimaoModel.control(param)
    control.then(res => {
      console.log('disjunctor-res.retcode: ', res.retcode)
      if (!res.retcode) {
        this.refData(msg, 'mode')
      }
    })
  },
  // 温度控制
  temperatureCon(e) {
    let temperatureNum = e.currentTarget.dataset.num
    let trim = e.currentTarget.dataset.trim
    let param = {}
    if (this.data.isOn) {
      if (trim == "add") {
        if (this.data.temperatureNum) {
          let temperatureNum = this.data.temperatureNum
          console.log('temperatureNum: ', temperatureNum)
          if (temperatureNum < 18) {
            temperatureNum = 17
          }
          param = {
            attributesEntities: [{
              attributeCode: "temperature",
              value: ++temperatureNum
            }],
            entityId: this.data.entityId,
            serviceCode: ""
          }
        } else {
          return
        }
      }
      if (trim == "sub") {
        if (this.data.temperatureNum) {
          let temperatureNum = this.data.temperatureNum
          if (temperatureNum>30) {
            temperatureNum = 31
          }
          param = {
            attributesEntities: [{
              attributeCode: "temperature",
              value: --temperatureNum
            }],
            entityId: this.data.entityId,
            serviceCode: ""
          }
        } else {
          return
        }
      }
      if (!trim) {
        if (temperatureNum + 18 == this.data.temperatureNum*1){
          return
        }
        param = {
          attributesEntities: [{
            attributeCode: "temperature",
            value: temperatureNum + 18
          }],
          entityId: this.data.entityId,
          serviceCode: ""
        }
      }
    } else {
      return
    }

    const control = shimaoModel.control(param)
    control.then(res => {
      console.log('disjunctor-res.retcode: ', res.retcode)
      if (!res.retcode) {
        this.refData()
        wx.showToast({
          title: `修改成功`,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  getDeviceList,
  refData(n, type) {
    
    this.getDeviceList().then(res => {
      console.log('deviceData: ', res)
      this.setData({
        deviceData: res,
        entityId: this.data.entityId
      })
      this.getDeviceDetailsData(res, this.data.entityId)
      this.setData({
        preOrNextData: this.getPreOrNextData(res, this.data.entityId)
      })
      if (type) {
        wx.showToast({
          title: `已切换为${n}`,
          icon: 'none',
          duration: 2000
        })
      }else{
        if (n) {
          wx.showToast({
            title: `${n}${this.data.isOn ? '已开启' : '已关闭'}`,
            icon: 'none',
            duration: 2000
          })
        }
      }
    }).catch((e) => {
      console.log('e: ', e)
    })
  },
  getPreOrNextData,
  // 获得设备详情
  getDeviceDetailsData(list, entityId) {
    list.forEach(item => {
      // 数据中找出本设备
      if (item.entityId == entityId) {
        // console.log('deviceDetailsData: ', item)
        if (item.attributesEntities.length > 1) {
          item.attributesEntities.forEach(o => {
            // console.log('o: ', o)
            if (o.attributeCode == 'state') {
              let isOn = o.value == 'on' ? true : false
              this.setData({
                isOn
              })
            }
            // 温度
            if (o.attributeCode == 'temperature') {
              this.setData({
                temperatureNum: o.value
              })
            }
            // 模式
            if (o.attributeCode == 'mode') {
              if (o.value == 'cool') {
                this.setData({
                  mode: 0,
                  modeName: 'Cool'
                })
              } else if (o.value == 'hot') {
                this.setData({
                  mode: 1,
                  modeName: 'Hot'
                })
              } else if (o.value == 'air') {
                this.setData({
                  mode: 2,
                  modeName: 'Fan'
                })
              } else if (o.value == 'auto') {
                this.setData({
                  mode: 3,
                  modeName: 'Auto'
                })
              }
            }
            // 风速
            if (o.attributeCode == 'fanSpeed') {
              this.setData({
                speed: o.value
              })

              if (o.value == 'low') {
                this.setData({
                  speed: 0
                })
              } else if (o.value == 'mid') {
                this.setData({
                  speed: 1
                })
              } else if (o.value == 'high') {
                this.setData({
                  speed: 2
                })
              } else if (o.value == 'auto') {
                this.setData({
                  speed: 3
                })
              }
            }
            // 风向左右
            if (o.attributeCode == 'leftRightWind') {
              this.setData({
                direction: o.value == 'on' ? 1 : 10,
                isHasDirection: true
              })
            }
            // 风向上下
            if (o.attributeCode == 'upDownWind') {
              this.setData({
                direction: o.value == 'on' ? 0 : 10,
                isHasDirection: true
              })
            }
          })
        } else {
          if (o[0].attributeCode == 'state') {
            let isOn = o.value == 'on' ? true : false
            this.setData({
              isOn
            })
          }
          this.setData({
            temperature: 'false'
          })
        }
        this.setData({
          deviceDetailsData: item
        })
      }
    })
  },
  disjunctor() {
    const data = {
      attributesEntities: [{
        attributeCode: "state",
        value: !this.data.isOn ? 'on' : 'off'
      }],
      entityId: this.data.entityId,
      serviceCode: ""
    }
    const control = shimaoModel.control(data)
    control.then(res => {
      console.log('disjunctor-res.retcode: ', res.retcode)
      if (!res.retcode) {
        this.refData(this.data.deviceDetailsData.entityName)        
      }
    })
  }
})