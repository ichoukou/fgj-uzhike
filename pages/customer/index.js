
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabNum: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },
  // 切换 购房/租房
  buyOrRent (e) {
    this.setData({
      tabNum: e.target.dataset.tabnum
    })
  },
  // 添加客户
  addCustomer() {
    wx.navigateTo({
      url: 'new/index',
    })
  },
  // 详细页
  goDetail () {
    wx.navigateTo({
      url: 'detail/index',
    })
  }
})