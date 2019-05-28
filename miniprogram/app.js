const api = require('./utils/api.js')
//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {}
    this.globalData.API = api
    var u1 = wx.getStorageSync('wxuser')
    var u2 = wx.getStorageSync('thisuser')
    if (u1) {
      this.globalData.wxuser = u1
    }
    if (u2) {
      this.globalData.thisuser = u2
    }
    console.log('app onLaunch', u1, u2)
    // 获取全局通信证书
    api.getKeys().then(function (d) {
      console.log('get keys:', d)
    })

  },
  onShow: function (options) {
    console.log('小程序启动:', options)
    if (options.query.uid && options.query.type === 'invite') {
      var isGroupSceen = !!options.shareTicket || options.scene == 1008 || options.scene == 1044 // 当前入口是否是群入口
      var isGroupInvite = options.query.f == 'group'
      var isUserInvite = options.query.f == 'user'
      console.log('有人邀请')
      if (options.query.f == 'user') {
        console.log('单独邀请:')
      } else if (options.query.f == 'group') {
        console.log('群邀请')
      }
      if (options.shareTicket) {
        console.log('当前是群组对话')
      } else {
        console.log('当前是个人对话')
      }
      if (isGroupSceen && isGroupInvite) {
        this.globalData.inviteinfo = options
      } else if (isUserInvite && !isGroupSceen) {
        this.globalData.inviteinfo = options
      }
    }
  }
})

