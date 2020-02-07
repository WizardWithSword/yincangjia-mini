// miniprogram/pages/test/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: 0,
    latitude: 0,
    changeLatitude: 0,
    changeLongitude: 0,
    listenNum: 0,
    polyline: [{
      color:"#F18330",
      width: 2,
      dottedLine: false,
      points: [{longitude: 116.4574384689331, latitude: 39.92117445059249}, {longitude: 116.45881175994873, latitude: 39.92102634201797}, {longitude: 116.45872592926025, latitude: 39.91919964325845}, {longitude: 116.46209478378296, latitude: 39.918327418554185}]
    }]
  },
  clickmap (event) {
    console.log('点击地图', event)
    console.log('经纬度：', event.detail)
    let linesnow = this.data.polyline
    linesnow[0].points.push(event.detail)
    this.setData({
      'polyline': linesnow
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getLocation({
      success (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude          
        })
      }
    })
    wx.startLocationUpdateBackground({
      success (res) {
        console.log('location listen background success', res)
        that.listenLocation()
      },
      fail (res) {
        console.log('fail, back start', res)
        wx.startLocationUpdate({
          success (res1) {
            that.listenLocation()
            console.log('location listen front success', res1)
          },
          fail (res2) {
            that.tipLocationListenFail(res2.errMsg)
            console.log('fail, front start', res2)
          }
        })
      }
    })
  },
  tipLocationListenFail (str) {
    wx.showToast({
      icon: 'none',
      duration: 3000,
      title: str || '使用设备的地理位置失败'
    })
  },

  listenLocation () {    
    this.setData({
      listenNum: this.data.listenNum++
    })
    wx.onLocationChange((res) => {
      console.log('location now', res)
      this.setData({
        changeLatitude: res.latitude,
        changeLongitude: res.longitude
      })
    })
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

  }
})