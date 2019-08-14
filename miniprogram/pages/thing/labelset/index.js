// pages/thing/add.js
const api = require('../../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAllEra: true,
    showAllCate: true,
    eraArray: [{"id":"0","value":"未知"},{"id":"10","value":"汉"},{"id":"20","value":"秦"},{"id":"30","value":"宋"},{"id":"40","value":"唐"},{"id":"50","value":"明"},{"id":"60","value":"明清"},{"id":"70","value":"清"},{"id":"80","value":"战国"},{"id":"90","value":"春秋战国"},{"id":"100","value":"秦汉"},{"id":"110","value":"魏晋"},{"id":"120","value":"夏商周"},{"id":"130","value":"南北朝"},{"id":"140","value":"隋唐"},{"id":"150","value":"五代十国"},{"id":"160","value":"北宋"},{"id":"170","value":"南宋"},{"id":"180","value":"辽金"},{"id":"190","value":"旧石器"},{"id":"200","value":"新石器"},{"id":"210","value":"夏"},{"id":"220","value":"商"},{"id":"230","value":"周"},{"id":"240","value":"春秋"},{"id":"250","value":"民国"},{"id":"260","value":"当代"}],
    eraIndex: 0,
    cateArray: [{"id":"0","value":"其他"},{"id":"10","value":"石器"},{"id":"20","value":"玉器"},{"id":"30","value":"陶器"},{"id":"40","value":"铜器"},{"id":"50","value":"书画"},{"id":"60","value":"木器"},{"id":"70","value":"石刻"},{"id":"80","value":"瓷器"},{"id":"90","value":"杂项"},{"id":"100","value":"铁器"},{"id":"110","value":"金属器"},{"id":"120","value":"牙膏器"},{"id":"130","value":"丝织品"},{"id":"140","value":"砖瓦"},{"id":"150","value":"印章"},{"id":"160","value":"徽章"},{"id":"170","value":"舆图"},{"id":"180","value":"珠宝"}],
    cateIndex: 0,
    intergrityArray: [{"id":"0","value":"未知"},{"id":"10","value":"全品"},{"id":"20","value":"瑕疵"},{"id":"30","value":"残品"}],
    intergrityIndex: 0,
    chooseCate: {"id":"0","value":"其他"},
    chooseEra: {"id":"0","value":"未知"},
    chooseInterg: {"id":"0","value":"未知"}
  },
  showAllEraToggle () {
    this.setData({
      showAllEra: !this.data.showAllEra
    })
  },
  showAllCateToggle () {
    this.setData({
      showAllCate: !this.data.showAllCate
    })
  },
  setChoose (cate, era, interg) {
    this.setData({
      chooseCate: cate,
      chooseEra: era,
      chooseInterg: interg
    })
  },
  chooseOne (event) {
    var choose = event.currentTarget.dataset
    console.log('choose one', choose)
    switch (choose.type) {
      case 'cate':
      this.setData({
        chooseCate: {
          id: choose.id,
          value: choose.value
        }
      })
      break
      case 'era':
      this.setData({
        chooseEra: {
          id: choose.id,
          value: choose.value
        }
      })
      break
      case 'interg':
      this.setData({
        chooseInterg: {
          id: choose.id,
          value: choose.value
        }
      })
      break
    }
  },

  // 保存草稿
  save: function () {
    var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
    // var currentPage = pages[pages.length - 1]  // 获取当前页面
    var prevPage = pages[pages.length - 2]    //获取上一个页面
    // 设置上一个页面的数据（可以修改，也可以新增）
    prevPage.setData({
      chooseCate: this.data.chooseCate,
      chooseEra: this.data.chooseEra,
      chooseInterg: this.data.chooseInterg
    })
    this._back()
  },

  _back: function () {
    wx.navigateBack()
  },

  _computedIdx: function (obj) {
    var eraid = 0
    var cateid = 0
    var intergid = 0
    console.log('obj相关', obj.era, obj.category, obj.intergrity)
    for (var key1 = 0; key1 < this.data.eraArray.length; key1++) {
      if (this.data.eraArray[key1].id == obj.era) {
        eraid = key1
        this.setData({
          chooseEra: this.data.eraArray[key1]
        })
        break
      }
    }
    for (var key2 = 0; key2 < this.data.cateArray.length; key2++) {
      if (this.data.cateArray[key2].id == obj.category) {
        cateid = key2
        this.setData({
          chooseCate: this.data.cateArray[key2]
        })
        break
      }
    }
    for (let key3 in this.data.intergrityArray) {
      if (this.data.intergrityArray[key3].id == obj.intergrity) {
        intergid = key3
        this.setData({
          chooseInterg: this.data.intergrityArray[key3]
        })
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
    var chooseObj = JSON.parse(options.choose)
    this.setData({
      chooseCate: chooseObj.chooseCate,
      chooseEra: chooseObj.chooseEra,
      chooseInterg: chooseObj.chooseInterg
    })
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