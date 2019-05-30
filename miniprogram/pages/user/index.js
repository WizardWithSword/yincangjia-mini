// pages/user/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperIndex: 0,
    imgUrls: [11, 22, 33],
    itemList1: [], // 我的已发布藏品
    itemList2: [], // 我的草稿箱的藏品
    itemList3: [], // 我喜欢的藏品
    swiperheight: 400,
    wxuser: {},
    ourUserinfo: {}
  },
  goswiper: function (event) {
    this.setData({
      swiperIndex: event.currentTarget.dataset.idx
    })
  },
  // 前往各个页面
  goPage: function (event) {
    var page = event.currentTarget.dataset.page
    var url = '/pages/'
    switch (page) {
      case 'invite':
        url += 'user/invite'
        break
      case 'message':
        url += 'user/message'
        break
      case 'followers':
        url += 'user/followers'
        break
      case 'feedback':
        url += 'user/feedback'
        break
      case 'setting':
        url += 'user/setting'
        break
    }
    console.log('前往页面：', url)
    if (page == "invite") {
      wx.navigateTo({
        url: url
      })      
    } else {
      wx.showToast({
        icon: 'none',
        title: '功能开发中..'
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('==> user index onload')
    this.setData({
      ourUserinfo: app.globalData.thisuser,
      wxuser : app.globalData.wxuser
    })
    app.globalData.API.get('/api/thing/mine', {status: 1}).then(res => {
      console.log('我草稿的藏品:', res)
      if (res.code == '200') {
        var things = this._dealMyRes(res.result)
        this.setData({
          itemList1: things
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: res.message
        })
      }
    })
    app.globalData.API.get('/api/thing/mine', {status: 2}).then(res => {
      console.log('我发布的藏品:', res)
      if (res.code == '200') {
        var things = this._dealMyRes(res.result)
        this.setData({
          itemList2: things
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: res.message
        })
      }
    })
    app.globalData.API.get('/api/thing/mylikes').then(res => {
      console.log('我喜欢的藏品:', res)
      if (res.code == '200') {
        var things = this._dealMyRes(res.result)
        this.setData({
          itemList3: things
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: res.message
        })
      }
    })
  },
  _dealMyRes: function (arr) {
    let tmparr = []
    for(var i = 0; i < arr.length; i++) {
      arr[i].showAll = false
      arr[i].imagesList = arr[i].images.split(';')
      arr[i].wechatnick = app.globalData.wxuser.nickName
      arr[i].wechatheader = app.globalData.wxuser.avatarUrl
      tmparr.push(arr[i])
    }
    return tmparr
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