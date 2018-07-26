const { $Message } = require('../../../components/base/index');
import { FileUpLoad } from '../../../api/public';
import { RegEmployee, RegEmployeeValidate } from '../../../api/login/register.js';
import _fgj from '../../../utils/util.js';

// 获取应用实例
const app = getApp()
Page({
  data: {
    isSend: false,
    times: 30,
    timer: null,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    params: {
      needpurview: false,
      CNO: '',       // 公司码
      ValiNum: '',   // 验证码
      OpenID: '',    // 微信openid
      EmpName: '',   // 姓名
      WXName: '',    // 微信昵称
      Password: '',  // 密码
      Tel: '',       // 手机号码
      EmpImg: ''     // 头像
    },
    EmpImg: '',
    WXName: '',
    Tel: '',
    OpenID: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      OpenID: options.openID
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        EmpImg: app.globalData.userInfo.avatarUrl,
        WXName: app.globalData.userInfo.nickName
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          EmpImg: res.userInfo.avatarUrl,
          WXName: res.userInfo.nickName
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            EmpImg: res.userInfo.avatarUrl,
            WXName: res.userInfo.nickName
          })
        }
      })
    }
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
    // this.getUserInfo()
  },
  // 获取userInfo
  getUserInfo(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 选择图片并上传
  chooseImage() {
    const _this = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log(res)
        let tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: '图片加载中',
        })
        wx.uploadFile({
          url: FileUpLoad,
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res) {
            wx.hideLoading();
            let data = JSON.parse(res.data)
            if (data.result === 'success') {
              console.log(res)
              _this.setData({
                EmpImg: tempFilePaths[0]
              })
              $Message({ content: '上传成功', type: 'success' });
            } else {
              $Message({ content: '上传失败', type: 'error' })
            }
          },
          fail: function (err) {
            $Message({ content: '网络错误' + err, type: 'error' })
          }
        })
      }
    })
  },
  // 监听input
  inputChange: function (e) {
    if(e.currentTarget.dataset.type === 'Tel') {
      this.setData({
        Tel: e.detail.value
      })
    };
    let { type } = e.currentTarget.dataset
    let params = this.data.params;
    params[type] = e.detail.value;
    this.setData({
      params
    })
  },
  // 立即注册事件
  register() {
    let params = this.data.params;
    let verify = this.verifyData(params);   // 验证数据
    if (verify.status) {
      this.regEmployee(params);
    } else {
      $Message({ content: verify.msg, type: 'error' });
    }
  },
  // 注册
  regEmployee(params) {
    wx.showLoading({
      title: '提交中',
    });
    let { OpenID, WXName, EmpImg } = this.data
    let data = Object.assign({}, params, { OpenID, WXName, EmpImg });
    console.log(data)
    RegEmployee(params).then(res => {
      console.log(res)
      wx.hideLoading();
      if (res.data.result === 'success') {
        $Message({ content: '注册成功', type: 'success' });
        setTimeout(() => {
          wx.navigateTo({
            url: '../entry/index',
          })
        }, 1500);
      } else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },
  // 获取验证码
  getValiNum () {
    let params = {
      needpurview: false,
      Tel: this.data.Tel
    }
    if (!_fgj.verify(params.Tel, 'require')) {
      $Message({ content: '请输入手机号码', type: 'error' });
    } else if (!_fgj.verify(params.Tel, 'phone')) {
      $Message({ content: '请输入正确的手机号码', type: 'error' });
    } else {
      RegEmployeeValidate(params).then(res => {
        let data = res.data
        if (data.result === 'success') {
          if (this.data.isSend) {
            return
          }
          this.setData({
            isSend: true
          })
          let num = this.data.times
          this.count(num)
        } else {
          $Message({ content: data.msg, type: 'error' })
        }
      })
    }
  },
  // 倒计时
  count(num) {
    this.data.timer = setTimeout(() => {
      this.count(num)
    }, 1000)
    if(num <= 1) {
      clearTimeout(this.data.timer)
      this.setData({
        times: 30,
        isSend: false
      })
    } else {
      num --;
      this.setData({
        times: num
      })
    }
    
  },
  // 校验数据
  verifyData(data) {
    let result = {
      status: false,
      msg: '错误提示'
    };
    if (!_fgj.verify(data.CNO, 'require')) {
      result.msg = '请输入公司码';
      return result;
    };
    if (!_fgj.verify(data.EmpName, 'require')) {
      result.msg = '请输入姓名';
      return result;
    };
    if (!_fgj.verify(data.Tel, 'require')) {
      result.msg = '请输入手机号码';
      return result;
    };
    if (!_fgj.verify(data.Tel, 'phone')) {
      result.msg = '请输入正确的手机号码';
      return result;
    };
    if (!_fgj.verify(data.ValiNum, 'require')) {
      result.msg = '请输入验证码';
      return result;
    };
    if (!_fgj.verify(data.Password, 'require')) {
      result.msg = '请输入密码';
      return result;
    };
    result.status = true;
    result.msg = '验证通过';
    return result;
  }
})