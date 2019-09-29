// pages/card/index.js
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    thisCard: {}, // 显示的名片
    showOnecard: 'false', // 显示单个名片
    nav1List: [],
    nav2Tab1List: [],
    nav2Tab2List: [],
    navIndex: 1,
    tabIndex: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getAllCards()
    this._getCardsToMe()
    this._getCardsFromMe()
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
  acceptCard (event) {
    var applyuid = event.currentTarget.dataset.applyuid
    var replyuid = event.currentTarget.dataset.replyuid
    var replystatus = event.currentTarget.dataset.replystatus
    var obj = {
      applyuid: applyuid,
      replyuid: replyuid,
      replystatus: replystatus
    }
    var idx = event.currentTarget.dataset.idx
    var title = '确认通过申请？'
    if (replystatus == 2) {
      title = '确认拒绝申请？'
    }
    wx.showModal({
      title: title,
      success: resmodal => {
        if (resmodal.confirm) {
          api.post('/api/card/reply', obj).then(res => {
            if (res.code === "200") {
              wx.showToast({
                title: '操作成功',
                icon: 'none'
              })
              this.setData({
                ['nav2Tab1List[' + idx +'].replystatus']: replystatus
              })
            } else {
              wx.showToast({
                title: '操作失败',
                icon: 'none'
              })
            }
          })
        } else {}
      }
    })
  },
  // 拒绝名片申请
  rejectCard (event) {
    var applyuid = event.currentTarget.dataset.applyuid
    var replyuid = event.currentTarget.dataset.replyuid
    var replystatus = event.currentTarget.dataset.replystatus
  },
  // 获取我所有能看的名片
  _getAllCards () {
    api.get('/api/card/list/done').then(res => {
      if (res.code == '200') {
        this.setData({
          nav1List: res.result
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
  },
  showThisCard (event) {
    console.log(event)
    var idx = event.currentTarget.dataset.idx
    console.log('idx', idx)
    var item = this.data.nav1List[idx]
    console.log('显示的当前用户名片', item.wechatnnick, item)
    this.setData({
      showOnecard: 'true',
      thisCard: item
    })
  },
  closeThisCard () {
    this.setData({
      showOnecard: 'false'
    })
  },
  // 获取所有向我申请的名片请求
  _getCardsToMe () {
    api.get('/api/card/list/mine').then(res => {
      if (res.code == '200') {
        this.setData({
          nav2Tab1List: res.result
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
  },
  // 获取所有我发出的申请
  _getCardsFromMe () {
    api.get('/api/card/list/other').then(res => {
      if (res.code == '200') {
        this.setData({
          nav2Tab2List: res.result
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
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