// pages/deployFunctions/deployFunctions.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navIndex: 1,
    tabIndex: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      title: '接口开发中',
      icon: 'none'
    })
  },
  clickNav(event) {
    this.setData({
      navIndex: event.currentTarget.dataset.nav
    })
  },
  // 点击切换我发出的名片2  和 我收到的名片1
  clickTap(event) {
    this.setData({
      tabIndex: event.currentTarget.dataset.tab
    })
  },
  // 通过名片申请
  acceptCard () {},
  // 拒绝名片申请
  rejectCard () {},

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