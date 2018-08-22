
const { $Message } = require('../../../components/base/index');
import { $wuxBackdrop } from '../../../components/index';
import { GetCustPage } from '../../../api/customer/list.js';

Page({
  data: {
    tabNum: 1,        // 切换购房和买房
    animationData1: '',
    animationData2: '',
    followShow: true,
    params: {       // 筛选项
      page: 1,
    },
    isPlayAudio: false,   // 是否播放语音
    isOpenFollow: false,
  },
  onLoad: function (options) {
  },
  onReady: function () {
    this.$wuxBackdrop = $wuxBackdrop('#wux-backdrop', this);
    this.screenMore = this.selectComponent('#screenMore');
  },
  onShow: function () {
    this.GetCustPage();
  },
  // 获取客户分页数据
  GetCustPage() {
    GetCustPage(this.data.params).then(res => {
      console.log(res)
    })
  },
  // 搜索
  bindQuery() {

  },
  // 打开更多筛选
  bindOpenScreen() {
    this.screenMore.show();
    this.setData({
      screenOpen: false
    });
    this.releaseBackdrop();
  },
  // 更多筛选，重置
  bindScreenReset(data) {
    console.log(data)
  },
  // 更多筛选，确定
  bindScreenConfirm(data) {
    console.log(data)
  },
  // 保持遮罩
  retainBackdrop() {
    this.$wuxBackdrop.retain()
  },
  // 释放遮罩
  releaseBackdrop() {
    this.$wuxBackdrop.release()
  },
  // 点击遮罩
  bindBackdrop() {
    this.releaseBackdrop();
    this.setData({
      screenOpen: false
    });
  },
  /**
   * 客户跟进操作
   */
  // 播放跟进语音
  bindPlayAudio() {
    this.setData({
      isPlayAudio: !this.data.isPlayAudio
    });
  },
  // 切换 购房/租房
  buyOrRent(e) {
    this.setData({
      tabNum: e.target.dataset.tabnum
    })
  },
  // 添加客户
  addCustomer() {
    wx.navigateTo({
      url: '../new/index',
    })
  },
  // 详细页
  goDetail () {
  },
  // 显示跟进详细卡片
  bindShowFollow() {
    this.setData({
      isOpenFollow: true
    })
  },
  // 显示跟进详细卡片
  bindCloseFollow() {
    this.setData({
      isOpenFollow: false
    })
  }
})