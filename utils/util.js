// 本地模拟json数据
var json = [{
  "orderId": "1",
  "orderN": "网约车",
  "state": '预约中', //0未完成，1已取消，2完成
  "cName": "薛之谦",
  "cNum": "粤A10000",
  "cPhone": "10000",
  "cDdm": "A00001",
  "uName": "大张伟",
  "uPhone": "10010",
  "uDdm": "C00001",
  "createTime": '2018-11-03 10:00',
  "endTime": '2018-11-03 12:00',
  "sAdd": "深圳北站",
  "eAdd": "深圳大鹏城",
  "sMileage": "10",
  "eMileage": "110",
  "EstimatedCost": "330",
  "rent": "1000"
}, {
  "orderId": "2",
  "orderN": "共享车",
  "state": '已完成', //0未完成，1已取消，2完成
  "cName": "薛之谦2",
  "cNum": "粤A10001",
  "cPhone": "10001",
  "cDdm": "A00002",
  "uName": "大张伟2",
  "uPhone": "10011",
  "uDdm": "C00002",
  "createTime": '2018-11-03 12:00',
  "endTime": '2018-11-03 14:00',
  "sAdd": "深圳大鹏城",
  "eAdd": "深圳北站",
  "sMileage": "110",
  "eMileage": "210",
  "EstimatedCost": "430",
  "rent": "1200"
}]
/*
 * 对外暴露接口
 */
module.exports = {
  dataList: json,
}