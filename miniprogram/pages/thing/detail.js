// pages/thing/detail.js
const api = require('../../utils/api.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tid: '',
    thingDetail: {},
    commentLists: [],
    collectHeaders: [],
    pariseHeaders: [],
    showtab: 'comment'
  },
  choosenav: function (event) {
    var tab = event.currentTarget.dataset.tab
    console.log('点击了tab:', tab, event)
    if (tab == 'share') {
      console.log('分享')
    } else {
      this.setData({
        showtab: tab
      })
    }
  },
  showbigimage: function (event) {
    var img = event.currentTarget.dataset.url
    wx.previewImage({
      current: img,
      urls: this.data.thingDetail.imagesArr
    })
  },
  // 喜欢
  goCollectComment: function () {

  },
  // 点赞
  goPraiseComment: function () {
    var tid = this.data.tid
    var data = {
      tid: tid,
      uheader: app.globalData.wxuser.avatarUrl
    }
    api.post('/api/thing/markpraise', data).then(d => {
      console.log('/thing/markpraise 返回值', d)
      if (d.code == '200') {
        wx.showToast({
          icon: 'none',
          title: '点赞成功'
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: d.message
        })
      }
    })
  },
  // 前往添加藏品评论页面
  goaddComment: function () {
    var url = '/pages/comment/add'
    url += '?tid=' + this.data.tid + '&parentcid=0'
    wx.navigateTo({
      url: url
    })
  },
  // 前往添加评论的评论页面
  goaddChildrenComment: function (event) {
    var cid = event.currentTarget.dataset.cid
    var url = '/pages/comment/add'
    url += '?tid=' + this.data.tid + '&parentcid=' + cid
    wx.navigateTo({
      url: url
    })
  },
  _tip: function (res) {
    wx.showToast({
      icon: 'none',
      title: res.message
    })    
  },
  // 获取商品详情
  _getThingdetail: function () {
    var obj = {
      tid: this.data.tid
    }
    api.get('/api/thing/detail', obj).then(res => {
      console.log('藏品详情：', res)
      if (res.code == '200') {
        res.result.imagesArr = res.result.images.split(';')
        this.setData({
          thingDetail: res.result
        })
        this._getViewpoints()
      } else {
        this._tip(res)
      }
    })
  },
  // 获取评论、收藏、点赞。
  _getViewpoints: function () {
    this._getPraisers()
    this._getCollectors()
  },
  _getComments: function () {
    var obj = {}
    obj.tid = this.data.tid
    console.log('请求评论数据')
    return api.get('/api/comment/list', obj).then(res => {
      console.log('请求评论数据', res)
      if (res.code == '200') {
        this.setData({
          commentLists: res.result
        })
      } else {
        this._tip(res)
      }
    })
  },
  _getPraisers: function () {
    var obj = {}
    obj.tid = this.data.tid
    return api.get('/api/thing/getpraisers', obj).then(res => {
      if (res.code == '200') {
        this.setData({
          pariseHeaders: res.result
        })
      } else {
        this._tip(res)
      }
    })
  },
  _getCollectors: function () {
    var obj = {}
    obj.tid = this.data.tid
    return api.get('/api/thing/getcollectors', obj).then(res => {
      if (res.code == '200') {
        this.setData({
          collectHeaders: res.result
        })
      } else {
        this._tip(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tid = options.tid
    console.log('商品id为：', tid)
    this.setData({
      tid: tid
    })
    this._getThingdetail()
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
    this._getComments()
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