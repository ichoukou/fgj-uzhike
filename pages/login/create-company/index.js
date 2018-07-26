const { $Message } = require('../../../components/base/index');
import { FileUpLoad } from '../../../api/public';
import { RegCompany, RegCompanyValidate, GetCityIDByName } from '../../../api/login/register.js';
import _fgj from '../../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSend: false,
    times: 30,
    timer: null,
    region: ['江西省', '南昌市', '高新区'],
    companyType: ['开发商', '分销商', '个体'],
    index: 0,
    cardType: ['身份证', '营业执照'],
    cardIndex: 0,
    params: {
      needpurview: false,		
      EmpName: '',		 // 名称
      Tel: '',	       // 电话
      PassWord: '',		 // 密码
      EmpImg: '',      // 用户头像
      OpenID: '',      // 微信openid
      ValiNum: '',     // 验证码
      CityID: '',      // 城市id
      CName: '',       // 公司全称
      CShortName: '',	 // 公司简称
      CertType: '',    // 证件类型
      CertNO: '',      // 证件号码
      Address: ''      // 公司地址
    },
    EmpImg: '',
    CityID: '',
    OpenID: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      OpenID: options.openID
    })
    this.getCityIDByName()
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
  // 立即创建
  create () {
    wx.showLoading({
      title: '加载中',
    });
    // this.getCityIDByName()
    let { region, companyType, cardType, index, cardIndex, EmpImg, CityID, OpenID } = this.data;
    let params = this.data.params;
    let data = Object.assign({}, params, {
      Address: region,
      CertType: cardType[cardIndex],
      CityID,
      EmpImg,
      OpenID
    });
    let verify = this.verifyData(params)
    if (verify.status) {
      this.regCompany(data)
    } else {
      wx.hideLoading();
      $Message({ content: verify.msg, type: 'error'})   
    }
  },
  // 注册公司
  regCompany (data) {
    RegCompany(data).then(res => {
      console.log(res)
      if (res.data.result === 'success') {
        let cid = res.data.CID
        $Message({ content: '创建成功', type: 'success' });
        setTimeout(() => {
          wx.navigateTo({
            url: '../organization/index?CID=' + cid,
          })
        }, 1500);
      } else {
        $Message({ content: res.data.msg, type: 'error' });
      }
      wx.hideLoading();
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
      RegCompanyValidate(params).then(res => {
        let data = res.data
        if (data.result === 'success') {
          console.log(data.result)
          if (this.data.isSend) {
            return
          }
          this.setData({
            isSend: true
          })
          let num = this.data.times
          this.count(num)
        } else {
          console.log(data.msg)
        }
      })
    }
  },
  // 倒计时
  count(num) {
    // let timer = this.data.timer
    console.log(num)
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
  // 选择地区
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
    this.getCityIDByName()
  },
  // 选择公司类型
  bindTypeChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  // 选择证件类型
  bindCardChange: function (e) {
    this.setData({
      cardIndex: e.detail.value
    })
  },
  // 根据城市名匹配城市id
  getCityIDByName() {
    wx.showLoading({
      title: '加载中',
    });
    let data = {
      CityName: this.data.region[1],
      needpurview: false
    }
    GetCityIDByName(data).then(res => {
      let data = res.data
      if(data.result === 'success') {
        this.setData({
          CityID: data.CityID
        })
      }
      wx.hideLoading();
    })
  },
  // 监听input事件
  inputChange(e) {
    let { type } = e.currentTarget.dataset
    let params = this.data.params;
    params[type] = e.detail.value;
    this.setData({
      params
    })
  },
  // 校验数据
  verifyData(data) {
    let result = {
      status: false,
      msg: '错误提示'
    };
    if (!_fgj.verify(data.CName, 'require')) {
      result.msg = '请输入公司名称';
      return result;
    };
    if (!_fgj.verify(data.EmpName, 'require')) {
      result.msg = '请输入姓名';
      return result;
    };
    if (!_fgj.verify(data.Tel, 'require')) {
      result.msg = '请输入电话';
      return result;
    };
    if (!_fgj.verify(data.Tel, 'phone')) {
      result.msg = '请输入正确的电话号码';
      return result;
    };
    if (!_fgj.verify(data.ValiNum, 'require')) {
      result.msg = '请输入验证码';
      return result;
    };
    if (!_fgj.verify(data.PassWord, 'require')) {
      result.msg = '请输入密码';
      return result;
    };
    result.status = true;
    result.msg = '验证通过';
    return result;
  }
})