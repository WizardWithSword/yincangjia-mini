// pages/footer/index.js
const api = require('../../utils/api.js')
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    item: {
      type: Object,
      value: {},
    },
    clicktype: {
      type: String,
      value: 'detail',
    }
  },
  ready() {
    // console.log('card: item', this.data.item)
  },
  data: {
    // 这里是一些组件内部数据
    someData: {}
  },
  methods: {
    showAll: function (event) {
      console.log('show all')
      this.setData({
        ['item.showAll']: true
      })
      return false
    },
    // 点击删除藏品
    goDelete (event) {
      wx.showModal({
        title: '是否删除？',
        success: res => {
          console.log('res', res)
          if (res.confirm) {
            console.log('删除')
            let tid = event.currentTarget.dataset.tid
            let data = {
              isdelete: 1,
              tid: tid
            }
            api.post('/api/thing/delete', data).then(d => {
              console.log('/thing/delete 返回值', d)
              if (d.code == '200') {
                wx.showToast({
                  title: '删除成功'
                })
                this.triggerEvent('deletething', {tid: tid})
              } else {
                wx.showToast({
                  icon: 'none',
                  title: d.message
                })
              }
            })
          }
        }
      })
    },
    // 点击前往编辑
    goEdit (event) {
      var id = event.currentTarget.dataset.tid
      wx.navigateTo({
        url: '/pages/thing/add?tid=' + id
      })
    },
    // 点击前往商品详情
    goDetail: function (event) {
      var id = event.currentTarget.dataset.tid
      console.log('点击', event)
      wx.navigateTo({
        url: '/pages/thing/detail?tid=' + id
      })
      return false
    },
    // 点击大拇指点赞
    goPraise: function (event) {
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
           ['itemList[' + idx + '].praisenum']: num
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
    }
  }
})
