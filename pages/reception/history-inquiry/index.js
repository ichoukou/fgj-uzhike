
const { $Message } = require('../../../components/base/index');
import { GetAllReceptionUnion } from '../../../api/reception/history-inquiry';
import { SendReceptionMsg } from '../../../api/reception/inform';
import _fgj from '../../../utils/util';

Page({
  data: {
    ProjectReceptionID: '',   // 接待id
    listData: [],             // 列表数据
    loading: false,           // 是否加载完毕
    isShowMore: false,        // 是否显示更多
    isDisabled: false,        // 防止重复发送
  },
  onLoad: function (options) {
    this.data.ProjectReceptionID = options.ProjectReceptionID || '4F3719F5FDA542CE8C6E9F7A9781BBC0';
    this.GetAllReceptionUnion();    // 获取数据
  },
  onReady: function () {
  
  },
  onShow: function () {
    // 页面返回的时候，没有数据再去获取
    setTimeout(() => {
      if (!this.data.listData.length) {
        this.GetAllReceptionUnion();    // 获取数据
      }
    }, 300);
  },
  // 获取数据
  GetAllReceptionUnion() {
    this.setData({
      loading: false
    });
    GetAllReceptionUnion({
      ProjectReceptionID: this.data.ProjectReceptionID
    }).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable;

        this.filterData(data);    // 处理数据
        
        this.setData({
          listData: data,
          loading: true
        });
      } else {
        this.setData({
          listData: [],
          loading: true
        });
      }
    });
  },
  // 处理数据
  filterData(data) {
    let date = new Date().getDate();
    let isShowMore = false;
    let isOne = false;

    data.forEach(item => {
      if (new Date(item.RegDate).getDate() === date) {
        item.isSendMsg = true;      // 可以发送通知
        isShowMore = true;
      } else {
        item.isHide = true;
        isOne = true;       // 这个决定是不能发送通知的信息
      }
    });

    // 如果有可发送通知的记录，就隐藏不能发送通知的记录
    if (isShowMore && isOne) {
      this.setData({
        isShowMore: true
      });
    }
  },
  // 显示更多历史报备
  bindMore() {
    let listData = this.data.listData;

    listData.forEach(item => {
      item.isHide = false
    });

    this.setData({
      listData,
      isShowMore: false
    });
  },
  // 发送通知
  bindSendInform(e) {
    let item = e.currentTarget.dataset.item;
    let params = {
      YProjectReceptionID: item.ProjectReceptionUnionID
    };
    this.SendReceptionMsg(params);
  },
  // 发送约访通知接口，这里只有约访
  SendReceptionMsg(params) {
    // 防止重复发送
    if (this.data.isDisabled) {
      return false
    }
    this.data.isDisabled = true;
    wx.showLoading({
      title: '发送中'
    });
    SendReceptionMsg(params).then(res => {
      wx.hideLoading();
      this.data.isDisabled = false;
      if (res.data.result === 'success') {
        $Message({ content: '发送成功', type: 'success' });
      } else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    });
  },
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})