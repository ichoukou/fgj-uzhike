// pages/authorize/index.js
const { $Message } = require('../../components/base/index');
import { GetOpenID, WeChatLoginVerification } from '../../api/login/login';

const app = getApp()

Page({
  data: {
  
  },
  onLoad: function (options) {
  },
  // 获取用户信息
  bindGetUserInfo(e) {
    let { userInfo } = e.detail;

    userInfo ? app.globalData.userInfo = userInfo: '';
    
    // this.getCode();
  },
  // 获取code
  getCode() {
    const _this = this;

    wx.showLoading({
      title: '正在登录',
    });
    wx.login({
      success(res) {
        console.log(res)
        if (res.code) {
          console.log(res)
          let data = {
            Code: res.code,
            needpurview: false
          };
          _this.getOpenID(data)
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  // 根据code获取openid
  getOpenID(data) {
    GetOpenID(data).then(res => {
      if (res.statusCode === 200) {
        let openID = res.data.openid
        app.globalData.openID = openID
        this.weChatLoginVerification(openID)
      } else {
        $Message({ content: '获取code失败', type: 'error' });
        wx.hideLoading();
      }
    })
  },
  // 微信openid登录验证
  weChatLoginVerification(openid) {
    WeChatLoginVerification({
      OpenID: openid,
      needpurview: false
    }).then(res => {
      // console.log(res)
      wx.hideLoading();
      let data = res.data
      if (data.result === 'success') {
        wx.setStorageSync('token', res.data.Token);
        
        $Message({ content: '登陆成功', type: 'success' });

        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        $Message({ content: '登陆失败', type: 'error' });
      }
    })
  },
})