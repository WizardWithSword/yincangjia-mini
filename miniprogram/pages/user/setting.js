// pages/user/setting.js
const app = getApp()
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yearArray: [2,3,4,5,6,7,8,9,10,11],
    yearIndex: 0,
    hasShop: false,
    hasShopArray: ['有', '没有'],
    hasShopIndex: 0,
    personSign: '',
    phone: '',
    shopcityArr: [],
    customItem: '其他',
    shopName: '',
    shopAddr: '',
  },
  getPhoneNumber (e) {
    console.log('手机号码回调', e)
    let cloudid = e.detail.cloudID
    if (cloudid == undefined) { // 用户拒绝。
      return false
    }
    let that = this
    wx.cloud.callFunction({
      name: 'getPhoneNumber',
      data: {
        phoneData: wx.cloud.CloudID(cloudid), // 这个 CloudID 值到云函数端会被替换
        obj: {
        }
      },
      success: res => {
        console.log('[云函数] [phone] res: ', res)
        if (res.result) {
          let phone = res.result.phone.phoneNumber
          that.setData({
            phone: phone
          })
        }
      },
      fail: err => {
        console.error('[云函数] [phone] 调用失败', err)
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
    obj.hasshop = this.data.hasShopIndex == 0 ? 1 : 0 // 是否有店铺
    obj.shopname = this.data.shopName
    obj.experenceyear = this.data.yearArray[this.data.yearIndex]
    obj.personalsign = this.data.personSign // 个性签名
    obj.shopcity = this.data.shopcityArr.join(',') // 店铺城市名称
    obj.shopaddr = this.data.shopAddr // 详细地址
    obj.phone = this.data.phone

    if (obj.phone == '') {
      wx.showToast({
        icon: 'none',
        title: '请填写手机号码'
      })
      return false
    }
    if (obj.hasshop) {
      if (obj.shopname == '' || obj.shopaddr == '') {
        wx.showToast({
          icon: 'none',
          title: '请填写店铺名称以及地址'
        })
        return false
      }
    }

    let haschanged = false
    let changekeys = ['phone', 'shopaddr', 'shopcity', 'personalsign', 'shopname', 'experenceyear', 'hasshop']
    for (let i = 0; i< changekeys.length; i++) {
      let tmp = app.globalData.thisuser[changekeys[i]] || ''
      if (tmp != obj[changekeys[i]]) {
        haschanged = true
      }
    }
    if (haschanged === false) {
      wx.showToast({
        icon: 'none',
        title: '暂无信息更新'
      })
      return false
    }
    console.log('更新的个人信息有', obj)
    api.post('/api/user/invitereg', obj).then(res => {
      if (res.code == '200') {
        wx.showToast({
          icon: 'none',
          title: '更新成功'
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '系统异常，请稍后再试'
        })
      }
    })
  },
  // 更新当前用户信息
  _updateUserinfo: function () {
    var uid = wx.getStorageSync('uid')
    if (uid && app.globalData.thisuser.uid) {
      return api.get('/api/user/detail').then(res => {
        console.log('当前用户信息:', res)
        if(res.code == '200') {
          // 全局记录我们的系统内的微信用户信息
          app.globalData.thisuser = res.result
          wx.setStorageSync('thisuser', res.result)
          this.setData({
            phone: res.result.phone || '',
            hasShopIndex: res.result.hasshop == 1 ? 0 : 1,
            shopName: res.result.shopname || '',
            personSign: res.result.personalsign || '',
            shopAddr: res.result.shopaddr || ''
          })
          if (res.result.shopcity) {
            this.setData({
              shopcityArr: res.result.shopcity.split(',')
            })
          } else {
            this.setData({
              shopcityArr: []
            })
          }
          for (var i = 0; i < this.data.yearArray.length; i++) {
            if (this.data.yearArray[i] == res.result.experenceyear) {
              this.setData({
                yearIndex: i
              })
              break
            }
          }
        }
        return res.result
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._updateUserinfo()
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