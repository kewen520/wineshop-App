export const observers = {
  modeItemOff(count) {
    console.log('count: ', count)
    if (count) {
      this.setData({
        comStatu: 100
      })
    } else {
      this.setData({
        comStatu: count
      })
    }
  },
  statu(count) {
    this.setData({
      comStatu: count
    })
  }
}