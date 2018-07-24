
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

    // 修改选中的城市
    prevPage.setData({
      citySelector: data.detail.value
    });
    wx.navigateBack();
  }
})