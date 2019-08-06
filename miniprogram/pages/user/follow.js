// pages/user/follow.js

// const app = getApp()
const api = require('../../utils/api.js')
Page({

  data: {
    list: []
  },

  onLoad: function (options) {
    this._getFollowers()
  },
  _tip (str) {
    wx.showToast({
      title: str,
      icon: 'none'
    })
  },
  // 获取关注着列表
  _getFollowers () {
    api.get('/api/user/follow/list').then((d) => {
      console.log('/user/follow/list 的返回值：', d)
      if (d.code == '200') {
        this.setData({
          list: d.result
        })
      } else {
        this._tip(d.message)
      }
    })
  },
  // 取消关注
  _cancelFollow (uid) {
    var one = {
      fuid: uid
    }
    api.post('/api/user/follow/cancel', one).then((d) => {
      console.log('/user/follow/cancel 的返回值：', d)
      if (d.code == '200') {
        this._tip('取消关注成功')
        this._getFollowers()
      } else {
        this._tip(d.message)
      }
    })
  },
  // 对某人添加关注
  _addFollow () {
    var one = {
      fuid: 1
    }
    api.post('/api/user/follow/add', one).then(function (d) {
      console.log('/user/follow/add 的返回值：', d)
    })
  },
  // 点击前往某人首页
  goUserIndex (event) {
    console.log('event:', event)
    var uid = event.currentTarget.dataset.uid
    console.log('前往某人首页:', uid)
    wx.navigateTo({
      url: '/pages/user/detail?uid=' + uid
    })
  },
  // 取消关注某人
  cancelFollow (event) {
    wx.showModal({
      title:'确认取消关注？',
      success: res => {
        if (res.confirm) {
          var uid = event.currentTarget.dataset.uid
          this._cancelFollow(uid)
        } else if (res.cancel) {
          console.log('cancel 取消关注')
        }
      }
    })

  }
})