
const { $Message } = require('../../../components/base/index');
import data from '../new/pickerData';
import { $wuxBackdrop } from '../../../components/index';
import { GetCustPage } from '../../../api/customer/list.js';
import { GetFollowByCustID } from '../../../api/customer/follow-list.js';
import { URL_PATH } from '../../../utils/config';

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
    isPlayAudio: -1,      // 当前正在播放的录音
    isOpenFollow: false,
    NeedType: [
      {
        label: '求购',
        value: '求购'
      }, {
        label: '求租',
        value: '求租'
      }, {
        label: '装修',
        value: '装修'
      },
    ],
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
    isInquiryMore: true,   // 是否有更多报备列表数据
    scrollLower: false,    // 显示上滑加载中
    checkedData: [],       // 存储批量操作选中的客户ID
  },
  onLoad: function (options) {
    console.log(options)
  },
  onReady: function () {
    this.$wuxBackdrop = $wuxBackdrop('#wux-backdrop', this);
    this.screenMore = this.selectComponent('#screenMore');
    this.innerAudioContext = wx.createInnerAudioContext();
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
        // console.log('checkedData', res.data)
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

        this.filterData(data);     // 处理分页数据

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

        this.filterData(data);     // 处理分页数据

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
  filterData(data) {
    let checkedData = this.data.checkedData;

    data.forEach(item => {
      for (let key of Object.keys(item)) {
        if (item.GNeedType === '1') {
          item[key.replace(/^G/, '')] = item[key];      // 去掉首字母，已做显示
          item.NeedType = '求购';
        }
        if (item.ZNeedType === '1') {
          item[key.replace(/^Z/, '')] = item[key];      // 去掉首字母，已做显示
        }
        if (item.XNeedType === '1') {
          item[key.replace(/^X/, '')] = item[key];      // 去掉首字母，已做显示
        }
      }

      // 批量操作是否选中
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
      NeedType: '求购'
    };
    let { NeedType, FlagStatus, order } = this.data;

    // 还原勾选
    NeedType.forEach(item => {
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
      NeedType,
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

  /**
   * 客户跟进操作
   */
  // 播放语音
  bindPlayAudio(e) {
    let { audio, index, audioIndex } = e.currentTarget.dataset;
    let currentIndex = index + '' + audioIndex;

    this.setData({
      isPlayAudio: currentIndex
    });

    // 播放录音
    this.innerAudioContext.stop();
    this.innerAudioContext.src = audio.path;
    this.innerAudioContext.play();
    this.innerAudioContext.onEnded(() => {
      this.setData({
        isPlayAudio: -1
      });
    });
    this.innerAudioContext.onError((res) => {
      this.setData({
        isPlayAudio: -1
      });
    });
  },
  // 显示跟进详细卡片
  bindShowFollow(e) {
    let { index, item } = e.currentTarget.dataset;
    let listData = this.data.listData;

    listData[index].isOpenFollow = true;
    listData[index].followLoading = false;    // 加载中
    
    this.setData({
      listData
    });
    this.GetFollowByCustID(item.CustID, index);
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
  GetFollowByCustID(CustID, index) {
    let listData = this.data.listData;

    GetFollowByCustID({
      CustID,
      top: 1
    }).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable[0] || {};

        this.filterFollowData(data);    // 处理跟进数据

        listData[index].followOneData = data;
        listData[index].followLoading = true;

        console.log(listData)

        this.setData({
          listData
        });
      } else {
        listData[index].followOneData = {};
        listData[index].followLoading = true;
        this.setData({
          listData
        });
      };
      console.log(listData)
    });
  },
  // 处理跟进数据
  filterFollowData(data) {
    if (data.FollowContent) {
      data.FollowContent = data.FollowContent;
    }
    if (data.FileUrl && data.FileType === '图片') {
      data.imageData = [URL_PATH + data.FileUrl];
    }
    if (data.FileUrl && data.FileType === '语音') {
      data.audioData = [{
        path: URL_PATH + data.FileUrl,
        time: data.Remark
      }];
    }
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

    // wx.showActionSheet({
    //   itemList: ['报备'],
    //   success: function (res) {
    //     switch (res.tapIndex) {
    //       case 0:
    //       break;
    //       default: 
    //         console.log('这是不可能的');
    //     }
    //   },
    //   fail: function (res) {
    //     console.log(res.errMsg)
    //   }
    // })
  },

  /**
   * 拨号
   */
  bindPhoneCall(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },

  /**
   * 明细
   */
  bindOpenSingleTool(e) {
    let Tel = e.currentTarget.dataset.tel;

    wx.navigateTo({
      url: '../single-tool/index?CustTel=' + Tel
    });
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