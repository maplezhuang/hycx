var QQMapWX = require('../../libs/qqmap-wx-jssdk.js'); //导入需要使用的包，创建一个libs文件夹
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
    mapHeight: 0,
    currentData: 0,
    scale: 20,
    userInfo: {},
    cType: 0,
    isGoBtn: false,
    isGotoBackBtn: false,
    carXx: '呼叫司机',
    carXx2: '预约车辆',
    curIndex: 0,
    startDate: "请选择日期",
    multiArray: [
      ['今天', '明天', '后天'],
      [0, 1, 2, 3, 4, 5, 6],
      [0, 10, 20]
    ],
    multiIndex: [0, 0, 0],
  },
  onLoad: function(options) {
    //console.log('onLoad',app.globalData);
    var that = this;
    let sID = options.sID;
    let sLat = options.slat;
    let sLng = options.slng;
    let sAddress = options.sbluraddress;
    // let sAddress = options.saddress;
    if (sID == '1') {
      app.globalData.map.startLatitude = sLat;
      app.globalData.map.startLongitude = sLng;
      app.globalData.map.startAddress = sAddress;
      // app.globalData.map.startAddress = sAddress;
      that.setData({
        globalMapData: app.globalData.map
      });
    }
    if (sID == '2') {
      app.globalData.map.endLatitude = sLat;
      app.globalData.map.endLongitude = sLng;
      app.globalData.map.endAddress = sAddress;
    }

    var that = this
    //json数据临时调用
    wx.getStorage({
      key: 'userInfo',
      success: function(e) {
        setTimeout(function() {
          var query = wx.createSelectorQuery();
          query.select('#xContent').boundingClientRect()
          query.exec(function(e) {
            that.setData({
              mapHeight: wx.getSystemInfoSync().windowHeight - e[0].height - 43
            });
          })
        }, 100)
        that.setData({
          userInfo: e.data
        })
      }
    })
    // 如果全局有经纬度
    if (app.globalData.map.startLatitude && app.globalData.map.startLongitude) {
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
                  // markers: [{
                  //   iconPath: "../pages/image/markerStart.png",
                  //   id: 0,
                  //   latitude: e.latitude,
                  //   longitude: e.longitude,
                  //   width: 30,
                  //   height: 44
                  // }],
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
            var query = wx.createSelectorQuery();
            query.select('#xContent').boundingClientRect()
            query.exec(function(e) {
              that.setData({
                mapHeight: wx.getSystemInfoSync().windowHeight - e[0].height - 43
              });
            })
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
    wx.navigateTo({
      url: '/pages/search/search?searchID=' + e.currentTarget.dataset.id,
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
  driving: function() {
    var _this = this;
    var urls = 'https://apis.map.qq.com/ws/direction/v1/driving/?from=39.989221,116.306076&to=39.828050,116.436195&key=' + qqmapsdk.key

    console.log(urls)
    //网络请求设置
    var opt = {
      url: urls,
      method: 'GET',
      dataType: 'json',
      //请求成功回调
      success: function(res) {
        var ret = res.data
        if (ret.status != 0) return; //服务异常处理
        var coors = ret.result.routes[0].polyline,
          pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({
            latitude: coors[i],
            longitude: coors[i + 1]
          })
        }
        //设置polyline属性，将路线显示出来
        _this.setData({
          polyline: [{
            points: pl,
            color: '#FF0000DD',
            width: 2
          }]
        })
      }
    };
    wx.request(opt);
  },
  gogo: function(e) {
    // console.log(e);
    // this.driving();
  },
  tabMenu: function(e) {
    var that = this
    setTimeout(function() {
      var query = wx.createSelectorQuery();
      query.select('#xContent').boundingClientRect()
      query.exec(function(e) {
        that.setData({
          mapHeight: wx.getSystemInfoSync().windowHeight - e[0].height - 43
        });
      })
    }, 100)
    this.setData({
      curIndex: e.target.dataset.id,
      isGoBtn: false,
      isGotoBackBtn: false
    });
  },
  cTypeTap: function(e) {
    this.setData({
      cType: e.target.dataset.id,
    });
  },
  goToBack: function() {
    var that = this
    setTimeout(function() {
      var query = wx.createSelectorQuery();
      query.select('#xContent').boundingClientRect()
      query.exec(function(e) {
        that.setData({
          mapHeight: wx.getSystemInfoSync().windowHeight - e[0].height - 43
        });
      })
    }, 100)
    this.setData({
      isGoBtn: false,
      isGotoBackBtn: false
    });
  },
  pickerTap: function() {
    date = new Date();
    var monthDay = ['今天', '明天', '后天'];
    var hours = [];
    var minute = [];
    currentHours = date.getHours();
    currentMinute = date.getMinutes();
    // 月-日
    for (var i = 3; i <= 2; i++) {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + i);
      var md = (date1.getMonth() + 1) + "-" + date1.getDate();
      monthDay.push(md);
    }
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
      for (var i = currentHours + 1; i < 24; i++) {
        hours.push(i);
      }
      for (var i = 0; i < 60; i += 10) {
        minute.push(i);
      }
    } else {
      for (var i = currentHours; i < 24; i++) {
        hours.push(i);
      }
      for (var i = minuteIndex; i < 60; i += 10) {
        minute.push(i);
      }
    }
  },
  loadHoursMinute: function(hours, minute) {
    for (var i = 0; i < 24; i++) {
      hours.push(i);
    }
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
      for (var i = currentHours + 1; i < 24; i++) {
        hours.push(i);
      }
    } else {
      for (var i = currentHours; i < 24; i++) {
        hours.push(i);
      }
    }
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