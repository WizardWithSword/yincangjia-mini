// pages/thing/detail.js
const api = require('../../utils/api.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFollow: false,
    showComment: false,
    commentdata: {
      tid: '',
      parentcid: 0,
      text: ''
    },
    shareimg: '', // 当前藏品分享图片
    tid: '',
    thingDetail: {},
    commentLists: [],
    collectHeaders: [],
    pariseHeaders: [],
    showtab: 'comment'
  },
  // 前往用户首页
  goUserDetail: function (event) {
    var uid = event.currentTarget.dataset.uid
    wx.navigateTo({
      url: '/pages/user/detail?uid=' + uid
    })
  },
  inputcomment: function (event) {
    this.setData({
      'commentdata.text': event.detail.value
    })
  },
  cancel: function () {
    this.setData({
      showComment: false
    })
  },
  submit: function () {
    var obj = {
      uid: -1,
      uname: '',
      tid: -1, // 评论的藏品
      parentcid: 0, // 一级评论
      content: '又是一条评论。第一条评论的内容。我是老大'
    }
    obj.content = this.data.commentdata.text
    if (obj.content == '') {
      wx.showToast({
        icon: 'none',
        title: '请填写您的评论'
      })
      return false
    }
    obj.uid = wx.getStorageSync('uid')
    obj.uname = wx.getStorageSync('wxuser').nickName
    obj.tid = this.data.commentdata.tid
    obj.parentcid = this.data.commentdata.parentcid
    api.post('/api/comment/add', obj).then((d) => {
      console.log('/comment/add 的返回值：', d)
      if (d.code == '200') {
        wx.showToast({
          icon: 'none',
          title: '评论成功'
        })
        this.setData({
          showComment: false
        })
        this._getComments()
      } else {
        wx.showToast({
          icon: 'none',
          title: d.message
        })
      }
    })
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
    // var url = '/pages/comment/add'
    // url += '?tid=' + this.data.tid + '&parentcid=0'
    // wx.navigateTo({
    //   url: url
    // })
    this.setData({
      'commentdata.tid': this.data.tid,
      'commentdata.parentcid': 0,
      'commentdata.text': '',
      showComment: true
    })
  },
  // 前往添加评论的评论页面
  goaddChildrenComment: function (event) {
    var cid = event.currentTarget.dataset.cid
    // var url = '/pages/comment/add'
    // url += '?tid=' + this.data.tid + '&parentcid=' + cid
    // wx.navigateTo({
    //   url: url
    // })
    this.setData({
      'commentdata.tid': this.data.tid,
      'commentdata.parentcid': cid,
      'commentdata.text': '',
      showComment: true
    })
  },
  _tip: function (str) {
    wx.showToast({
      icon: 'none',
      title: str
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
        this._getShareImg()
        this._getIsFollow()
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
  // 添加关注
  addFollow () {
    var obj = {
      fuid: this.data.thingDetail.uid
    }
    api.post('/api/user/follow/add', obj).then(res => {
      console.log('关注结果：', res)
      if (res.code == '200') {
        this._tip('关注成功')
        this.setData({
          isFollow: true
        })
      } else {
        this._tip(res.message)
      }
    })
  },
  cancelFollow () {
    var obj = {
      fuid: this.data.thingDetail.uid
    }
    api.post('/api/user/follow/cancel', obj).then(res => {
      console.log('取消关注结果:', res)
      if (res.code == '200') {
        this._tip('取关成功')
        this.setData({
          isFollow: false
        })
      } else {
        this._tip(res.message)
      }
    })
  },
  _getIsFollow () {
    var obj = {
      fuid: this.data.thingDetail.uid
    }
    api.get('/api/user/follow/isfollow', obj).then(res => {
      console.log('是否关注？', res)
      if (res.code == '200') {
        this.setData({
          isFollow: res.result == '1'
        })
      } else {
        this._tip(res.message)
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
  _getShareImg: function () {
    wx.cloud.getTempFileURL({
      fileList: [{
        fileID: this.data.thingDetail.imagesArr[0],
        maxAge: 60 * 60 * 12, // one hour
      }]
    }).then(res => {
      // get temp file URL
      var file = res.fileList[0]
      console.log('获取的云端地址', file)
      if (file.status == 0) {
        this.setData({
          'shareimg': file.tempFileURL
        })
      }
    }).catch(error => {
      // handle error
    })    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var title = this.data.thingDetail.name
    var img = this.data.shareimg
    var path = '/pages/thing/detail?tid=' + this.data.thingDetail.tid
    console.log('分享所需的img', img)
    return {
      title: title,
      imageUrl: img,
      path: path,
      success: function (res) {
        console.log('success', res)
        wx.showToast({
          icon: 'none',
          title: '分享成功'
        })
      },
      complete: function (res) {
        console.log('complete', res)
      }
    }
  }
})