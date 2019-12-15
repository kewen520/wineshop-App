import { HTTP } from '../util/http-mall.js'
import {
  config
} from '../config.js'

export class MallModel extends HTTP {
  // 小程序生成订单
  placeOrder(data, header) {
    return this.request({
      url: 'app/ewei_shopv2_api.php?i=2&r=order.complete',
      method: 'POST',
      data,
      header
    })
  }

  // 商品详情
  getDetail(data, header) {
    return this.request({
      url: 'app/ewei_shopv2_api.php?i=2&r=goods.get_detail',
      method: 'POST',
      data,
      header
    })
  }
  
}

