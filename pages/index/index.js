var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
qqmapsdk = new QQMapWX({
  key: 'Q6IBZ-QHNR2-XOGUX-C7C7F-R3JV7-OUB67' //申请自己的开发者密钥
});

const app = getApp()
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
    userInfo: {},
    cType: 0,
    isGoBtn: false,
    isGotoBackBtn: false,
    carXx: '呼叫司机',
    carXx2: '预约车辆',

    startDate: "请选择日期",
    multiArray: [
      ['今天', '明天', '后天'],
      [0, 1, 2, 3, 4, 5, 6],
      [0, 10, 20]
    ],
    multiIndex: [0, 0, 0],
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
  //-----------选取时间----------
  bindTimeChange: function(e) {
    console.log(data);
    console.log(currentHours);
    console.log(currentMinute);
  },
  // -------------默认页面时间 -------------
  onLoad: function(options) {
    var that = this;
    let sID = options.sID;
    let sLat = options.slat;
    let sLng = options.slng;
    let sAddress = options.sbluraddress;
    let CID = options.cID;
    // console.log(CID)

    if (sID == '1') {
      console.log(sLat, sLng, sAddress)
      app.globalData.map.startLatitude = sLat;
      app.globalData.map.startLongitude = sLng;
      app.globalData.map.startAddress = sAddress;
      this.setData({
        globalMapData: app.globalData.map,
        curIndex: app.globalData.index.curIndex
      });
      // console.log(globalMapData.map.startLatitude, globalMapData.map.startLongitude,)
    }
    if (sID == '2') {
      console.log(sLat, sLng, sAddress)
      app.globalData.map.endLatitude = sLat;
      app.globalData.map.endLongitude = sLng;
      app.globalData.map.endAddress = sAddress;
      this.setData({
        globalMapData: app.globalData.map,
        curIndex: app.globalData.index.curIndex
      });
    }

    // if(sID == '1' || sID == '2'){
    //   this.setData({
    //     globalMapData: app.globalData.map,
    //     curIndex: app.globalData.index.curIndex
    //   });
    // }

    //json数据临时调用
    wx.getStorage({
      key: 'userInfo',
      success: function(e) {
        //var that = this;
        var query = wx.createSelectorQuery();
        query.select('#xContent').boundingClientRect()
        query.exec(function (e) {
          setTimeout(() => {
            that.setData({
              mapHeight: (wx.getSystemInfoSync().windowHeight - e[0].height - 42) || 0
            });
          }, 200)
        })
        that.setData({
          userInfo: e.data
        })
      }
    })
    // 如果全局有经纬度
    if (app.globalData.map.startLatitude && app.globalData.map.startLongitude) {
      var query = wx.createSelectorQuery();
      query.select('#xContent').boundingClientRect()
      query.exec(function (e) {
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
          type: 'gcj02',
          success: (e) => {
            app.globalData.map.startLatitude = e.latitude;
            app.globalData.map.startLongitude = e.longitude;
            qqmapsdk.reverseGeocoder({
              location: {
                latitude: e.latitude,
                longitude: e.longitude
              },
              success: function(res) {
                //console.log(res);
                app.globalData.map.startAddress = res.result.address;
                that.setData({
                  markers: [{
                    iconPath: "/pages/image/markerStart.png",
                    id: 0,
                    latitude: e.latitude,
                    longitude: e.longitude,
                    width: 30,
                    height: 44
                  }],
                  globalMapData: app.globalData.map,
                });
              },
              fail: function(e) {
                //console.log(e);
              },
              complete: function(e) {
                //console.log(e);
              }
            });
          }
        }),
        wx.getSystemInfo({
          success: (e) => {
            if (this.data.curIndex == '1' || this.data.curIndex == '0') {
              var query = wx.createSelectorQuery();
              query.select('#xContent').boundingClientRect()
              query.exec(function (e) {
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
    //console.log('onReady',app.globalData);
    this.mapCtx = wx.createMapContext("xMap");
  },
  goToPage: function(e) {
    wx.navigateTo({
      url: '../order/order'
    })
  },
  goToSearch: function(e) {
    //console.log(e.currentTarget.dataset.curindex)
    wx.navigateTo({
      url: '/pages/search/search?searchID=' + e.currentTarget.dataset.id + '&curIndex=' + e.currentTarget.dataset.curindex
    })
  },
  goToUI: function(e) {
    wx.navigateTo({
      url: '/pages/user/userInfo?uname=' + e.currentTarget.dataset.un + '&uphone=' + e.currentTarget.dataset.up
    })
  },
  // 设置地图中心点
  bindregionchange: function(e) {
    var that = this
    this.mapCtx.getCenterLocation({
      success: function(e) {
        app.globalData.latitude = e.latitude
        app.globalData.longitude = e.longitude
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: e.latitude,
            longitude: e.longitude,
          },
          success: function(e) {
            app.globalData.map.startAddress = e.result.formatted_addresses.recommend
            app.globalData.map.startLatitude = e.result.location.lat
            app.globalData.map.startLongitude = e.result.location.lng
            that.setData({
              globalMapData: app.globalData.map
            });
          }
        })
      }
    })
  },
  moveToLocation: function() {
    this.mapCtx.moveToLocation()
  },
  gogo: function(e) {

  },
  tabMenu: function(e) {
    var that = this
    if (e.target.dataset.id == '1'){
      setTimeout(function () {
        var query = wx.createSelectorQuery();
        query.select('#xContent').boundingClientRect()
        query.exec(function (e) {
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
    if (e.target.dataset.id == '1' || e.target.dataset.id == '0') {
      var that = this;
      setTimeout(function () {
        var query = wx.createSelectorQuery();
        query.select('#xContent').boundingClientRect()
        query.exec(function (e) {
          that.setData({
            mapHeight: (wx.getSystemInfoSync().windowHeight - e[0].height - 42) || 0
          });
        })
      }, 100)
    }
    this.setData({
      cType: e.target.dataset.id,
    });
  },
  goToBack: function() {
    var that = this
    setTimeout(function () {
      var query = wx.createSelectorQuery();
      query.select('#xContent').boundingClientRect()
      query.exec(function (e) {
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
  // setHeight: function () {
  //   var that = this;
  //   var query = wx.createSelectorQuery();
  //   query.select('#xContent').boundingClientRect()
  //   query.exec(function (e) {
  //     console.log(e[0].height)
  //     setTimeout(() => {
  //       that.setData({
  //         mapHeight: (wx.getSystemInfoSync().windowHeight - e[0].height - 42) || 0
  //       });
  //     }, 100)
  //   })
  // },
  //--------时间----------
  pickerTap: function() {
    date = new Date();
    var monthDay = ['今天', '明天', '后天'];
    var hours = [];
    var minute = [];

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

    if (monthDay === "今天") {
      var month = date.getMonth() + 1;
      var day = date.getDate();
      monthDay = month + "月" + day + "日";
    } else if (monthDay === "明天") {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + 1);
      monthDay = (date1.getMonth() + 1) + "月" + date1.getDate() + "日";

    } else if (monthDay === "后天") {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + 2);
      monthDay = (date1.getMonth() + 1) + "月" + date1.getDate() + "日";
    }

    var startDate = monthDay + " " + hours + ":" + minute;
    that.setData({
      startDate: startDate
    })
  },
})