//index.js
const app = getApp()
const api = require('../../utils/api.js')
Page({
  data: {
    noticeList: [],
    noticeVertical: true,
    itemList: [],
    avatarUrl: '../../images/user-unlogin.png',
    userInfo: {},
    showGetUserinfo: false
  },
  // 点击前往公告详情
  goNoticeDetail: function (event) {
    var id = event.currentTarget.dataset.noticeid
    console.log('点击', event)
    wx.navigateTo({
      url: '/pages/notice/detail?noticeid=' + id
    })
  },
  showAll: function (event) {
    var idx = event.currentTarget.dataset.idx
    // this.data. = true
    this.setData({
      ['itemList[' + idx + '].showAll']: true
    })
  },
  // 点击前往商品详情
  goDetail: function (event) {
    var id = event.currentTarget.dataset.tid
    console.log('点击', event)
    wx.navigateTo({
      url: '/pages/thing/detail?tid=' + id
    })
  },
  // 点击回到首页
  goIndex: function () {
    console.log('点击逛逛', this)
    if (this.route === 'pages/index/index') {
      return false
    }
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },
  // 点击回到发布藏品页面
  goAddIndex: function () {
    console.log('点击发布')
    if (this.route === 'pages/thing/add') {
      return false
    }
    wx.navigateTo({
      url: '/pages/thing/add'
    })
  },
  // 点击回到个人中心
  goMyIndex: function () {
    console.log('点击我的')
    if (this.route === 'pages/user/index') {
      return false
    }
    wx.navigateTo({
      url: '/pages/user/index'
    })
  },

  onLoad: function() {
    var uid = wx.getStorageSync('uid')
    if (uid == '') {
      console.log('用户未登录')
      getOpenidTologin()
      this.setData({
        showGetUserinfo: true
      })
    }

    api.getNoticeList().then(res => {
      console.log('公告列表：', res)
      if (res.code === '200') {
        this.setData({
          noticeList: res.result
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    })
    api.get('/api/index').then(res => {
      console.log('内容列表：', res)
      if (res.code === '200') {
        var d = this._dealData(res.result)
        this.setData({
          itemList: d
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    })
    // var feed = {}
    // feed.contact = '18767104983'
    // feed.content = '中美最后一轮磋商，A股大涨...也是醉了'
    // api.post('/api/feedback/add', feed).then(function(d) {
    //   console.log('feedback/add 返回值:', d)
    // })
  },
  // 首页列表数据处理
  _dealData: function (arr) {
    var tmp = arr
    for (var i = arr.length - 1; i >= 0; i--) {
      arr[i].showAll = false
      arr[i].imagesList = arr[i].images.split(';')
    }
    return tmp
  },

  onGetUserInfo: function(e) {
    console.log('e 用户信息按钮', e)
    if (e.detail.userInfo) {
      this.setData({
        showGetUserinfo: false,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
      // 全局记录微信用户信息
      app.globalData.wxuser = e.detail.userInfo
      // console.log('this.userinfo', this.userInfo)
      var obj = {
        openid: app.globalData.openid,
        wechatheader: this.data.userInfo.avatarUrl,
        wechatnick: this.data.userInfo.nickName
      }
      // console.log('当前用户信息', obj)
      api.post('/api/user/threelogin', obj).then(res => {
        if (res.code === '200') {
          console.log('登录结果:', res)
          wx.setStorageSync('uid', res.result.uid)
          // 全局记录我们的系统内的微信用户信息
          app.globalData.thisuser = res.result
          // 取消显示登录弹框
          this.setData({
            showGetUserinfo: false
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.message,
          })
        }
      })
    }
  },

  onGetOpenid: function(e) {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        console.log('云函数 login, result:', res.result)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  }
})


function getOpenidTologin () {
  wx.cloud.callFunction({
    name: 'login',
    data: {},
    success: res => {
      console.log('[云函数] [login] user openid: ', res.result.openid)
      app.globalData.openid = res.result.openid
      console.log('云函数 login, result:', res.result)
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
      getOpenidTologin()
    }
  })
}
