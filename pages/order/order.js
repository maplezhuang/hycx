const app = getApp()
var jsonData = require('../../utils/util.js')

Page({
  data: {
    isClose: false, //true
    oID:'',
  },
  onLoad: function(options) {
    this.setData({
      dataList: jsonData.dataList
    });
  },
  orderInfo: function (e) {
    var oid = e.currentTarget.dataset.name;
    this.setData({
      oID: oid,
      isClose: true
    });
  },
  clickClose: function (e) {
    this.setData({
      isClose: false
    });
  }
})