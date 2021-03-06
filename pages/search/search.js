var QQMapWX = require('../../libs/qqmap-wx-jssdk.js'); //导入需要使用的包，创建一个libs文件夹
var qqmapsdk;
qqmapsdk = new QQMapWX({
  key: 'Q6IBZ-QHNR2-XOGUX-C7C7F-R3JV7-OUB67' //申请自己的开发者密钥
});

const app = getApp()

Page({
  data: {
    SearchValue: '',
    SearchAddress:[],
    sID:'',
    cID:'', 
    ctypeID:''
  },
  onLoad: function(options) {
    let sIDn = options.searchID;
    let cIDn = options.curIndex;
    let ctypeIDn = options.ctypeid
    this.setData({
      sID: sIDn,
      cID: cIDn,
      ctypeID: ctypeIDn
    })
    //console.log(cIDn)
    this.nearby_search();
  },
  searchValueInput: function(e) {
    var sValue = e.detail.value;
    var _this = this; 
    // 调用接口
    qqmapsdk.search({
      keyword: sValue,  //搜索关键词
      success: function (e) { //搜索成功后的回调
        //console.log(e.data)
        var isAddress = []
        for (var i = 0; i < e.data.length; i++) {
          isAddress.push({ // 获取返回结果，放到数组中
            title: e.data[i].title,
            id: e.data[i].id,
            latitude: e.data[i].location.lat,
            longitude: e.data[i].location.lng,
            address: e.data[i].address
          })
        }
        _this.setData({ //将搜索结果显示
          SearchAddress: isAddress,
        })
      },
      fail: function (e) {
        //console.log(e);
      }
    });
  },
  toValue: function(e){
    var ssid = this.data.sID
    var sslat = e.currentTarget.dataset.latitude
    var sslng = e.currentTarget.dataset.longitude
    var ssbluraddress = e.currentTarget.dataset.title
    var ssaddress = e.currentTarget.dataset.address
    app.globalData.index.curIndex = this.data.cID;
    //console.log(ssid)
    wx.navigateTo({
      url: '/pages/index/index?sID=' + ssid + '&ctypeID=' + this.data.ctypeID + '&cID=' + this.data.cID + '&slat=' + sslat + '&slng=' + sslng + '&sbluraddress=' + ssbluraddress + '&saddress=' + ssaddress
    })
  },
  //附近地点信息展示
  nearby_search: function () {
    var _this = this;
    // 调用接口
    qqmapsdk.search({
      keyword: '车站,机场,酒店',  //搜索关键词
      success: function (res) { //搜索成功后的回调
        //console.log(res.data)
        var mks = []
        for (var i = 0; i < res.data.length; i++) {
          mks.push({ // 获取返回结果，放到mks数组中
            title: res.data[i].title,
            id: res.data[i].id,
            address: res.data[i].address,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng,
          })
        }
        //console.log(mks);
        _this.setData({ //设置markers属性，将搜索结果显示在地图中
          SearchAddress: mks
        })
      },
      fail: function (res) {
        //console.log(res);
      },
      complete: function (res) {
        //console.log(res);
      }
    });
  }
})