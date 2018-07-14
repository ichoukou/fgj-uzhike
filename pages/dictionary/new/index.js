const { $Message } = require('../../../components/base/index');
import { InserRef } from '../../../api/dictionary/dictionary.js';
import _fgj from '../../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['启用', '禁用', '编辑'],
    index: 0,
    params: {
      RefNameCn: '',  // 引用名称解释名（中文）
      RefName: '',    // 引用名称（英文）
      ItemNo: '',     // 编号（纯数字）
      ItemValue: '',  // 值
      ItemInfo: ''    // 备注信息
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
  // 点击完成
  bindSubmit () {
    let params = this.data.params;
    let verify = this.verifyData(params);   // 验证数据
    if (verify.status) {
      this.insertRef(params);
    } else {
      $Message({ content: verify.msg, type: 'error' });
    }
  },
  // 新建字典
  insertRef (params) {
    wx.showLoading({
      title: '提交中',
    });
    InserRef(params).then(res => {
      console.log(res)
      wx.hideLoading();
      if (res.data.result === 'success') {
        $Message({ content: '新建成功', type: 'success' });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        $Message({ content: verify.msg, type: 'error' });
      }
    })
  },
  // 监听input
  inputChange: function(e) {
    console.log(e.currentTarget.dataset)
    let { type } = e.currentTarget.dataset
    let params = this.data.params;
    params[type] = e.detail.value;
    this.setData({
      params
    })
  },
  // picker选择器绑定事件
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  // 校验数据
  verifyData (data) {
    let result = {
      status: false,
      msg: '错误提示'
    };
    if (!_fgj.verify(data.RefNameCn, 'require')) {
      result.msg = '引用名称解释名不能为空';
      return result;
    };
    if (!_fgj.verify(data.RefName, 'require')) {
      result.msg = '引用名称不能为空';
      return result;
    };
    if (!_fgj.verify(data.ItemNo, 'number-dot')) {
      result.msg = '引用项排序编号只能是纯数字';
      return result;
    };
    if (!_fgj.verify(data.ItemValue, 'require')) {
      result.msg = '引用项值不能为空';
      return result;
    };
    if (!_fgj.verify(data.ItemInfo, 'require')) {
      result.msg = '引用项扩展信息不能为空';
      return result;
    };
    result.status = true;
    result.msg = '验证通过';
    return result;
  }
})