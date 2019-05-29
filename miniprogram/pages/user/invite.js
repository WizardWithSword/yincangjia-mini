// pages/user/invite.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    wx.updateShareMenu({
      withShareTicket: true,
      success() { }
    })
    console.log('2小程序启动2:', options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (op) {
    console.log('show', op)
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
  onShareAppMessage: function (options) {
    console.log('options', options)
    var title = wx.getStorageSync('wxuser').nickName + '诚邀您加入隐藏家'
    var path = '/pages/index/index?type=invite&uid=' + wx.getStorageSync('uid')
    if (options.target.dataset.to == 'user') {
      console.log('分享到个人')
      path += '&f=user'
    } else if (options.target.dataset.to == 'group') {
      console.log('分享到群')
      path += '&f=group'
    }
    var ext = (new Date()).getTime() + 30 * 24 * 60 * 60 * 1000
    path += '&t=' + ext
    return {
      title: title,
      imageUrl: 'http://images.kaishiba.com/o_1dberhg031d4gte716932b193i2e.jpeg?imageView2/2/w/640',
      path: path,
      success: function (res) {
        console.log('success', res)
        var target = res.shareTickets ? '群' : '个人'
        wx.showToast({
          icon: 'none',
          title: '分享成功：' + target
        })
      },
      complete: function (res) {
        console.log('complete', res)
      }
    }
  }
})