const { $Message } = require('../../../components/base/index');
import { MobileLoginVerification, MobileValiVerification } from '../../../api/login/login.js';
import { RegEmployeeValidate } from '../../../api/login/register.js';
import _fgj from '../../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSend: false,
    times: 30,
    timer: null,
    tabNum: 1,
    params: {
      needpurview: false,
      Tel: '',          // 手机号
      Password: '',     // 密码 
      ValiNum: ''       // 验证码
    },
    Tel: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
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
  // 切换登录方式
  changeStyle (e) {
    if(e.target.dataset.tabnum) {
      this.setData({
        tabNum: e.target.dataset.tabnum
      })
    }
  },
  // 监听input事件
  inputChange (e) {
    let { type } = e.currentTarget.dataset
    let params = this.data.params;
    params[type] = e.detail.value;
    this.setData({
      params
    })
  },
  // 登录
  login () {
    let params = this.data.params;
    let verify = this.verifyData(params);   // 验证数据
    if (verify.status) {
      if (this.data.tabNum == 1) {
        this.mobileLoginVerification(params);
      } else {
        this.mobileValiVerification(params);
      }
    } else {
      $Message({ content: verify.msg, type: 'error' });
    }
  },
  // 手机号登录
  mobileLoginVerification(params) {
    wx.showLoading({
      title: '正在登录',
    });
    MobileLoginVerification(params).then(res => {
      let data = res.data
      if(data.result === 'success') {
        $Message({ content: '登录成功', type: 'success'})
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/index/index',
          })
        }, 1500);
      } else {
        $Message({ content: data.msg, type: 'error' });
      }
      wx.hideLoading();
    })
  },
  // 验证码登录
  mobileValiVerification(params) {
    MobileValiVerification(params).then(res => {
      let data = res.data
      if (data.result === 'success') {
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/index/index',
          })
        }, 1500);
      } else {
        $Message({ content: '验证码错误', type: 'error' });
      }
    })
  },
  // 获取验证码
  getValiNum() {
    let params = {
      needpurview: false,
      Tel: this.data.params.Tel
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
    if (num <= 1) {
      clearTimeout(this.data.timer)
      this.setData({
        times: 30,
        isSend: false
      })
    } else {
      num--;
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
    if (!_fgj.verify(data.Tel, 'require')) {
      result.msg = '请输入手机号';
      return result;
    };
    if (!_fgj.verify(data.Tel, 'phone')) {
      result.msg = '请输入正确的手机号';
      return result;
    };
    if (this.data.tabNum == 1) {
      if (!_fgj.verify(data.Password, 'require')) {
        result.msg = '请输入密码';
        return result;
      };
    } else {
      if (!_fgj.verify(data.ValiNum, 'require')) {
        result.msg = '请输入验证码';
        return result;
      };
    }

    result.status = true;
    result.msg = '验证通过';
    return result;
  }
})