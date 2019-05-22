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
    // 获取全局通信证书
    api.getKeys().then(function (d) {
      console.log('get keys:', d)
    })


  }
})

