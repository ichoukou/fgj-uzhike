const { $Message } = require('../../../components/base/index');
import { UpPassWord, UpInfoValidate } from '../../../api/login/register.js';
import _fgj from '../../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSend: false,
    times: 30,
    timer: null,
    params: {
      // purview: false,
      ValiNum: '',  //验证码
      Tel: '',      //手机号
      Password: '',  // 新密码
      Password2: ''  //确认密码
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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

  // 确定
  submit() {
    let data = this.data.params
    let result = this.verifyData(data)
    let { Tel, ValiNum, Password } = this.data.params
    let params = { Tel, ValiNum, Password }
    if(result.status) {
      this.upPassword(params)
    } else {
      $Message({ content: result.msg, type: 'error' })
    }
  },
  // 修改密码
  upPassword (params) {
    UpPassWord(params).then(res => {
      console.log(res)
      let data = res.data
      if(data.result === 'success') {
        $Message({ content: '修改成功', type: 'success' })
        setTimeout(() => {
          wx.navigateBack();
        }, 1500)
      } else {
        $Message({ content: data.msg, type: 'error' })
      }
    })
  },
  // 监听input
  inputChange: function (e) {
    let { type } = e.currentTarget.dataset
    let params = this.data.params;
    params[type] = e.detail.value;
    this.setData({
      params
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
      UpInfoValidate(params).then(res => {
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
    if (!_fgj.verify(data.Password2, 'require')) {
      result.msg = '请再次输入密码';
      return result;
    };
    if (data.Password !== data.Password2) {
      result.msg = '两次输入密码不一致';
      return result;
    }
    result.status = true;
    result.msg = '验证通过';
    return result;
  }
})