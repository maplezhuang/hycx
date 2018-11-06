const app = getApp()
Page({
  data: {

  },
  //事件处理函数
  submitdate: function (event) {
    var userInfo = event.detail.value;
    // 校验
    app.request({
      url: "/wxMatching",
      data: userInfo,
      success: function (res) {
        console.log('code2OpenId', res)
        // wx.hideLoading()
        wx.navigateTo({
          url: '../index/index'
        })
      }
    })

    // wx.setStorage({
    //   key: 'userInfo',
    //   data: userInfo,
    //   success: function (res) {
    //     wx.navigateTo({
    //       url: '../index/index'
    //     })
    //   }
    // })
  }
})