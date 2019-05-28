// pages/footer/index.js

Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    innerText: {
      type: String,
      value: 'default value',
    }
  },
  data: {
    // 这里是一些组件内部数据
    someData: {}
  },
  methods: {
    // 点击回到首页
    goIndex: function () {
      console.log('点击逛逛', this)
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
      if (this.route === 'pages/user/index') {
        return false
      }
      wx.navigateTo({
        url: '/pages/user/index'
      })
    },
    // 这里是一个自定义方法
    customMethod() {}
  }
})
