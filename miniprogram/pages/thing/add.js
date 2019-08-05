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
    cateArray: [{"id":"0","value":"其他"},{"id":"10","value":"石器"},{"id":"20","value":"玉器"},{"id":"30","value":"陶器"},{"id":"40","value":"铜器"},{"id":"50","value":"书画"},{"id":"60","value":"木器"},{"id":"70","value":"石刻"},{"id":"80","value":"瓷器"},{"id":"90","value":"杂项"},{"id":"100","value":"铁器"},{"id":"110","value":"金属器"},{"id":"120","value":"牙膏器"},{"id":"130","value":"丝织品"},{"id":"140","value":"砖瓦"},{"id":"150","value":"印章"},{"id":"160","value":"徽章"},{"id":"170","value":"舆图"},{"id":"180","value":"珠宝"}],
    cateIndex: 0,
    eraArray: [{"id":"0","value":"未知"},{"id":"10","value":"汉"},{"id":"20","value":"秦"},{"id":"30","value":"宋"},{"id":"40","value":"唐"},{"id":"50","value":"明"},{"id":"60","value":"明清"},{"id":"70","value":"清"},{"id":"80","value":"战国"},{"id":"90","value":"春秋战国"},{"id":"100","value":"秦汉"},{"id":"110","value":"魏晋"},{"id":"120","value":"夏商周"},{"id":"130","value":"南北朝"},{"id":"140","value":"隋唐"},{"id":"150","value":"五代十国"},{"id":"160","value":"北宋"},{"id":"170","value":"南宋"},{"id":"180","value":"辽金"},{"id":"190","value":"旧石器"},{"id":"200","value":"新石器"},{"id":"210","value":"夏"},{"id":"220","value":"商"},{"id":"230","value":"周"},{"id":"240","value":"春秋"},{"id":"250","value":"民国"},{"id":"260","value":"当代"}],
    eraIndex: 0,
    intergrityArray: [{"id":"0","value":"未知"},{"id":"10","value":"全品"},{"id":"20","value":"瑕疵"},{"id":"30","value":"残品"}],
    intergrityIndex: 0,
    imagesCloud: [],
    // imagesCloud: ['cloud://yamoon-test-52afba.7961-yamoon-test-52afba-1258905543/my-image.png', 'cloud://yamoon-test-52afba.7961-yamoon-test-52afba-1258905543/thing/4/t1558514847326.png', 'http://tmp/wx9cb42adfa3f45c25.o6zAJsz2VXXb72bDLglI1OIVSp-8.mI3BeyVxDwtI57f3c8f766963bfd4c68de6a75b4a302.png'],
    imagesLocal: []
  },
  // 品类选择
  bindCategoryChange: function (e) {
    console.log('品类', e.detail.value)
    this.setData({
      cateIndex: e.detail.value
    })
  },
  // 年代选择
  bindEraChange: function (e) {
    console.log('年代', e.detail.value)
    this.setData({
      eraIndex: e.detail.value
    })
  },
  // 品相选择
  bindIntergChange: function (e) {
    console.log('品相', e.detail.value)
    this.setData({
      intergrityIndex: e.detail.value
    })
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
  showImg: function (event) {
    var idx = event.currentTarget.dataset.idx
    var arr = this.data.imagesCloud[idx]
    wx.previewImage({
      urls: this.data.imagesCloud
    })
    return false
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
    var count = 6 - this.data.imagesCloud.length
    // 选择图片
    wx.chooseImage({
      count: count,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        // const filePath = res.tempFilePaths[0]
        var uid = wx.getStorageSync('uid')
        // 上传图片
        // const cloudPath = 'thing/' + uid + '/t' + time + filePath.match(/\.[^.]+?$/)[0]
        console.log('选择的图片资源：', res.tempFilePaths)
        var doneNums = 0
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          var filePath = res.tempFilePaths[i]
          var time = (new Date()).getTime()
          var cloudPath = 'thing/' + uid + '/t' + time + filePath.match(/\.[^.]+?$/)[0]
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
              // console.log('[上传文件] 成功后，数据：', that)
              // wx.showToast({
              //   icon:'none',
              //   title: '上传成功',
              // })
            },
            fail: e => {
              console.error('[上传文件] 失败：', e)
              wx.hideLoading()
              wx.showToast({
                icon: 'none',
                title: '有图片上传失败',
              })
            },
            complete: () => {
              doneNums++
              if (doneNums >= res.tempFilePaths.length) {
                wx.hideLoading()
              }
            }
          })
        }
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
    thing.era = this.data.eraArray[this.data.eraIndex].id
    thing.category = this.data.cateArray[this.data.cateIndex].id
    thing.intergrity = this.data.intergrityArray[this.data.intergrityIndex].id
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
      thing.era = this.data.eraArray[this.data.eraIndex].id
      thing.category = this.data.cateArray[this.data.cateIndex].id
      thing.intergrity = this.data.intergrityArray[this.data.intergrityIndex].id

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
    api.post('/api/thing/online', thing).then((d) => {
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
  _computedIdx: function (obj) {
    var eraid = 0
    var cateid = 0
    var intergid = 0
    console.log('obj相关', obj.era, obj.category, obj.intergrity)
    for (var key1 = 0; key1 < this.data.eraArray.length; key1++) {
      if (this.data.eraArray[key1].id == obj.era) {
        eraid = key1
        break
      }
    }
    for (var key2 = 0; key2 < this.data.cateArray.length; key2++) {
      if (this.data.cateArray[key2].id == obj.category) {
        cateid = key2
        break
      }
    }
    for (let key3 in this.data.intergrityArray) {
      if (this.data.intergrityArray[key3].id == obj.intergrity) {
        intergid = key3
        break
      }
    }
    this.setData({
      eraIndex: eraid,
      cateIndex: cateid,
      intergrityIndex: intergid
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
          this._computedIdx(d.result)
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