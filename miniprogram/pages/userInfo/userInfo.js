// miniprogram/pages/userInfo/userInfo.js
import { showLoading, hideLoading } from '../../util/mixins.js'
import {
  ShimaoModel
} from '../../models/shimao.js'

import {
  config
} from '../../config.js'

const shimaoModel = new ShimaoModel()
let updateData = {}
Page({

  showLoading,
  hideLoading,
  /**
   * 页面的初始数据
   */
  data: {
    avatar: '',
    name: '',
    gender: 1,
    birthday: '2018-12-25',
    region: "湖北省,黄石市,阳新县",
    showName: false,
    genderPicker: ['男', '女'],
    nameVla: ''    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfoData()
    // console.log('area.province_list: ', typeof area.province_list)
    // this.setData({
    //   areaList: area.province_list
    // })
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

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
  // 打开图库
  chooseImg() {
    let _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log('tempFilePaths: ', tempFilePaths)
        wx.uploadFile({
          url: `${config.shimao_url}api/fastDFS/upload`, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data", //记得设置
            token: wx.getStorageSync('token')
          },
          success(res) {
            console.log('chooseImg-res: ', res)
            if (!res.data.retcode) {
              console.log('chooseImg-res.data: ', JSON.parse(res.data).data)
              // return
              updateData.avatar = JSON.parse(res.data).data
              _this.updateMemInfo()
            }
            
          }
        })
      }
    })
  },
  showNamePopup() {
    this.setData({
      showName: true
    })
  },
  // 弹窗用户名改变
  onChangeNameVal(e) {
    console.log('e: ', e.detail)
    this.setData({
      nameVal: e.detail
    })
  },
  // 点击用户名弹窗确定
  editUserName() {
    console.log('nameVal: ', this.data.nameVal)
    if (this.data.nameVal == '') {
      wx.showToast({
        title: '用户名不能为空！',
        icon: 'none',
        duration: 2000
      })
    } else {
      updateData.relaname = this.data.nameVal
      this.updateMemInfo()
      this.clearNameVal()
    }    
  },
  // 取消用户名弹窗
  onCloseName() {
    // this.clearNameVal()
  },
  // 生日弹窗改变
  DirthdayChange(e) {
    console.log('e: ', e)
    const birthday = new Date(e.detail.value)
    console.log('birthday: ', birthday)
    updateData.birthday = birthday
    this.updateMemInfo()
  },
  // 地区弹窗改变
  RegionChange: function (e) {
    console.log('e: ', e)
    updateData.residence = e.detail.value.join(",")
    this.updateMemInfo()
  },
  clearNameVal() {
    this.setData({
      nameVal: ''
    })
  },
  PickerChange(e) {
    console.log('PickerChange - e: ', e)
    updateData.sex = parseInt(e.detail.value) + 1
    this.updateMemInfo()
  },
  getUserInfoData() {
    const data = {}
    const getMemberDetail = shimaoModel.getMemberDetail(data)
    this.showLoading()
    getMemberDetail.then(res => {
      console.log('getUserInfoData-res: ', res)
      if (!res.retcode) {
        this.hideLoading()
        wx.setStorageSync('memberDetail', res.data)
        let birthday = ''
        if (res.data.birthday){
          birthday = res.data.birthday.toLocaleString().substr(0, 10)
        }
        this.setData({
          avatar: res.data.avatar,
          name: res.data.relaname,
          gender: res.data.sex,
          birthday: birthday || '未知',
          region: res.data.residence || '未知',
          wechat: res.data.wechat,
          mobile: res.data.mobile
        })
      }
    })
  },
  // 获取会员信息
  updateMemInfo() {
    const updateMemberInfo = shimaoModel.updateMemberInfo(updateData)
    const _this = this
    updateMemberInfo.then(res => {
      console.log('updateMemberInfo-res: ', res)
      if (!res.retcode) {
        wx.showToast({
          title: '修改成功',
          icon: 'none',
          duration: 2000
        })
        _this.getUserInfoData()
      }
    })
  }
})