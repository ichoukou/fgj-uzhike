
Page({
  data: {
  },
  onLoad: function (options) {
  },
  onReady: function () {
  },
  onShow: function () {
  },
  // 城市选择组件返回值
  bindCitySelector(data) {
    // console.log(data.detail.value)

    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2]; // 上一个页面
    let paramsCustomer = prevPage.data.paramsCustomer;
    
    paramsCustomer.City = data.detail.value.CityName

    // 修改选中的城市
    prevPage.setData({
      paramsCustomer
    });
    wx.navigateBack();
  }
})