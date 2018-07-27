const { $Message } = require('../../components/base/index');
// import { CheckCookie, GetOpenID, WeChatLoginVerification } from '../../api/login/login.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: ['人事', '行政', '市场', '技术', '总经办', '客服'],
    params: {
      needpurview: false
    },
    openID: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.showLoading({
    //   title: '加载中',
    // })
    // this.checkCookie()
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
  
  // 判断用户登录状态
  checkCookie () {
    CheckCookie(this.data.params).then( res => {
      let data = res.data
      if (data.result === 'success') {
        wx.hideLoading()
        wx.redirectTo({
          url: '/pages/index/index'
        })
      } else {
        this.getCode();
      }
    })
  },
  // 获取code
  getCode () {
    const _this = this;
    wx.login({
      success(res) {
        if(res.code) {
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
  getOpenID (data) {
    GetOpenID(data).then(res => {
      if (res.statusCode === 200) {
        wx.hideLoading();
        this.setData({
          openID: res.data.openid
        })
        this.weChatLoginVerification(res.data.openid)
      } else {
        $Message({ content: '获取code失败', type: 'error' })
        wx.hideLoading();
      }
    })
  },
  // 微信openid登录验证
  weChatLoginVerification(openid) {
    let params = {
      OpenID: openid,
      needpurview: false
    }
    WeChatLoginVerification(params).then( res => {
      console.log(res)
      let data = res.data
      if(data.result === 'success') {
        wx.redirectTo({
          url: '/pages/index/index?openID=' + this.data.openID
        })
      }
    })
  },
  // 跳转到个人注册页面并传参
  goPage2 () {
    wx.navigateTo({
      url: '/pages/login/register/index?openID=' + this.data.openID,
    })
  },
  // 跳转到公司注册页面并传参
  goPage1 () {
    wx.navigateTo({
      url: '/pages/login/create-company/index?openID=' + this.data.openID,
    })
  }
})