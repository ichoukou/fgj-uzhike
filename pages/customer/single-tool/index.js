
import { GetAllReceptionByTel, GetAllDeclareByTel } from '../../../api/customer/single-tool';


Page({
  data: {
    CustTel: '',        // 客户手机号
    receptionData: [],  // 接待数据
    inquiryData: [],    // 接待数据
    tabCut: 0,          // tab切换索引
    isLoading1: false,  // 接待加载中
    isLoading2: false,  // 报备加载中
    onceTime: null,     // 储存定时器
  },
  onLoad: function (options) {
    this.setData({
      CustTel: options.CustTel || ''
    });
  },
  onReady: function () {

  },
  onShow: function () {
    let CustTel = this.data.CustTel;

    this.setData({
      isLoading1: false,
      isLoading2: false
    });
    wx.showLoading({
      title: '加载中'
    });
    this.GetAllReceptionByTel(CustTel);    // 根据电话号码获取所有到访记录
    this.GetAllDeclareByTel(CustTel);      // 根据电话号码获取所有报备记录
  },
  onHide: function () {
  },
  // 没有手机号的时候可以触发搜索
  bindQuery(e) {
    this.data.onceTime ? clearTimeout(this.data.onceTime) : '';
    this.data.onceTime = setTimeout(() => {
      let CustTel = e.detail.value;

      this.GetAllReceptionByTel(CustTel);    // 根据电话号码获取所有到访记录
      this.GetAllDeclareByTel(CustTel);      // 根据电话号码获取所有报备记录
    }, 300);
  },
  // 根据电话号码获取所有到访记录
  GetAllReceptionByTel(CustTel) {
    GetAllReceptionByTel({
      CustTel
    }).then(res => {
      wx.hideLoading();
      if (res.data.result === 'success') {
        this.setData({
          receptionData: res.data.temptable,
          isLoading1: true
        })
      } else {
        this.setData({
          receptionData: [],
          isLoading1: true
        })
      }
    })
  },
  // 根据电话号码获取所有报备记录
  GetAllDeclareByTel(CustTel) {
    GetAllDeclareByTel({
      CustTel: CustTel
    }).then(res => {
      if (res.data.result === 'success') {
        this.setData({
          inquiryData: res.data.temptable,
          isLoading2: true
        })
      } else {
        this.setData({
          inquiryData: [],
          isLoading2: true
        })
      }
    })
  },
  // 列表切换
  bindTabCut(e) {
    let index = Number(e.currentTarget.dataset.index);

    if (index !== this.data.tabCut) {
      this.setData({
        tabCut: index
      });
    }
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


/**
 * 判断工具，主要目的是查看接待详细，和报备详细，
 * 有两个路口可以进入：
 *     第一个是客户列表，需要接收客户手机
 *     第二个是功能路口，没有传客户手机号进来
 * 要判断是否有手机号，有传手机号过来不显示搜索，没有就需要进行搜索
 */