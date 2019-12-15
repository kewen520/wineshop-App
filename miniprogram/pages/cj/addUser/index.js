// https://blog.csdn.net/jackjia2015/article/details/86506647
import {
  AddUserModel
} from '../../../models/addUser.js'

let addUserModel = new AddUserModel()

Page({
  data: {
    userName: '',
    show: false,
    disabled: false,
    src: '',
    udid: ''
  },
  //创建相机
  onLoad() {
    this.ctx = wx.createCameraContext()
    let udid = wx.getStorageSync('udid')
    this.setData({
      udid
    })

  },
  //输入框
  onChange(event) {
    console.log('event.detail: ', event.detail)
    let userName = event.detail
    this.setData({
      userName
    })
  },
  //拍照
  takePhoto() {
    console.log('this.data.userName', this.data.userName)    
    
    if (this.data.userName.replace(/(^s*)|(s*$)/g, "").length == 0) {
      console.log('kg')
      wx.showToast({
        title: '请输入用户名',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }    

    this.setData({
      show: true,
      disabled: true
    })

    let _this = this
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })


        wx.uploadFile({
          url: 'https://route.igaicloud.cn/house/wx/mini/fileUpload', //仅为示例，非真实的接口地址
          filePath: res.tempImagePath,
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data" //记得设置
          },
          success(res) {
            let result = JSON.parse(res.data)
            let avatarUrl = result.data.url
            console.log('上传图片 - result: ', result);
            if (result.status == 0) {
              console.log('上传图片后 - addUserModel.addUser-udid: ', _this.data.udid)
              addUserModel.addUser({
                name: _this.data.userName,
                udid: _this.data.udid,
                faceImg: avatarUrl
              }, (res) => {
                console.log('新增用户后-res: ', res)
                let url = '/pages/cj/result/index'
                if (res.status != 0){
                  url = url + '?message=' + res.message
                }
                wx.redirectTo({
                  url,
                })
              })
            }
          }
        })

      }
    })
  },
  // 开始录像
  startRecord() {
    this.ctx.startRecord({
      success: (res) => {
        console.log('startRecord')
      }
    })
  },
  //结束录像
  stopRecord() {
    this.ctx.stopRecord({
      success: (res) => {
        this.setData({
          src: res.tempThumbPath,
          videoSrc: res.tempVideoPath
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  }
})