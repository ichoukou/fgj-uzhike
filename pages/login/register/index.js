const { $Message } = require('../../../components/base/index');
import { FileUpLoad } from '../../../api/public';
import _fgj from '../../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePath: '',
    params: ''
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
  // 选择图片并上传
  chooseImage () {
    const _this = this;
    wx.chooseImage({
      count: 1,
      success: function(res) {
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
                tempFilePath: tempFilePaths[0]
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
    console.log(e.currentTarget.dataset)
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
    if (!_fgj.verify(data.RefNameCn, 'require')) {
      result.msg = '引用名称解释名不能为空';
      return result;
    };
    if (!_fgj.verify(data.RefName, 'require')) {
      result.msg = '引用名称不能为空';
      return result;
    };
    if (!_fgj.verify(data.ItemNo, 'require')) {
      result.msg = '引用项排序编号不能为空';
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