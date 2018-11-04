// pages/user/userInfo.js
Page({
  data: {
    userInfo: {},
  },
  onLoad: function(options) {
    //json数据临时调用
    var that = this
    wx.getStorage({
      key: 'userInfo',
      success: function(e) {
        //console.log(e)
        that.setData({
          userInfo: e.data
        })
      }
    })
  },
  submitdate: function(event) {
    var userInfo = event.detail.value;
    wx.setStorage({
      key: 'userInfo',
      data: userInfo,
      success: function(res) {
        wx.navigateTo({
          url: '../index/index'
        })
      }
    })
  },
  onReady: function() {

  },
  onShow: function() {

  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  }
})