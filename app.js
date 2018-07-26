
App({
    onLaunch: function () {
      console.log('App Launch')
      // 获取
      let openid = 'oNJDW5b196dX_rQsm0-S6V-mjEDs';
      let session_key = '+abLnBaU8Mmpwa94yDwOVA==';

      wx.setStorageSync('token', openid + session_key)

      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo

                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          }
        }
      })
    },
    onShow: function () {
        console.log('App Show')
    },
    onHide: function () {
        console.log('App Hide')
    },
    login(callback) {
      
    },
    globalData: {
      hasLogin: false,
      userInfo: null,
    }
});