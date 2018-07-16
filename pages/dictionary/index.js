
const { $Message } = require('../../components/base/index');
import { UpRef, GetAllRef } from '../../api/dictionary/dictionary.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: {
      // page: 1,
      // pagerows: '',
      // likestr: ''
    },
    RefName: '',
    listData: []
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
    this.getListData();
  },
  // 跳转新建字典页面
  bindNew() {
    wx.navigateTo({
      url: './new/index'
    })
  },
  // 显示可操作菜单列表
  bindActionSheet (e) {
    const _this = this;
    let itemList = ['作废'];
    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        if(res.tapIndex === 0) {
          let refId = e.currentTarget.dataset.refId;
          let params = {
            RefID: refId,
            FlagDeleted: 1
          };
          _this.deleteRef(params);
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  // 分页获取所有字典数据
  getListData () {
    wx.showLoading({
      title: '加载中',
    })
    GetAllRef(this.data.params).then(res => {
      console.log('data', res.data)
      let data = res.data
      if(data.result === 'success') {
        this.setData({
          listData: data.temptable
        })
      } else {
        $Message({ content: data.msg, type: 'warning'})
        this.setData({
          listData: ''
        })
      }
      wx.hideLoading();
    })
  },
  // 监听搜索输入框
  changeInput (e) {
    let { type } = e.currentTarget.dataset
    let params = this.data.params;
    params[type] = e.detail.value;
    this.setData({
      params
    });
  },
  // 搜索
  bindSearch () {
    this.getListData()
  },
  // 作废
  deleteRef (params) {
    const _this = this
    UpRef(params).then(res => {
      if(res.data.result === 'success') {
        wx.showModal({
          title: '操作提示',
          content: '作废之后无法恢复，确定吗？',
          success: function (res) {
            if (res.confirm) {
              $Message({ content: '刪除成功', type: 'success' })
              _this.getListData();
            } else if (res.cancel) {
              // console.log('用户点击取消')
            }
          }
        })
      }
    })
  }
})