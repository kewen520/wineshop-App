import {
  HTTP
} from '../util/http-mall.js'
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

  // 商品列表
  getShopList(data) {
    return this.request({
      url: 'app/ewei_shopv2_api.php?i=2&r=goods.goodsPolymerization',
      data,
      method: 'POST'
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

  // 购物车列表
  getCartList(data) {
    return this.request({
      url: 'app/ewei_shopv2_api.php?i=2&r=member.cart.get_cart',
      method: 'POST',
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    })
  }

  // 修改购物车
  cartUpdate(data) {
    return this.request({
      url: 'app/ewei_shopv2_api.php?i=2&r=member.cart.update',
      method: 'POST',
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    })
  }

  // 添加到购物车 app/ewei_shopv2_api.php?i=2&r=member.cart.add
  cartadd(data) {
    return this.request({
      url: 'app/ewei_shopv2_api.php?i=2&r=member.cart.add',
      method: 'POST',
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    })
  }

  // 删除购物车 /app/ewei_shopv2_api.php?i=2&r=member.cart.remove
  cartDel(data) {
    return this.request({
      url: 'app/ewei_shopv2_api.php?i=2&r=member.cart.remove',
      method: 'POST',
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    })
  }

  // 订单生成 /v1/order/generate
  generateOrder(data) {
    return this.request({
      url: 'app/ewei_shopv2_api.php?i=2&r=order.generate',
      method: 'POST',
      data
    })
  }

  // 订单详情 /app/ewei_shopv2_api.php?i=2&r=order.detail
  orderDetail(data) {
    return this.request({
      url: 'app/ewei_shopv2_api.php?i=2&r=order.detail',
      method: 'POST',
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    })
  }

  // 订单查询 /app/ewei_shopv2_api.php?i=2&r=order.get_list
  orderList(data) {
    return this.request({
      url: 'app/ewei_shopv2_api.php?i=2&r=order.get_list',
      method: 'POST',
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    })
  }

  // 修改订单的收货地址  app/ewei_shopv2_api.php?i=2&r=order.modify
  modifyAddress(data) {
    return this.request({
      url: 'app/ewei_shopv2_api.php?i=2&r=order.modify',
      method: 'POST',
      data
    })
  }

  // 取消订单（小程序）/app/ewei_shopv2_api.php?i=2&r=order.op.cancel
  orderCancel(data) {
    return this.request({
      url: 'app/ewei_shopv2_api.php?i=2&r=order.op.cancel',
      method: 'POST',
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    })
  }

}