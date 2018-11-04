Page({
  data: {

  },
  //事件处理函数111
  submitdate: function (event) {
    var userInfo = event.detail.value;
    wx.setStorage({
      key: 'userInfo',
      data: userInfo,
      success: function (res) {
        wx.navigateTo({
          url: '../index/index'
        })
      }
    })
  }
})