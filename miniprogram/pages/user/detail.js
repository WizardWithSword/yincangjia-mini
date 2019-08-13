// pages/user/detail.js

// const app = getApp()
const api = require('../../utils/api.js')
Page({

  data: {
    isCardExchange: false,
    uid: '3',
    info: {},
    thinglist: []
  },
  _tip (str) {
    wx.showToast({
      title: str,
      icon: 'none'
    })
  },
  onLoad: function (options) {
    console.log('进入页面参数：', options, options.uid)
    this.setData({
      uid: options.uid
    })
    this._getUserDetail(options.uid)
  },
  // 首页列表数据处理
  _dealData: function (arr) {
    var tmp = arr
    for (var i = arr.length - 1; i >= 0; i--) {
      arr[i].showAll = false
      arr[i].likeThisThing = false
      arr[i].shareImg = ''
      arr[i].imagesList = arr[i].images.split(';')
    }
    return tmp
  },
  _getUserDetail (uid) {
    var obj = {
      uid: uid
    }
    api.get('/api/user/detail/other', obj).then(res => {
      if (res.code == '200') {
        this.setData({
          info: res.result.userinfo,
          thinglist: this._dealData(res.result.thing)
        })
      } else {
        this._tip(res.message)
      }
    })
  }

})