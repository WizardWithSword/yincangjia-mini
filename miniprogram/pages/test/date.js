// miniprogram/pages/test/date.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blueDates: ['2019-10-10', '2019-10-11'],
    pinkDates: ['2019-10-11', '2019-10-12']
  },
  onChangeDay (data) {
    console.log('日期变化：', data)
  },
  onChangeMonth (data) {
    console.log('月份变化：', data)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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