// pages/comment/add.js

const app = getApp()
const api = require('../../utils/api.js')
Page({

  data: {
    tid: '',
    parentcid: 0,
    text: ''
  },
  inputcomment: function (event) {
    this.setData({
      text: event.detail.value
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
    obj.content = this.data.text
    if (obj.content == '') {
      wx.showToast({
        icon: 'none',
        title: '请填写您的评论'
      })
      return false
    }
    obj.uid = wx.getStorageSync('uid')
    obj.uname = wx.getStorageSync('wxuser').nickName
    obj.tid = this.data.tid
    obj.parentcid = this.data.parentcid
    api.post('/api/comment/add', obj).then(function (d) {
      console.log('/comment/add 的返回值：', d)
      if (d.code == '200') {
        wx.showToast({
          icon: 'none',
          title: '评论成功'
        })
        setTimeout(()=>{
          wx.navigateBack()
        }, 2000)
      } else {
        wx.showToast({
          icon: 'none',
          title: d.message
        })
      }
    })
  },

  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
    if (options.tid) {
      this.setData({
        tid: options.tid
      })
    }
    if (options.parentcid) {
      this.setData({
        parentcid: options.parentcid
      })
    }
  },

  goHome: function() {
    const pages = getCurrentPages()
    if (pages.length === 2) {
      wx.navigateBack()
    } else if (pages.length === 1) {
      wx.redirectTo({
        url: '../index/index',
      })
    } else {
      wx.reLaunch({
        url: '../index/index',
      })
    }
  }

})