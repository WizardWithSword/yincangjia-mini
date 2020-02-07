//index.js
const app = getApp()
const api = require('../../utils/api.js')
Page({
  data: {
    shareinfo: {}, // 分享的信息
    yearArray: [2,3,4,5,6,7,8,9,10,11],
    yearIndex: 0,
    hasShop: false,
    hasShopArray: ['有', '没有'],
    hasShopIndex: 0,
    personSign: '',
    shopcityArr: [],
    customItem: '其他',
    shopName: '',
    shopAddr: '',
    noticeList: [],
    noticeVertical: true,
    itemList: [],
    avatarUrl: '../../images/user-unlogin.png',
    userInfo: {},
    showReg: false,
    showGetUserinfo: false
  },
  showImg: function (event) {
    var idx = event.currentTarget.dataset.idx
    var arr = this.data.itemList[idx].imagesList
    wx.previewImage({
      urls: arr
    })
    return false
  },
  // 点击前往公告详情
  goNoticeDetail: function (event) {
    var id = event.currentTarget.dataset.noticeid
    console.log('点击', event)
    wx.navigateTo({
      url: '/pages/notice/detail?noticeid=' + id
    })
  },
  showAll: function (event) {
    var idx = event.currentTarget.dataset.idx
    // this.data. = true
    this.setData({
      ['itemList[' + idx + '].showAll']: true
    })
    return false
  },
  // 点击前往商品详情
  goDetail: function (event) {
    var gologin = this._needLogin()
    if (gologin) {
      return false
    }
    var id = event.currentTarget.dataset.tid
    console.log('点击', event)
    wx.navigateTo({
      url: '/pages/thing/detail?tid=' + id
    })
    return false
  },
  // 点击大拇指点赞
  goPraise: function (event) {
    var gologin = this._needLogin()
    if (gologin) {
      return false
    }
    var tid = event.currentTarget.dataset.tid
    var idx = event.currentTarget.dataset.idx
    var data = {
      tid: tid,
      uheader: app.globalData.wxuser.avatarUrl
    }
    api.post('/api/thing/markpraise', data).then(d => {
      console.log('/thing/markpraise 返回值', d)
      if (d.code == '200') {
        var num = this.data.itemList[idx].praisenum
        num++
        this.setData({
         ['itemList[' + idx + '].praisenum']: num,
         ['itemList[' + idx + '].hasPraise']: true
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: d.message
        })
      }
    })
  },
  // 点击标记喜欢
  goLike: function (event) {
    var gologin = this._needLogin()
    if (gologin) {
      return false
    }
    var tid = event.currentTarget.dataset.tid
    var idx = event.currentTarget.dataset.idx
    var data = {
      tid: tid,
      uheader: app.globalData.wxuser.avatarUrl
    }
    console.log('点击', event)
    api.post('/api/thing/marklike', data).then(d => {
      console.log('/thing/marklike 返回值', d)
      if (d.code == '50001') {
        this.setData({
         ['itemList[' + idx + '].likeThisThing']: true
        })
      }
      if (d.code == '200') {
        this.setData({
         ['itemList[' + idx + '].likeThisThing']: true
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: d.message
        })
      }
    })
  },
  // 点击回到首页
  goIndex: function () {
    console.log('点击逛逛', this)
    var gologin = this._needLogin()
    if (gologin) {
      return false
    }
    if (this.route === 'pages/index/index') {
      return false
    }
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },
  // 点击回到发布藏品页面
  goAddIndex: function () {
    console.log('点击发布')
    var gologin = this._needLogin()
    if (gologin) {
      return false
    }
    if (this.route === 'pages/thing/add') {
      return false
    }
    wx.navigateTo({
      url: '/pages/thing/add'
    })
  },
  // 点击回到个人中心
  goMyIndex: function () {
    console.log('点击我的')
    var gologin = this._needLogin()
    if (gologin) {
      return false
    }
    if (this.route === 'pages/user/index') {
      return false
    }
    wx.navigateTo({
      url: '/pages/user/index'
    })
  },
  _showNeedInvite: function () {
    wx.showModal({title: '您好',content:'隐藏家是国内首个基于微信社交上收藏专业纯享俱乐部。您可以通过已成为俱乐部会员的好友加入我们。感谢您对隐藏家俱乐部的关注！'})
  },
  // 判断没有登录的话，需要登录。
  _needLogin: function () {
    var uid = wx.getStorageSync('uid')
    if (uid == '') {
      console.log('需要登录')
      this.setData({
        showGetUserinfo: true
      })
      return true
    }
    return false
  },
  onLoad: function() {
    var uid = wx.getStorageSync('uid')
    if (uid == '') {
      console.log('用户未登录')
      getOpenidTologin()
      if (app.globalData.needinvite == true) { // 正常流程
        this.setData({
          showGetUserinfo: true
        })
      } else { // 审核流程
        // 不需要提示
      }
    } else {
      this._updateUserinfo().then(res => {
        console.log('更新后的用户信息,', res)
        // 记录当前用户是否已经被邀请。true: 是。 false: 还没被邀请。
        app.globalData.hasinvite = app.globalData.thisuser.inviteuid > 0
        if (app.globalData.needinvite == true) { // 正常流程
          console.log('需要邀请注册后操作')
          // 如果当前用户没有邀请人，但是本次进入是通过邀请进入的
          if (app.globalData.thisuser.inviteuid == null && app.globalData.inviteinfo && app.globalData.inviteinfo.query.uid) {
            this._showReg()
          } else if (app.globalData.thisuser.inviteuid || res.inviteuid){
            console.log('正常已注册用户')
          } else {
            this._showNeedInvite()
          }
        } else { // 如果是审核，不需要邀请。什么都不做。
          console.log('不需要邀请注册后操作')
        }
      })
    }
    if (app.globalData.wxuser) {
      this.setData({
        avatarUrl: app.globalData.wxuser.avatarUrl,
        userInfo: app.globalData.wxuser
      })
    }

    api.getNoticeList().then(res => {
      console.log('公告列表：', res)
      if (res.code === '200') {
        this.setData({
          noticeList: res.result
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    })

    // this._getIndexData()
    // var feed = {}
    // feed.contact = '18767104983'
    // feed.content = '中美最后一轮磋商，A股大涨...也是醉了'
    // api.post('/api/feedback/add', feed).then(function(d) {
    //   console.log('feedback/add 返回值:', d)
    // })
  },
  onShow: function (options) {
    // 进入首页
    console.log('更新 index', options)
    this._getIndexData()
  },
  _getIndexData: function () {
    api.get('/api/index').then(res => {
      console.log('内容列表：', res)
      if (res.code === '200') {
        var d = this._dealData(res.result)
        this.setData({
          itemList: d
        })
        this._dealShareImg()
        this.updateLike() // 更新喜欢的内容
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  updateLike (useLocalData) {
    // 本地存储当前用户喜欢的内容，和收藏的内容id。进行比对更新
    let obj = wx.getStorageSync('likeAndPraise') || ''
    if (obj !== '' && useLocalData === true) {
      this._dealIndexDataOfLike(obj)
    } else {
      api.get('/api/thing/myLikesAndPraises').then(res => {
        if (res.code === '200') {
          console.log('喜欢点赞的id列表：', res)
          wx.setStorageSync('likeAndPraise', res.result)
          this._dealIndexDataOfLike(res.result)
        }
      })
    }
  },
  // 首页列表处理喜欢和点赞的数据
  _dealIndexDataOfLike (obj) {
    let like = obj.likes || []
    let praise = obj.praises || []
    let likeStr = ',' + like.join(',') + ','
    let praiseStr = ',' + praise.join(',') + ','
    let arr = this.data.itemList
    for (var i = arr.length - 1; i >= 0; i--) {
      let tid = ',' + arr[i].tid + ','
      if (likeStr.indexOf(tid) !== -1) {
        arr[i].likeThisThing = true
      }
      if (praiseStr.indexOf(tid) !== -1) {
        arr[i].hasPraise = true
      }
    }
    this.setData({
      itemList: arr
    })
  },
  // 首页列表数据处理
  _dealData: function (arr) {
    var tmp = arr
    for (var i = arr.length - 1; i >= 0; i--) {
      arr[i].showAll = false
      arr[i].likeThisThing = false
      arr[i].hasPraise = false
      arr[i].shareImg = ''
      arr[i].imagesList = arr[i].images.split(';')
    }
    return tmp
  },
  // 显示注册页面。其实是更新用户信息页面
  _showReg: function () {
    // 检查邀请函是否失效。
    var effect = true
    var d = app.globalData.inviteinfo.query.t // 邀请函的失效时间
    var now = (new Date()).getTime() // 当前时间
    if (d && now > d) {
      effect = false
    }
    if (effect) {
      this.setData({
        showReg: true
      })
    } else {
      wx.showModal({title: '您好',content:'此邀请函已失效。您可以请已入住隐藏家俱乐部的好友之间发送邀请函给您，转发无效哦！'})
    }

    // wx.showToast({
    //   icon: 'none',
    //   title: '显示注册',
    // })
  },
  closeUserInfo: function () {
    // 取消显示登录弹框
    this.setData({
      showGetUserinfo: false
    })
  },
  onGetUserInfo: function(e) {
    console.log('e 用户信息按钮', e)
    if (e.detail.userInfo) {
      this.setData({
        // showGetUserinfo: false,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
      // 全局记录微信用户信息
      app.globalData.wxuser = e.detail.userInfo
      wx.setStorageSync('wxuser', e.detail.userInfo)

      // console.log('this.userinfo', this.userInfo)
      var obj = {
        openid: app.globalData.openid,
        wechatheader: this.data.userInfo.avatarUrl,
        wechatnick: this.data.userInfo.nickName
      }
      // console.log('当前用户信息', obj)
      api.post('/api/user/threelogin', obj).then(res => {
        if (res.code === '200') {
          wx.setStorageSync('uid', res.result.uid)
          // 全局记录我们的系统内的微信用户信息
          app.globalData.thisuser = res.result
          wx.setStorageSync('thisuser', res.result)
          console.log('登录结果:', res)
          if (res.result.inviteuid == null && app.globalData.inviteinfo && app.globalData.inviteinfo.query.uid){ // 用户之前没有邀请人，但是本次有邀请人
            this._showReg()
          } else if (res.result.inviteuid == null) { // 用户没有邀请人
            this._showNeedInvite()
          } else {
            console.log('正常已注册用户2')
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: res.message,
          })
        }
        // 取消显示登录弹框
        this.setData({
          showGetUserinfo: false
        })
      })
    }
  },

  onGetOpenid: function(e) {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        console.log('云函数 login, result:', res.result)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  selectCHange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      yearIndex: e.detail.value
    })
  },
  selectCHangeHasShop: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      hasShopIndex: e.detail.value
    })
  },
  selectChangeShopCity: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      shopcityArr: e.detail.value
    })
  },
  bindInputShopname: function(e) {
    this.setData({
      shopName: e.detail.value
    })
  },
  bindInputShopaddr: function(e) {
    this.setData({
      shopAddr: e.detail.value
    })
  },
  bindInputSign: function (e) {
    this.setData({
      personSign: e.detail.value
    })
  },
  // 保存个人信息
  saveUser: function () {
    var obj = {}
    obj.inviteuid = app.globalData.inviteinfo.query.uid
    obj.hasshop = this.data.hasShopIndex == 0 ? 1 : 0 // 是否有店铺
    obj.shopname = this.data.shopName
    obj.experenceyear = this.data.yearArray[this.data.yearIndex]
    obj.personalsign = this.data.personSign // 个性签名
    obj.shopcity = this.data.shopcityArr.join(',') // 店铺城市名称
    obj.shopaddr = this.data.shopAddr // 详细地址
    if (obj.hasshop) {
      if (obj.shopname == '' || obj.shopaddr == '') {
        wx.showToast({
          icon: 'none',
          title: '请填写店铺名称以及地址'
        })
        return false
      }
    }
    console.log('更新的个人信息有', obj)
    api.post('/api/user/invitereg', obj).then(res => {
      if (res.code == '200') {
        wx.showToast({
          icon: 'none',
          title: '注册成功'
        })
        this.setData({
          showReg: false
        })
        this._updateUserinfo()
      } else {
        wx.showToast({
          icon: 'none',
          title: '系统异常，请稍后再试'
        })
      }
    })
  },
  cancelReg () {
    this.setData({
      showReg: false
    })
  },
  // 更新当前用户信息
  _updateUserinfo: function () {
    var uid = wx.getStorageSync('uid')
    if (uid && app.globalData.thisuser.uid) {
      return api.get('/api/user/detail').then(res => {
        console.log('当前用户信息:', res)
        if(res.code == '200') {
          wx.setStorageSync('uid', res.result.uid)
          // 全局记录我们的系统内的微信用户信息
          app.globalData.thisuser = res.result
          wx.setStorageSync('thisuser', res.result)
        }
        return res.result
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this._getIndexData()
  },
  goShare: function (event) {
    console.log('分享')
    var tid = event.currentTarget.dataset.tid
    var idx = event.currentTarget.dataset.idx
    var item = this.data.itemList[idx]
    var name = item.name
    var obj = {}
    obj.path = '/pages/thing/detail?tid=' + tid
    obj.name = name
    obj.img = item.shareImg
    this.setData({
      shareinfo: obj
    })
  },
  // 开始处理商品的分享图片
  _dealShareImg: function () {
    var arr = this.data.itemList
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].shareImg == '') {
        this._gethttpurl(arr[i].imagesList[0], i)
      }
    }
  },
  _gethttpurl: function (fildid, idx) {
    return wx.cloud.getTempFileURL({
      fileList: [{
        fileID: fildid,
        maxAge: 60 * 60, // one hour
      }]
    }).then(res => {
      // get temp file URL
      if (res.fileList[0].status == 0) {
        var img = res.fileList[0].tempFileURL
        console.log('换取地址：', img)
        this.setData({
         ['itemList[' + idx + '].shareImg']: img
        })
      } else {
        return ''
      }
    }).catch(error => {
      // handle error
      console.log('换取地址失败：', error)
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    console.log(options)
    if (options.from == 'button') {
      var target = options.target.dataset
      var idx = target.idx
      var item = this.data.itemList[idx]
      var title = item.name
      var img = item.shareImg
      var path = '/pages/thing/detail?tid=' + target.tid
      console.log('分享所需的img', img)
      return {
        title: title,
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
    } else {
      return {
        title: '隐藏家',
        path: '/pages/index/index'
      }
    }
  }
})


function getOpenidTologin () {
  wx.cloud.callFunction({
    name: 'login',
    data: {},
    success: res => {
      console.log('[云函数] [login] user openid: ', res.result.openid)
      app.globalData.openid = res.result.openid
      console.log('云函数 login, result:', res.result)
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
      getOpenidTologin()
    }
  })
}
