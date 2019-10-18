// miniprogram/pages/museum/index.js
const api = require('../../utils/api.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    whosMuseum: '', // 谁的博物馆
    cardStatus: -1,
    myuid: '',
    uid: '',
    info: {},
    cateCount: {
      '10': 1
    },
    cateImg: {
      '10': ''
    },
    cateName: {
      '10': '石器',
      '20': '玉器',
      '30': '陶器',
      '40': '铜器',
      '50': '书画',
      '60': '木器',
      '70': '石刻',
      '80': '瓷器',
      '90': '杂项',
      '100': '铁器',
      '110': '金属器',
      '120': '牙膏器',
      '130': '丝织品',
      '140': '砖瓦',
      '150': '印章',
      '160': '徽章',
      '170': '舆图',
      '180': '珠宝',
      '0': '其他'
    },
    thingCate: [{
      category: '',
      name: '',
      count: 0,
      img: ''
    }],
    thinglist: []
  },
  _tip (str) {
    wx.showToast({
      title: str,
      icon: 'none'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('进入页面参数：', options, options.uid)
    const myuid = wx.getStorageSync('uid')
    const optionsuid = options.uid
    this.setData({
      myuid: myuid,
      uid: optionsuid || ''
    })
    if (optionsuid !== undefined && (optionsuid - 0) !== myuid) {
      console.log('别人的博物馆')
      // 他人的博物馆
      this._getUserDetail(optionsuid)
      this._getCardStatus(optionsuid, myuid)
      this.setData({
        whosMuseum: 'other'
      })
    } else {
      console.log('我的博物馆')
      // 我的博物馆
      this._getUserDetail(myuid)
      this.setData({
        whosMuseum: 'mine'
      })
    }
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
  // 前往名片夹
  goViewCard () {
    wx.navigateTo({
      url: '/pages/card/index'
    })
  },
  // 申请交换名片
  goApplyCard () {
    // 检查当前用户是否有手机号。如果没有前往个人中心。
    if (!app.globalData.thisuser.phone) { // 手机号码不合法
      wx.showModal({
        title: '交换名片需要完善个人手机号码，是否前往个人中心填写？',
        success: resmodal => {
          if (resmodal.confirm) {
            wx.navigateTo({
              url: '/pages/user/setting'
            })
          } else {}
        }
      })
      return false
    }
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
  // 获取他人的基本信息
  _getUserDetail (uid) {
    var obj = {
      uid: uid
    }
    api.get('/api/user/detail/other', obj).then(res => {
      if (res.code == '200') {
        console.log('获得到的接口数据:', res)
        this.setData({
          info: res.result.userinfo,
          thinglist: this._dealData(res.result.thing)
        })
        this._computedThings()
        wx.setNavigationBarTitle({
          title: res.result.userinfo.wechatnick + '的博物馆'
        })
        // wx.setNavigationBarColor({
        //   frontColor: '#ffffff',
        //   backgroundColor: '#ED473B'
        // })
      } else {
        this._tip(res.message)
      }
    })
  },
  _computedThings: function () {
    const cateCount = {}
    const cateImg = {}
    const arr = this.data.thinglist
    for (let i = 0; i < arr.length; i++) {
      let c = arr[i].category
      if (cateCount[c] === undefined) {
        cateCount[c] = 1
      } else {
        cateCount[c] = cateCount[c] + 1
      }
      if (cateImg[c] === undefined) {
        cateImg[c] = arr[i].imagesList[0]
      }
    }
    var newFormatData = []
    for (let key in cateCount) {
      let obj = {}
      obj.category = key
      obj.name = this.data.cateName[key]
      obj.img = cateImg[key]
      obj.count = cateCount[key]
      newFormatData.push(obj)
    }
    console.log('新的数据格式：', newFormatData)
    this.setData({
      thingCate: newFormatData
    })
  },
  goPreview: function (e) {
    const cate = e.currentTarget.dataset.cate
    console.log('前往下一页', cate)
    const uid = this.data.uid || this.data.myuid
    wx.setStorageSync('previewThings', this.data.thinglist)
    wx.navigateTo({
      url: '/pages/museum/preview?uid=' + uid + '&cate=' + cate
    })
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

  // 立即分享。
  goShare () {},
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
    const path = '/pages/museum/index?uid=' + this.data.myuid
    let img = ''
    if (this.data.thinglist[0]) {
      img = this.data.thinglist[0].imagesList[0]
    }
    return {
      title: '我的博物馆',
      imageUrl: img,
      path: path,
      success: function (res) {
        console.log('success', res)
        wx.showToast({
          icon: 'none',
          title: '分享成功'
        })
      },
      complete: function (res) {
        console.log('complete', res)
      }
    }
  }
})