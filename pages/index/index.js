const app = getApp()

var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
qqmapsdk = new QQMapWX({
  key: 'Q6IBZ-QHNR2-XOGUX-C7C7F-R3JV7-OUB67' //申请自己的开发者密钥
});

var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();

Page({
  data: {
    globalMapData: app.globalData.map,
    // 共享车 
    shareCar: {
      startIndex: null,
      startAddress: '取车点',
      endAddress: '还车点',
      phone: ''
    },
    shareShopData: [{
      id: 0,
      name: '广汽丰田海珠店',
      label: '广汽丰田海珠店',
    }, {
      id: 1,
      name: '广汽丰田海珠店',
      label: '广汽丰田海珠店',
    }, {
      id: 2,
      name: '广汽丰田海珠店',
      label: '广汽丰田海珠店',
    }],
    curIndex: 1,
    mapHeight: 0,
    currentData: 0,
    scale: 20,
    latitude: 0,
    longitude: 0,
    address: '',
    bluraddress: '',
    userInfo: {},
    cType: 0,
    isGoBtn: false,
    isGotoBackBtn: false,
    carXx: '呼叫司机',
    carXx2: '预约车辆',
    TimeDifference: '',
    startDate: "请选择日期",
    startMonthDay: '',
    startHM: '',
    endMonthDay: '',
    endHM: '',
    multiArray: [
      ['今天', '明天', '后天'],
      [0, 1, 2, 3, 4, 5, 6],
      [0, 10, 20]
    ],
    multiIndex: [0, 0, 0],
    constD: '0',
    constH: '0',
    constM: '0',
  },
  // -------------默认页面时间 -------------
  onLoad: function(options) {
    var that = this;
    let sID = options.sID;
    let ctypeID = options.ctypeID
    let sLat = options.slat;
    let sLng = options.slng;
    let sAddress = options.sbluraddress;
    let CID = options.cID;
    //console.log(sID)

    if (sID == '1') {
      app.globalData.map.strLatitude = sLat;
      app.globalData.map.strLongitude = sLng;
      app.globalData.map.startAddress = sAddress;
      this.setData({
        latitude: sLat,
        longitude: sLng,
        globalMapData: app.globalData.map,
        curIndex: app.globalData.index.curIndex,
        cType: ctypeID
      });
    }
    if (sID == '2') {
      app.globalData.map.endLatitude = sLat;
      app.globalData.map.endLongitude = sLng;
      app.globalData.map.endAddress = sAddress;
      this.setData({
        latitude: sLat,
        longitude: sLng,
        globalMapData: app.globalData.map,
        curIndex: app.globalData.index.curIndex,
        cType: ctypeID
      });
    }

    //json数据临时调用
    wx.getStorage({
      key: 'userInfo',
      success: function(e) {
        that.setData({
          userInfo: e.data
        })
      }
    })
    //如果全局有目的地经纬度
    if (app.globalData.map.endLatitude && app.globalData.map.endLatitude) {
      var that = this;
      that.setData({
        isGoBtn: true,
        isGotoBackBtn: true
      })
      var query = wx.createSelectorQuery();
      query.select('#xContent').boundingClientRect()
      query.exec(function (e) {
        //console.log(this.data.mapHeight);
        setTimeout(() => {
          that.setData({
            mapHeight: (wx.getSystemInfoSync().windowHeight - e[0].height - 42) || 0
          });
        }, 100)
      })
    }
    // 如果全局有经纬度
    if (app.globalData.map.strLatitude && app.globalData.map.strLongitude) {
      var query = wx.createSelectorQuery();
      query.select('#xContent').boundingClientRect()
      query.exec(function(e) {
        setTimeout(() => {
          that.setData({
            mapHeight: (wx.getSystemInfoSync().windowHeight - e[0].height - 42) || 0
          });
        }, 100)
      })
      that.setData({
        globalMapData: app.globalData.map
      });
    } else {
      //获取位置信息
      wx.getLocation({
          type: "gcj02",
          success: (res) => {
            this.setData({
              longitude: res.longitude,
              latitude: res.latitude
            })
            var that = this;
            qqmapsdk.reverseGeocoder({
              location: {
                latitude: res.latitude,
                longitude: res.longitude,
              },
              success: function(res) {
                app.globalData.location = location
                app.globalData.map.startAddress = res.result.formatted_addresses.recommend;
                that.setData({
                  address: res.result.address,
                  bluraddress: res.result.formatted_addresses.recommend,
                  globalMapData: app.globalData.map
                });
              },
            });
          }
        }),
        wx.getSystemInfo({
          success: (e) => {
            if (this.data.curIndex == '1' || this.data.curIndex == '2') {
              var query = wx.createSelectorQuery();
              query.select('#xContent').boundingClientRect()
              query.exec(function(e) {
                setTimeout(() => {
                  that.setData({
                    mapHeight: (wx.getSystemInfoSync().windowHeight - e[0].height - 42) || 0
                  });
                }, 200)
              })
            }
          }
        })
    }
    
  },
  onReady: function() {
    this.mapCtx = wx.createMapContext("xMap");
  },
  onShow:function(){
    
  },
  //------------- 共享汽车 -----------------
  // 取车点
  shareStartShop(item) {
    var that = this;
    that.data.shareCar.startAddress = that.data.shareShopData[parseInt(item.detail.value)].name
    this.setData({
      shareCar: that.data.shareCar
    })
  },
  // 还车点
  shareEndShop(item) {
    var that = this;
    that.data.shareCar.endAddress = that.data.shareShopData[parseInt(item.detail.value)].name
    this.setData({
      shareCar: that.data.shareCar
    })
  },

  //-----------点击跳转类----------
  goToPage: function(e) {
    //跳转订单页面
    wx.navigateTo({
      url: '../order/order'
    })
  },
  goToSearch: function(e) {
    //跳转地址搜索页面
    //console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/search/search?searchID=' + e.currentTarget.dataset.id + '&curIndex=' + e.currentTarget.dataset.curindex + '&ctypeid=' + this.data.cType
    })
  },
  goToUI: function(e) {
    //跳转用户详情页面
    wx.navigateTo({
      url: '/pages/user/userInfo?uname=' + e.currentTarget.dataset.un + '&uphone=' + e.currentTarget.dataset.up
    })
  },
  tabMenu: function(e) {
    //顶部菜单点击
    var that = this
    if (e.target.dataset.id == '1') {
      setTimeout(function() {
        var query = wx.createSelectorQuery();
        query.select('#xContent').boundingClientRect()
        query.exec(function(e) {
          that.setData({
            mapHeight: (wx.getSystemInfoSync().windowHeight - e[0].height - 42) || 0
          });
        })
      }, 100)
    }
    this.setData({
      curIndex: e.target.dataset.id,
      isGoBtn: false,
      isGotoBackBtn: false,
      globalData: app.globalData
    })
  },
  cTypeTap: function(e) {
    //实时与预约点击
    if (e.target.dataset.id == '1' || e.target.dataset.id == '0') {
      var that = this;
      setTimeout(function() {
        var query = wx.createSelectorQuery();
        query.select('#xContent').boundingClientRect()
        query.exec(function(e) {
          that.setData({
            mapHeight: (wx.getSystemInfoSync().windowHeight - e[0].height - 42) || 0
          });
        })
      }, 100)
    }
    this.setData({
      cType: e.target.dataset.id,
      isGoBtn: false,
    });
  },
  goToBack: function() {
    //地图左侧点击返回
    var that = this
    setTimeout(function() {
      var query = wx.createSelectorQuery();
      query.select('#xContent').boundingClientRect()
      query.exec(function(e) {
        that.setData({
          mapHeight: (wx.getSystemInfoSync().windowHeight - e[0].height - 42) || 0
        });
      })
    }, 100)
    this.setData({
      isGoBtn: false,
      isGotoBackBtn: false
    });
  },
  gogo: function(e) {

  },
  //-----------map设置----------
  //移动选点
  bindregionchange: function(e) {
    var that = this
    this.mapCtx.getCenterLocation({
      success: function(res) {
        app.globalData.strLatitude = res.latitude
        app.globalData.strLongitude = res.longitude
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude,
          },
          success: function(res) {
            app.globalData.map.startAddress = res.result.formatted_addresses.recommend;
            that.setData({
              address: res.result.address,
              bluraddress: res.result.formatted_addresses.recommend,
              globalMapData: app.globalData.map
            });
          },
        });
      }
    })
  },
  //左下点击回到当前定位
  moveToLocation: function() {
    this.mapCtx.moveToLocation()
  },

  //--------时间选择器----------
  pickerTap: function() {
    date = new Date();
    var monthDay = ['今天', '明天', '后天'];
    var hours = [];
    var minute = [];

    var daye = date.getDate();
    var monthe = date.getMonth() + 1;

    currentHours = date.getHours();
    currentMinute = date.getMinutes();

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    if (data.multiIndex[0] === 0) {
      if (data.multiIndex[1] === 0) {
        this.loadData(hours, minute);
      } else {
        this.loadMinute(hours, minute);
      }
    } else {
      this.loadHoursMinute(hours, minute);
    }
    data.multiArray[0] = monthDay;
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;
    this.setData(data);
  },
  bindMultiPickerColumnChange: function(e) {
    date = new Date();
    var that = this;
    var monthDay = ['今天', '明天', '后天'];
    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    // 把选择的对应值赋值给 multiIndex
    data.multiIndex[e.detail.column] = e.detail.value;
    // 然后再判断当前改变的是哪一列,如果是第1列改变
    if (e.detail.column === 0) {
      // 如果第一列滚动到第一行
      if (e.detail.value === 0) {
        that.loadData(hours, minute);
      } else {
        that.loadHoursMinute(hours, minute);
      }
      data.multiIndex[1] = 0;
      data.multiIndex[2] = 0;
      // 如果是第2列改变
    } else if (e.detail.column === 1) {
      // 如果第一列为今天
      if (data.multiIndex[0] === 0) {
        if (e.detail.value === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }
        // 第一列不为今天
      } else {
        that.loadHoursMinute(hours, minute);
      }
      data.multiIndex[2] = 0;
      // 如果是第3列改变
    } else {
      // 如果第一列为'今天'
      if (data.multiIndex[0] === 0) {
        // 如果第一列为 '今天'并且第二列为当前时间
        if (data.multiIndex[1] === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }
      } else {
        that.loadHoursMinute(hours, minute);
      }
    }
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;
    this.setData(data);
  },
  loadData: function(hours, minute) {
    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
      minuteIndex = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
      minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
      minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
      minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
      minuteIndex = 50;
    } else {
      minuteIndex = 60;
    }
    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
        //--------今天去除已经过去的时间----------
        if (i > 8 && i < 21) {
          hours.push(i);
        }
      }
      // 分
      for (var i = 0; i < 60; i += 10) {
        minute.push(i);
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        if (i > 8 && i < 21) {
          hours.push(i);
        }
      }
      // 分
      for (var i = minuteIndex; i < 60; i += 10) {
        minute.push(i);
      }
    }
  },
  loadHoursMinute: function(hours, minute) {
    // 时
    for (var i = 0; i < 24; i++) {
      if (i > 8 && i < 21) {
        hours.push(i);
      }
    }
    // 分
    for (var i = 0; i < 60; i += 10) {
      minute.push(i);
    }
  },
  loadMinute: function(hours, minute) {
    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
      minuteIndex = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
      minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
      minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
      minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
      minuteIndex = 50;
    } else {
      minuteIndex = 60;
    }
    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
        if (i > 8 && i < 21) {
          hours.push(i);
        }
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        if (i > 8 && i < 21) {
          hours.push(i);
        }
      }
    }
    // 分
    for (var i = 0; i < 60; i += 10) {
      minute.push(i);
    }
  },
  bindStartMultiPickerChange: function(e) {
    var that = this;
    var monthDay = that.data.multiArray[0][e.detail.value[0]];
    var hours = that.data.multiArray[1][e.detail.value[1]];
    var minute = that.data.multiArray[2][e.detail.value[2]];

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var day1 = date.getDate() + 1;
    var day2 = date.getDate() + 2;

    if (monthDay === "今天") {
      monthDay = that.formattingTime(month) + "月" + that.formattingTime(day) + "日";
    } else if (monthDay === "明天") {
      monthDay = that.formattingTime(month) + "月" + that.formattingTime(day1) + "日";
    } else if (monthDay === "后天") {
      monthDay = that.formattingTime(month) + "月" + that.formattingTime(day2) + "日";
    }

    var timeSelector = e.target.dataset.name;
    if (timeSelector == 'YYC') {
      var startDate = monthDay + " " + that.formattingTime(hours) + ":" + that.formattingTime(minute);
      that.setData({
        startDate: startDate,
      })
    }
    if (timeSelector == 'startGXC') {
      var startMonthDay = monthDay;
      var startHM = that.formattingTime(hours) + ":" + that.formattingTime(minute);
      that.setData({
        startMonthDay: startMonthDay,
        startHM: startHM,
      })
    }
    if (timeSelector == 'endtGXC') {
      var endMonthDay = monthDay;
      var endHM = that.formattingTime(hours) + ":" + that.formattingTime(minute);
      that.setData({
        endMonthDay: endMonthDay,
        endHM: endHM,
      })
      that.sjc();
    }

  },
  formattingTime: function(e) {
    if (e < 10) {
      e = '0' + e
      return e
    } else {
      return e
    }
  },
  isToast: function() {
    if (this.data.startMonthDay == '' && this.data.startHM == '') {
      wx.showToast({
        title: '请先选择开始时间',
        icon: 'none',
        duration: 1500
      })
    }
  },
  // 计算时间差
  sjc: function() {
    //获取开始时间
    var str = date.getFullYear() + ' ' + this.data.startMonthDay + this.data.startHM;
    var sdata = str.replace(/[\u4e00-\u9fa5]|\s+|\:+/g, ",");
    var arr = [];
    for (var i = 0; i < 5; i++) {
      arr.push((sdata.split(","))[i])
    }
    var arrS = arr[0] + '/' + arr[1] + '/' + arr[2] + ' ' + arr[3] + ':' + arr[4];

    //获取结束时间
    var str2 = date.getFullYear() + ' ' + this.data.endMonthDay + this.data.endHM;
    var sdata2 = str2.replace(/[\u4e00-\u9fa5]|\s+|\:+/g, ",");
    var arr2 = [];
    for (var i = 0; i < 5; i++) {
      arr2.push((sdata2.split(","))[i])
    }

    var arrS2 = arr2[0] + '/' + arr2[1] + '/' + arr2[2] + ' ' + arr2[3] + ':' + arr2[4];
    var that = this
    var t1 = new Date(arrS)
    var t2 = new Date(arrS2)
    var t = new Date(t2 - t1 + 16 * 3600 * 1000)

    that.setData({
      constD: parseInt(t.getTime() / 1000 / 3600 / 24),
      constH: t.getHours(),
      constM: t.getMinutes(),
    })
  }
})