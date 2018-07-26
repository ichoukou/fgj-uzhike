const { $Message } = require('../../../components/base/index');
import { GetDefaultDepartment } from '../../../api/organizational/department.js';
import { UpCompanyStep } from '../../../api/login/register.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    checked: [],
    CID: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      CID: options.CID
    })
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
    this.getDefaultDepartment()
  },
  // 绑定checkbox事件
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({
      checked: e.detail.value
    })
  },
  // 获取默认组织架构
  getDefaultDepartment () {
    wx.showLoading({
      title: '加载中',
    })
    let params = { needpurview: false };
    GetDefaultDepartment(params).then(res => {
      let data = res.data
      if(data.reslut === 'success') {
        this.setData({
          listData: data.tempTable
        })
      } else {
        $Message({ content: '网络错误', type: 'error'})
      }
      wx.hideLoading()
    })
  },
  // 完成
  complete () {
    let data = {
      CID: this.data.CID,
      Step: 1,
      needpurview: false
    }
    UpCompanyStep(data).then(res => {
      let data = res.data
      if(data.result === 'success') {
        setTimeout(() => {
          wx.navigateTo({
            url: '../add-workspace/index',
          })
        }, 1500)
      } else {
        $Message({ content: data.msg, type: 'error'})
        // setTimeout(() => {
        //   wx.navigateTo({
        //     url: '../add-workspace/index',
        //   })
        // }, 1500)
      }
    })
  }
})