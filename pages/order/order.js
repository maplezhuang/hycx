const app = getApp()
var jsonData = require('../../utils/util.js')

Page({
  data: {
    isClose: false, //true
    oID:'',
  },
  orderInfo: function (e) {
    var oid = e.currentTarget.dataset.name;
    this.setData({
      oID: oid,
      isClose: true
    });
  },
  // 阻止冒泡
  catchBind() {
    //不干嘛就阻止冒泡
    console.log('事件冒泡阻止');
  },
  clickClose: function (e) {
    this.setData({
      isClose: false
    });
  },
  // 取消订单
  cancelOrder() {
    this.clickClose();
    this.getOrderList();
  },
  // 获取订单列表
  getOrderList() {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      dataList: jsonData.dataList
    });
    setTimeout(() => {
      wx.hideLoading();
    },1000)
  },
  

  // 页面默认事件
  onLoad: function(options) {
    this.getOrderList();
  }
})