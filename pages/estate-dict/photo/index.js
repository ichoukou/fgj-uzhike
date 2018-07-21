// pages/estate-dict/photo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoData: [
      {
        path: 'http://bpic.588ku.com/back_pic/05/14/68/2559a7c01c90133.jpg!r650/fw/800',
        title: '鸟瞰图',
        desc: '图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述图片文字描述',
        open: false
      }, {
        path: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        title: '鸟瞰图',
        desc: '图片文字描述',
        open: false
      }, {
        path: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
        title: '鸟瞰图',
        desc: '图片文字描述',
        open: false
      }
    ],
    isOpenText: false,    // 是否打开显示更多文字
    current: 0,
    summ: 0,
  },
  onLoad: function (options) {
    this.setData({
      summ: this.data.photoData.length
    })
  },
  onReady: function () {
  
  },
  onShow: function () {
  
  },
  // 是否打开显示更多文字
  bindOpenText(e) {
    let { index } = e.currentTarget.dataset;
    let photoData = this.data.photoData;

    photoData[index].open = !photoData[index].open;

    this.setData({
      photoData
    })
  },
  // current 改变时会触发 change 事件
  bindChangeSwiper(e) {
    console.log(e)
    let { current } = e.detail;

    this.setData({
      current
    })
  },
})