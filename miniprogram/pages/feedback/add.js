// pages/feedback/add.js
const api = require('../../utils/api.js')
Page({

  data: {
    feed: '',
    phone: ''
  },
  textBlur (e) {
    console.log('e', e)
    this.setData({
      feed: e.detail.value
    })
  },
  inputBlur (e) {
    console.log('e', e)
    this.setData({
      phone: e.detail.value
    })
  },
  submit () {
    console.log('submit')
    var feed = {}
    feed.contact = this.data.phone
    feed.content = this.data.feed
    if (feed.content == '') {
      wx.showToast({
        title: '请填写您的反馈意见',
        icon: 'none'
      })
      return false
    }
    api.post('/api/feedback/add', feed).then(function(d) {
      console.log('feedback/add 返回值:', d)
      if (d.code == '200') {
        wx.showToast({
          duration: 2000,
          title: '反馈成功！您的建议是我们进步的动力！',
          icon: 'none'
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      } else {
        wx.showToast({
          title: '反馈失败',
          icon: 'none'
        })
      }
    })
  },
  onLoad: function (options) {

  }
})

