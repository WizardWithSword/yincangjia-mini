// miniprogram/pages/museum/preview.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navNow: 'all',
    thingCate: [{
      id: 10,
      name: '石器',
      count: 20,
      things: [{
        name: '',
        img: ''
      }]
    }, {
      id: 11,
      name: '玉器',
      count: 3,
      things: [{
        name: '',
        img: ''
      }]
    }],
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
    thisCateThingList: [],
    thinglist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var all = wx.getStorageSync('previewThings')
    this.setData({
      thinglist: all
    })
    this._computedThings()
    if (options.cate) {
      this.setData({
        navNow: options.cate
      })
      this._reRenderThing()
    }
  },
  _computedThings: function () {
    const cateCount = {}
    const cateImg = {}
    const thingsArr = {}
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
      if (thingsArr[c] === undefined) {
        thingsArr[c] = []
      }
      thingsArr[c].push(arr[i])
    }
    var newFormatData = []
    for (let key in cateCount) {
      let obj = {}
      obj.id = key
      obj.name = this.data.cateName[key]
      obj.img = cateImg[key]
      obj.count = cateCount[key]
      obj.things = thingsArr[key] || []
      newFormatData.push(obj)
    }
    console.log('新的数据格式：', newFormatData)
    this.setData({
      thingCate: newFormatData
    })
  },
  clickNav: function (e) {
    const n = e.currentTarget.dataset.cate
    this.setData({
      navNow: n
    })
    this._reRenderThing()
  },
  scroll: function (e) {
    console.log('滚动了')
  },
  // 重新计算需要显示的内容。
  _reRenderThing () {
    if (this.data.navNow === 'all') {
      console.log('显示全部')
    } else {
      var list = []
      const arr = this.data.thingCate
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == this.data.navNow) {
          list = arr[i].things
        }
      }
      this.setData({
        thisCateThingList: list
      })
    }
  },
  // 前往藏品详情页面
  goDetail(e) {
    var tid = e.currentTarget.dataset.tid
    console.log('前往藏品详情', tid)
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