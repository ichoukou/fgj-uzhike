
const { $Message } = require('../../../components/base/index');
import data from '../new/pickerData';
import { $wuxBackdrop } from '../../../components/index';
import { GetCustPage } from '../../../api/customer/list.js';
import { GetFollowByCustID } from '../../../api/customer/follow-list.js';

let screenData = JSON.parse(JSON.stringify(data));
// 处理更多筛选项数据，把 ‘请选择’ 改成 ‘不限’
for (let key of Object.keys(screenData)) {
  if (screenData[key][0].label === '请选择') {
    screenData[key][0].label = '不限'
  }
}

Page({
  data: {
    listData: [],   // 列表数据
    params: {       // 筛选项
      page: 1,
      // NeedType: '求购'
    },
    followOneData: {},    // 显示最新一条跟进数据
    isPlayAudio: false,   // 是否播放语音
    isOpenFollow: false,
    typeData: screenData.pickerNeedType,
    FlagStatus: screenData.FlagStatus,
    order: screenData.order,
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
    onceTime: null,
    loading: false,
    isInquiryMore: true,  // 是否有更多报备列表数据
    scrollLower: false,    // 显示上滑加载中
    checkedData: [],       // 存储批量操作选中的客户ID
  },
  onLoad: function (options) {
    console.log(options)
  },
  onReady: function () {
    this.$wuxBackdrop = $wuxBackdrop('#wux-backdrop', this);
    this.screenMore = this.selectComponent('#screenMore');
  },
  onShow: function () {
    this.data.isInquiryMore = true;
    this.getCheckedData();    // 获取批量操作已选中的客户ID
  },
  // 获取批量操作已选中的客户ID
  getCheckedData() {
    wx.getStorage({
      key: 'checkedData',
      success: function (res) {
        console.log('checkedData', res.data)
        this.data.checkedData = res.data;
      }.bind(this),
      complete: function () {
        this.GetCustPage();     // 获取客户分页数据
      }.bind(this)
    });
  },
  onHide: function () {
  },
  // 获取客户分页数据
  GetCustPage() {
    let { params, checkedData } = this.data;

    this.setData({
      loading: false
    });
    this.data.isInquiryMore = true;
    params.page = 1;
    GetCustPage(params).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable || [];

        this.fillterData(data);     // 处理分页数据

        this.setData({
          listData: data,
          checkedData,
          loading: true,
          scrollLower: true
        });
      } else {
        this.setData({
          listData: [],
          loading: true,
          scrollLower: true
        });
      };
    })
  },
  // 列表滚动到底部，加载下一页
  bindscrolltolower(e) {
    let { params, listData, isInquiryMore } = this.data;

    if (!isInquiryMore) {
      console.log('没有更多数据')
      return false;
    }

    this.setData({
      scrollLower: false
    });
    params.page++;
    GetCustPage(params).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable || [];

        this.fillterData(data);     // 处理分页数据

        this.setData({
          listData: listData.concat(data),
          scrollLower: true
        });
      } else {
        this.setData({
          scrollLower: true
        });
        this.data.isInquiryMore = false;
      };
    })
  },
  // 处理分页数据
  fillterData(data) {
    let checkedData = this.data.checkedData;

    data.forEach(item => {
      if (item.Area) {
        item.Area = item.Area.replace(/\|/, '');
      }
      if (item.Room) {
        item.Room = item.Room.replace(/\|/, '');
      }
      if (checkedData.indexOf(item.CustID) !== -1) {
        item.checked = true;
      }
    });
  },
  // 打开添加页面
  bindOpenAdd() {
    wx.navigateTo({
      url: '../new/index'
    })
  },
  // 搜索返回结果
  bindQuery(e) {
    let { params } = this.data;

    this.data.onceTime ? clearTimeout(this.data.onceTime) : '';
    this.data.onceTime = setTimeout(() => {
      params.likestr = e.detail.value;
      this.setData({
        params
      })
      this.GetCustPage();
    }, 300);
  },
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
    this.GetCustPage();     // 获取列表数据
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
    this.GetCustPage();     // 获取列表数据
  },
  // 更多筛选，确定
  bindScreenConfirm(data) {
    let option = data.detail.option;
    let params = this.data.params;
    
    this.setData({
      params: Object.assign({}, params, option)
    });
    this.GetCustPage();     // 获取列表数据
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

  // 添加客户
  addCustomer() {
    wx.navigateTo({
      url: '../new/index',
    })
  },
  // 打开详细页
  bindOpenDetail(e) {
    let CustID = e.currentTarget.dataset.custid;

    wx.navigateTo({
      url: '../detail/index?CustID=' + CustID
    });
  },
  // 显示跟进详细卡片
  bindShowFollow(e) {
    let { index, item } = e.currentTarget.dataset;
    let listData = this.data.listData;

    listData[index].isOpenFollow = true;
    
    this.setData({
      listData
    });
    this.GetFollowByCustID(item.CustID);
  },
  // 关闭跟进详细卡片
  bindCloseFollow(e) {
    let index = e.currentTarget.dataset.index;
    let listData = this.data.listData;
    
    listData[index].isOpenFollow = false;

    this.setData({
      listData
    })
  },
  // 根据客户ID获取跟进
  GetFollowByCustID(CustID) {
    GetFollowByCustID({
      CustID,
      top: 1
    }).then(res => {
      // followOneData
      if (res.data.result === 'success') {
        let data = res.data.temptable[0] || {};

        this.setData({
          followOneData: data
        });
      } else {
        this.setData({
          followOneData: {}
        });
      };
    });
  },
  // 查看更多跟进
  bindOpenFollowList(e) {
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../follow-list/index?CustID=' + item.CustID
    });
  },
  // 打开更多操作
  bindshowActionSheet(e) {
    let item = e.currentTarget.dataset.item;

    wx.showActionSheet({
      itemList: ['报备'],
      success: function (res) {
        switch (res.tapIndex) {
          case 0:
          break;
          default: 
            console.log('这是不可能的');
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  /**
   * 处理报备相关功能
   */
  // 点击批量操作
  bindBatchOperation(e) {
    let { item, index } = e.currentTarget.dataset;
    let { listData, checkedData } = this.data;
    let subIndex = checkedData.indexOf(item.CustID);    // 当前点击的客户在已选中的数据里面的下标

    // 判断当前点击的客户是否已存在
    if (subIndex === -1) {
      checkedData.push(item.CustID);
      item.checked = true;
    } else {
      checkedData.splice(subIndex, 1);
      item.checked = false;
    }

    // 修改数据状态
    listData.splice(index, 1, item);

    this.setData({
      listData,
      checkedData
    });
  },
  // 点击浮动的操作按钮，去批量操作
  catchFixedBtn() {
    let checkedData = this.data.checkedData;

    console.log(checkedData);

    // 缓存选中的客户ID
    wx.setStorage({
      key: 'checkedData',
      data: checkedData,
      success() {
        wx.navigateTo({
          url: '/pages/inquiry/batch/index',
        });
      }
    });
  },
})