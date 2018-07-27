
import { GetOpenID, WeChatLoginVerification } from './api/login/login';

App({
    onLaunch: function () {

      this.getCode();

      console.log('App Launch')
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
    // 获取code
    getCode() {
      const _this = this;
      wx.login({
        success(res) {
          if (res.code) {
            console.log(res)
            let data = {
              Code: res.code,
              needpurview: false
            };
            _this.getOpenID(data)
          }
        }
      })
    },
    // 根据code获取openid
    getOpenID(data) {
      GetOpenID(data).then(res => {
        if (res.statusCode === 200) {
          let openID = res.data.openid
          this.globalData.openID = openID
          this.weChatLoginVerification(openID)
        } else {
          $Message({ content: '获取code失败', type: 'error' })
        }
      })
    },
    // 微信openid登录验证
    weChatLoginVerification(openid) {
      WeChatLoginVerification({
        OpenID: openid,
        needpurview: false
      }).then(res => {
        console.log(res)
        let data = res.data
        if (data.result === 'success') {
          // wx.redirectTo({
          //   url: '/pages/index/index?openID=' + this.globalData.openID
          // })
          wx.setStorageSync('token', res.data.Token);
        } else {
          // wx.redirectTo({
          //   url: '/pages/login/index'
          // })
        }
      })
    },
    globalData: {
      hasLogin: false,
      userInfo: null,
      openID: '',
    }
});