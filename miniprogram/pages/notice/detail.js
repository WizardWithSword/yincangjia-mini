// pages/notice/notice.js
const api = require('../../utils/api.js')
const common = require('../../utils/utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice: {
      author: "",
      content: "",
      createtime: "",
      noticeid: 1,
      tags: null,
      title: ""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('公告详情页', this)
    var id = this.options.noticeid || 1
    api.get('/api/notice/detail?id=' + id).then((res) => {
      if (res.code === '200') {
        res.result.createtime = common.formatTime(res.result.createtime)
        this.setData({
          notice: res.result
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'ndne'
        })
      }
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