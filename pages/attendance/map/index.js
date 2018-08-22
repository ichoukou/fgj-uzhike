
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lon: '',
    lat: '',
    markers: [{
      
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('...', options)
    this.setData({
      lon: options.lon,
      lat: options.lat,
      markers:[{
        id: 0,
        iconPath: "../../../images/location.png",
        latitude: options.lat,
        longitude: options.lon
      }]
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


})