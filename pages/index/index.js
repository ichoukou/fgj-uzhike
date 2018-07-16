const bmap = require('../../utils/bmap-wx.min.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    city: '',
    weather: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    const _this = this;
    // 新建百度地图对象
    const BMap = new bmap.BMapWX({
      ak: 'DPNFFD2tRQYU2QKH6jwTB5OPxuC7Ysra'
    });
    // 发起weather请求
    BMap.weather({
      success: function (res) {
        wx.hideLoading();
        let data = res.currentWeather[0];
        _this.setData({
          city: data.currentCity,
          weather: data.date.split('：')[1].split(')')[0]
        })
      },
      fail: function (res) {
        wx.hideLoading();
        console.log(res)
      }
    })
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
  // 切换样式
  changeStyle (e) {
    this.setData({
      num: e.target.dataset.num
    })
  }
})