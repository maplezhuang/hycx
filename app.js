//app.js
App({
  clientUrl: 'http://120.76.101.253:8080/gzlx/f/wxApp',  // 链接地址
  globalData: {
    openId: null,
    // 预约车
    map: {
      // 我的位置
      startAddress: '我的位置',
      endAddress: '目的地',
      strLatitude: 0,
      strLongitude: 0,
      endLatitude: 0,
      endLongitude: 0,
    },
    // 首页数据
    index: {
      curIndex: 1
    }
  },
  // ajax封装
  request: function (params) {
    const that = this;
    var host = that.clientUrl;
    console.log("发起请求：" + host + params.url, params);
    wx.request({
      url: host + params.url,
      data: params.data || null,
      method: params.method || 'GET',
      // dataType: "json",
      // header: that.headerPost,
      success: function (res) {
        console.log(res)
        if (res.data && res.statusCode != 200 || res.data.code == 0) {
          console.log('---请求失败（success）---:', res.data);
          wx.showToast({
            icon: 'none',
            title: res.data.msg,
          })
        }else if (typeof params.success == "function") {
          params.success(res);
        }
      },
      fail: function () {
        console.warn('---请求失败（fail）---:' + host + params.url);
        if (typeof params.fail == "function") {
          params.fail();
        }
      },
      complete: function (res) {
        console.log("请求完成：" + host + params.url, params, res);
        if (typeof params.complete == "function") {
          params.complete();
        }
      }
    });
  },
  onLaunch: function () {
    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    // wx.showLoading({
    //   title: '登录中',
    //   mask: true
    // })
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("--登录中--", res);
        if (res.code) {
          const params = {
            code: res.code
          };
          // 自动登录
          that.request({
            url: "/code2OpenId",
            data: params,
            success: function (res) {
              console.log('code2OpenId', res.openId)
              // wx.hideLoading()
            }
          })
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  }
})