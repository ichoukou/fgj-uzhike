
import data from '../new/pickerData';
const { $Message } = require('../../../components/base/index');
import { $wuxBackdrop } from '../../../components/index'; 
import { GetFollowToPage, GetFollowByID } from '../../../api/customer/follow-list-all';
import { URL_PATH } from '../../../utils/config';

let screenData = JSON.parse(JSON.stringify(data));
// 处理更多筛选项数据，把 ‘请选择’ 改成 ‘不限’
for (let key of Object.keys(screenData)) {
  if (screenData[key][0].label === '请选择') {
    screenData[key][0].label = '不限';
  }
}

Page({
  data: {
    item: {
      EmpName: '黎聪',
      FollowDate: '2018/8/31 19:24:09',
      FollowContent: '跟进文字内容',
      imageData: ['https://little.vipfgj.com/upfile/20180831/sm_1D6758987B0E47669ED6E175BDE238A8.jpg']
    },
    params: {           // 筛选参数集
      page: 1
    },
    listData: [],
    typeData: screenData.pickerNeedType,
    FlagStatus: screenData.FlagStatus,
    order: [
      {
        label: '不限',
        value: ''
      }, {
        label: '跟进时间倒序',
        value: 'FollowDate-desc'
      }
    ],
    screenOpen: false,   // 是否打开筛选项
    screenIndex: -1,     // 显示哪个筛选项
    screenData: [        // 更多筛选数据
      {
        title: '筛选年龄',
        type: 'Age',
        data: screenData.Age
      }, {
        title: '筛选婚姻状况',
        type: 'Marriage',
        data: screenData.pickerMarriage
      }, {
        title: '筛选子女状况',
        type: 'Children',
        data: screenData.pickerChildren
      }, {
        title: '筛选收入水平',
        type: 'Income',
        data: screenData.pickerIncome
      }, {
        title: '筛选工作职业',
        type: 'Occupation',
        data: screenData.pickerOccupation
      }, {
        title: '筛选休息情况',
        type: 'Rest',
        data: screenData.pickerRest
      }, {
        title: '筛选资产情况',
        type: 'Assets',
        data: screenData.pickerAssets
      }, {
        title: '筛选投资情况',
        type: 'Investment',
        data: screenData.pickerInvestment
      }, {
        title: '筛选决策人情况',
        type: 'Decision',
        data: screenData.pickerDecision
      }, {
        title: '筛选看房经历',
        type: 'LookHouse',
        data: screenData.pickerLookHouse
      }, {
        title: '筛选客户等级',
        type: 'Grade',
        data: screenData.pickerGrade
      }, {
        title: '筛选客户来源',
        type: 'Source',
        data: screenData.pickerSource
      }, {
        title: '筛选委托情况',
        type: 'Trust',
        data: screenData.Trust
      },
    ],
    onceTime: null,       // 存储定时器
    loading: false,
    scrollLower: false,    // 显示上滑加载中
    isShowFollow: false,    // 是否打开跟进遮罩
    fullFollowData: {},     // 跟进遮罩数据
  },
  onLoad: function (options) {
  },
  onReady: function () {
    this.$wuxBackdrop = $wuxBackdrop('#wux-backdrop', this);
    this.screenMore = this.selectComponent('#screenMore');
  },
  onShow: function () {
    this.GetFollowToPage();
  },
  // 获取所有客户跟进
  GetFollowToPage() {
    let params = this.data.params;

    params.page = 1;
    GetFollowToPage(params).then(res => {
      if (res.data.result === 'success') {
        this.setData({
          listData: res.data.temptable,
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
  // 加载更多跟进数据 
  bindscrolltolower() {
    let { params, listData } = this.data;
    
    this.setData({ 
      scrollLower: true
    });
    params.page++;
    GetFollowToPage(params).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable || [];

        this.setData({
          listData: listData.concat(data),
          scrollLower: false
        });
      } else {
        this.setData({
          scrollLower: false
        });
      };
    });
  },
  // 根据跟进id获取跟进
  bindShowFollow(e) {
    let id = e.currentTarget.dataset.id;

    // 打开遮罩层
    this.setData({
      isShowFollow: true,
      fullFollowData: {}
    });

    GetFollowByID({
      CustFollowID: id
    }).then(res => {
      if (res.data.result === 'success') {
        let temptable = res.data.temptable;
        let fullFollowData = Object.assign({}, temptable[0], {
          imageData: []
        });

        temptable.forEach((item) => {
          fullFollowData.imageData.push(URL_PATH + item.FileUrl);
        });
        
        this.setData({
          fullFollowData
        });
      } else {
        this.setData({
        });
      }
    })
  },
  // 关闭遮罩层
  bindColseFollow() {
    this.setData({
      isShowFollow: false
    });
  },
  // 打开客户详细
  bindOpenDetail(e) {
    wx.navigateTo({
      url: '../detail/index?CustID=' + e.currentTarget.dataset.id
    });
  },
  // 打开跟进页面
  bindOpenFollow(e) {
    wx.navigateTo({
      url: '../follow-list/index?CustID=' + e.currentTarget.dataset.id
    });
  },
  // 搜索返回结果
  bindQuery(e) {
    let { params } = this.data;

    this.data.onceTime ? clearTimeout(this.data.onceTime) : '';
    this.data.onceTime = setTimeout(() => {
      params.likestr = e.detail.value;
      this.setData({
        params
      });
      this.GetFollowToPage();     // 获取列表数据
    }, 300);
  },

  /**
   * 筛选功能
   */
  // 打开筛选项切换
  bindScreenClick(e) {
    let { index } = e.currentTarget.dataset;
    let { screenOpen } = this.data;

    // if index === '3' 就是更多筛选
    if (index === '3') {
      this.screenMore.show();
      this.setData({
        screenOpen: false
      });
      this.releaseBackdrop();
      return
    };

    screenOpen ? '' : this.retainBackdrop();    // 确保多次切换的情况下retainBackdrop只执行一次

    this.setData({
      screenOpen: true,
      screenIndex: Number(index)
    });
  },
  // 筛选radio改变事件
  bindRadioChange(e) {
    let { params } = this.data;
    let { type } = e.currentTarget.dataset;
    let { value } = e.detail;

    params[type] = value;

    this.setData({
      params
    });
    this.GetFollowToPage();     // 获取列表数据
    this.bindBackdrop();    // 选中后收起筛选项
  },
  // 更多筛选，重置
  bindScreenReset(data) {
    // 清空筛选
    let params = {
      page: 1,
      typeData: '求购'
    };
    let { typeData, FlagStatus, order } = this.data;

    // 还原勾选
    typeData.forEach(item => {
      item.checked = false
    });
    FlagStatus.forEach(item => {
      item.checked = false
    });
    order.forEach(item => {
      item.checked = false
    });

    this.setData({
      params,
      typeData,
      FlagStatus,
      order
    });
    this.GetFollowToPage();     // 获取列表数据
  },
  // 更多筛选，确定
  bindScreenConfirm(data) {
    let option = data.detail.option;
    let params = this.data.params;

    this.setData({
      params: Object.assign({}, params, option)
    });
    this.GetFollowToPage();     // 获取列表数据
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
})