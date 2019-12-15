import { HTTP } from '../util/cj.js'

export class AddUserModel extends HTTP {
  addUser(data, sCallback) {
    this.request({
      url: 'addFamilyMember',
      method: 'post',
      data,
      success(res) {
        sCallback(res)
      }
    })
  }
}