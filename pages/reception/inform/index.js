const { $Message } = require('../../../components/base/index');
import { GetTodayReceptionUnion, SendReceptionMsg } from '../../../api/reception/inform';

Page({
  data: {
    ProjectReceptionID: '',       // 接待id
    listData: [],                 // 有关联的报备记录数据
    checkedData: [],              // 选中的数据
    loading: false,               // 初次进去，标记加载数据状态
    isAllChecked: false,          // 是否全选了
    isDisabled: false,            // 防止重复发送
  },
  onLoad: function (options) {
    this.data.ProjectReceptionID = options.ProjectReceptionID || '4F3719F5FDA542CE8C6E9F7A9781BBC0';
  },
  onReady: function () {
  
  },
  onShow: function () {
    this.GetTodayReceptionUnion();    // 根据接待id获取当天报备记录
  },
  onHide: function () {
  
  },
  // 根据接待id获取当天报备记录
  GetTodayReceptionUnion() {
    wx.showLoading({
      title: '加载中',
    });
    GetTodayReceptionUnion({
      ProjectReceptionID: this.data.ProjectReceptionID
    }).then(res => {
      wx.hideLoading();
      if (res.data.result === 'success') {
        let data = res.data.temptable;

        this.filterData(data);   // 处理数据

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
    data.forEach(item => {
      item.proType = 0;       // 用在约访或带访切换上
    });
  },
  // 点击跳过
  bindNext() {
    wx.navigateTo({
      url: '../list/index'
    });
  },
  // 点击发送
  submit() {
    let { checkedData, listData } = this.data;
    let currentData = listData.filter(item => checkedData.indexOf(item.ProjectReceptionUnionID) !== -1);  // 拿到选中的数据
    let params = {};

    if (!currentData.length) {
      $Message({ content: '请先选择，再发送', type: 'error' });
      return false;
    }

    // 拼接数据
    currentData.forEach(item => {
      // 判断是约访还是带访，用`,`号分割，注意这里不能在前和尾有多余空格，所以用三元运算
      if (item.proType === 0) {
        params.YProjectReceptionID 
        ? params.YProjectReceptionID += ',' + item.ProjectReceptionUnionID 
        : params.YProjectReceptionID = item.ProjectReceptionUnionID;
      } else {
        params.DProjectReceptionUnionID
        ? params.DProjectReceptionUnionID += ',' + item.ProjectReceptionUnionID
        : params.DProjectReceptionUnionID = item.ProjectReceptionUnionID;
      }
    });
    this.SendReceptionMsg(params);
  },
  // 发送约访通知接口
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
      if (res.data.result === 'success') {
        $Message({ content: '发送成功', type: 'success' });

        setTimeout(() => {
          this.data.isDisabled = false;
          wx.navigateTo({
            url: '../list/index'
          });
        }, 500);
      } else {
        this.data.isDisabled = false;
        $Message({ content: res.data.msg, type: 'error' });
      }
    });
  },
  // 切换约访或带访 => 0：约访，1：带访
  catchSelectType(e) {
    let { index, types } = e.currentTarget.dataset;
    let listData = this.data.listData;

    listData[index].proType = Number(types);

    this.setData({
      listData
    });
  },
  // 列表搜索
  // bindQuery(e) {
  //   let value = e.detail.value;
  //   let params = this.data.params;

  //   this.data.onceTime ? clearTimeout(this.data.onceTime) : '';
  //   this.data.onceTime = setTimeout(() => {
  //     params.likestr = value;
  //     this.setData({
  //       params
  //     })
  //     this.GetCanDeclareProject();
  //   }, 300);
  // },
  // 选中客户
  checkboxChange(e) {
    let { listData } = this.data;
    let ArrValue = e.detail.value;

    console.log('checkbox', ArrValue)

    // 先清空状态
    listData.forEach(item => {
      item.checked = false
    });

    // 再添加状态
    for (let key of listData) {
      if (ArrValue.indexOf(key.ProjectReceptionUnionID) !== -1) {
        key.checked = true;
      }
    }

    this.data.checkedData = ArrValue;

    this.setData({
      listData
    });

    // 判断是否每个都勾选了
    if (ArrValue.length === listData.length) {
      this.setData({
        isAllChecked: true
      })
    } else {
      this.setData({
        isAllChecked: false
      })
    }
  },
  // 全选和取消全选
  checkboxChangeAll(e) {
    let { listData, checkedData } = this.data;

    checkedData = [];   // 先清空

    if (!this.data.isAllChecked) {
      listData.forEach(item => {
        item.checked = true;
        checkedData.push(item.ProjectReceptionUnionID);
      });
    } else {
      listData.forEach(item => {
        item.checked = false;
      });
      checkedData = [];
    }
    this.data.isAllChecked = !this.data.isAllChecked;

    console.log(checkedData)
    this.data.checkedData = checkedData;
    this.setData({
      listData,
    });
  },
})