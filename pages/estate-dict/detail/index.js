// pages/estate-dict/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: 'http://app.vipfgj.com/upfile/20180423/8465CEA278D34DC298FA7B87C7D908A9.jpg',
    swiper: {
      imgUrls: [
        'http://app.vipfgj.com/upfile/20180423/8465CEA278D34DC298FA7B87C7D908A9.jpg',
        'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      ],
      indicatorDots: false,
      autoplay: false,
      interval: 5000,
      duration: 500
    },
    map: {
      controls: [{
        id: 1,
        // iconPath: '/resources/location.png',
        position: {
          left: 0,
          top: 300 - 50,
          width: 50,
          height: 50
        },
        clickable: true
      }],
      markers: '',
      polyline: ''
    }
  },
  onLoad: function (options) {
    
  },
  onReady: function () {
  
  },
  onShow: function () {
  
  },
  controltap(e) {

  },
  controltap(e) {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})