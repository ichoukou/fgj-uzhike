

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [
      { name: 'USA', value: '人事' },
      { name: 'CHN', value: '行政' },
      { name: 'BRA', value: '市场', checked: 'true' },
      { name: 'JPN', value: '技术' },
      { name: 'ENG', value: '总经办' },
      { name: 'TUR', value: '客服' },
    ]
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

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  }
})