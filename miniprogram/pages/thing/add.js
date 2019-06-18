// pages/thing/add.js
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tid: '',
    title: '',
    content: '',
    imagesCloud: [],
    // imagesCloud: ['cloud://yamoon-test-52afba.7961-yamoon-test-52afba-1258905543/my-image.png', 'cloud://yamoon-test-52afba.7961-yamoon-test-52afba-1258905543/thing/4/t1558514847326.png', 'http://tmp/wx9cb42adfa3f45c25.o6zAJsz2VXXb72bDLglI1OIVSp-8.mI3BeyVxDwtI57f3c8f766963bfd4c68de6a75b4a302.png'],
    imagesLocal: []
  },
  inputBlur: function (e) {
    console.log(e.detail.value)
    this.setData({
      title: e.detail.value
    })
  },
  textBlur: function (e) {
    console.log(e.detail.value)
    this.setData({
      content: e.detail.value
    })
  },
  deleteImg: function (e) {
    var that = this
    var idx = e.target.dataset.index
    wx.showModal({
      title:'删除当前图片？',
      success: res => {
        if (res.confirm) {
          console.log('delete')
          var imgCloud = that.data.imagesCloud
          var imgLocal = that.data.imagesLocal
          imgCloud.splice(idx, 1)
          imgLocal.splice(idx, 1)
          that.setData({
            imagesCloud: imgCloud,
            imagesLocal: imgLocal
          })
        } else if (res.cancel) {
          console.log('cancel')
        }
      }
    })
  },
  // 上传图片
  doUpload: function () {
    var that = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        var uid = wx.getStorageSync('uid')
        var time = (new Date()).getTime()
        // 上传图片
        const cloudPath = 'thing/' + uid + '/t' + time + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            // app.globalData.fileID = res.fileID
            // app.globalData.cloudPath = cloudPath
            // app.globalData.imagePath = filePath
            var imgCloud = that.data.imagesCloud
            var imgLocal = that.data.imagesLocal
            imgCloud.push(res.fileID)
            imgLocal.push(filePath)
            that.setData({
              imagesCloud: imgCloud,
              imagesLocal: imgLocal
            })
            console.log('[上传文件] 成功后，数据：', that)
            wx.showToast({
              icon:'none',
              title: '上传成功',
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  // 保存草稿
  save: function () {
    var thing = {}
    thing.name = this.data.title
    thing.content = this.data.content
    thing.images = this.data.imagesCloud.join(';')
    if (this.data.tid == '') {
      return api.post('/api/thing/add', thing).then(d => {
        console.log('thing/add 返回值:', d)
        if (d.code == '200') {
          console.log('d.result.tid', d.result.tid)
          this.setData({
            tid: d.result.tid
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '保存失败，请重新尝试'
          })
        }
      })
    } else {
      thing.tid = this.data.tid
      console.log('thing/update 请求值:', thing)
      return api.post('/api/thing/update', thing).then(d => {
        console.log('thing/update 返回值:', d)
        if (d.code == '200') {
          wx.showToast({
            icon: 'none',
            title: '保存成功'
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '再次保存失败，请重新尝试'
          })
        }
      })
    }
  },
  // 发布
  saveOnline: function () {
    if (this.data.tid == '') {
      var thing1 = {}
      thing1.name = this.data.title
      thing1.content = this.data.content
      thing1.images = this.data.imagesCloud.join(';')
      api.post('/api/thing/add', thing1).then(d => {
        console.log('thing/add 返回值:', d)
        if (d.code == '200') {
          console.log('d.result.tid', d.result.tid)
          this.setData({
            tid: d.result.tid
          })
          // 设置为上线
          this._online()
        } else {
          wx.showToast({
            icon: 'none',
            title: '保存失败，请重新尝试'
          })
        }
      })
      return false
    } else {
      // 直接设置为上线
      this._online()
    }
  },
  _back: function () {
    wx.navigateBack()
  },
  // 将内容设置为上线。
  _online: function () {
    var thing = {
      tid: this.data.tid,
      status: 2
    }
    api.post('/api/thing/online', thing).then(function(d) {
      console.log('/thing/online 返回值:', d)
      if (d.code == '200') {
        wx.showToast({
          icon: 'none',
          title: '发布成功'
        })
        this._back()
      } else {
        wx.showToast({
          icon: 'none',
          title: '发布失败, 请稍后再试'
        })
      }
    })    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('进入页面的options', options)
    var tid = options.tid
    if (tid) {
      var thing = {
        tid: tid
      }
      api.get('/api/thing/detail', thing).then(d => {
        console.log('/thing/detail 返回值:', d)
        if (d.code == '200') {
          this.setData({
            tid: d.result.tid,
            title: d.result.name,
            content: d.result.content,
            imagesCloud: d.result.images.split(';')
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '获取藏品失败，请稍后再试',
            success: res => {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      })      
    } else {
      console.log('新增藏品')
    }
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