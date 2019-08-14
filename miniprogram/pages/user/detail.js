// pages/user/detail.js

// const app = getApp()
const api = require('../../utils/api.js')
Page({

  data: {
    cardStatus: -1,
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
    var myuid = wx.getStorageSync('uid')
    this.setData({
      myuid: myuid,
      uid: options.uid
    })
    this._getUserDetail(options.uid)
    this._getCardStatus(options.uid, myuid)
  },
  // 获取名片请求状态
  _getCardStatus (replyuid, myuid) {
    var obj = {}
    obj.applyuid = myuid
    obj.replyuid = replyuid
    api.get('/api/card/isapply', obj).then(res => {
      if (res.code == 200) {
        console.log('名片的请求内容', res)
        if (res.result && res.result.cardid) {
          this.setData({
            cardStatus: res.result.replystatus
          })
        }
      }
    })
  },
  // 申请交换名片
  goApplyCard () {
    var obj = {}
    obj.applyuid = this.data.myuid
    obj.replyuid = this.data.uid
    api.post('/api/card/apply', obj).then(res => {
      if (res.code == 200) {
        if (res.result && res.result.insertId) {
          this.setData({
            cardStatus: 0
          })
        }
        this._tip('申请成功，请耐心等待')
      } else {
        this._tip('申请失败，请稍后再试')
      }
    })
  },
  goCardDetail () {
    var cardid = this.data.uid
    console.log('前往这个人的名片页面：', cardid)
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