
Page({
  data: {
    adjust: false,
    tempFilePath: '',
    keyboardHeight: 0,    // 键盘高度
    typeLine: 0,
    typeItemWidth: 180
  },
  onLoad: function (options) {
    
  },
  onReady: function () {
    this.recorderManager = wx.getRecorderManager();
    this.innerAudioContext = wx.createInnerAudioContext();
  },
  onShow: function () {
    
  },
  bindTypeItem(e) {
    let left = e.currentTarget.dataset.index * (this.data.typeItemWidth + 1)
    console.log(left)
    this.setData({
      typeLine: left
    })
  },
  // 输入框同步输入
  bindinputText(e) {
    this.setData({
      text: e.detail.value
    })
  },
  // 输入框聚焦时触发
  bindfocusText(e) {
    // let height = e.detail.height || '';
    // let keyboardHeight = height

    this.setData({
      keyboardHeight: e.detail.height || 0
    });
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.screenHeight)
        console.log(res.windowHeight)
      }
    })
  },
  // 输入框失去焦点时触发
  bindblurText(e) {
    this.setData({
      keyboardHeight: 0
    });
  },
  // 开始录音
  bindRecordStart() {
    this.recorderManager.start({
      duration: 60000,
    });
    this.recorderManager.onStart(() => {
      console.log('开始录音')
    });
  },
  // 结束录音
  bindRecordStop() {
    this.recorderManager.stop();
    this.recorderManager.onStop((data) => {
      this.setData({
        tempFilePath: data.tempFilePath
      });
    });
    this.recorderManager.onError((err) => {
      console.log(err)
    });
  },
  // 播放
  audioPlay() {
    this.innerAudioContext.src = this.data.tempFilePath;
    this.innerAudioContext.play();
    this.innerAudioContext.onPlay(() => {
      console.log('开始播放')
    });
    this.innerAudioContext.onEnded(() => {
      console.log('播放结束')
    });
    this.innerAudioContext.onError((res) => {
      console.log(res.errMsg)
    });
  }
})