const { $Message } = require('../../../components/base/index');
import { $wuxBackdrop } from '../../../components/index';
import { GetReceptionList } from '../../../api/reception/list';
import { GetCanDeclareProject } from '../../../api/inquiry/project';

Page({
  data: {
    params: {             // 筛选参数
      page: 1,
      Begindate: '',      // 开始日期
      Enddate: '',        // 结束日期
    },
    nowDate: new Date(),  // 获取当前时间
    listData: [],         // 列表数据
    loading: false,       // 是否加载完毕
    isScrollMore: true,   // 是否有更多数据
    onceTime: null,       // 存储定时器
    screenOpen: false,    // 是否打开筛选项
    screenIndex: -1,      // 显示哪个筛选项
    ProjectID: [],        // 项目数据
  },
  onLoad: function (options) {
    this.GetReceptionList();      // 获取列表数据
  },
  onReady: function () {
    this.selectDept = this.selectComponent('#selectDept');
    this.$wuxBackdrop = $wuxBackdrop('#wux-backdrop', this);
  },
  onShow: function () {
    // 页面返回的时候，没有数据再去获取
    setTimeout(() => {
      if (!this.data.listData.length) {
        this.GetReceptionList();    // 获取列表数据
      }
    }, 300);
    this.GetCanDeclareProject();    // 获取项目列表数据
  },
  // 获取列表数据
  GetReceptionList() {
    let params = this.data.params;

    this.setData({
      loading: false,
      listData: []
    });
    params.page = 1;
    GetReceptionList(params).then(res => {
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
  // 列表滚动到底部，加载下一页
  bindscrolltolower(e) {
    let { params, listData, isScrollMore } = this.data;

    if (!isScrollMore) {
      console.log('没有更多数据')
      return false;
    }
    this.setData({
      loading: false
    });

    params.page++;
    GetReceptionList(params).then(res => {
      this.setData({
        loading: true
      });
      if (res.data.result === 'success') {
        let data = res.data.temptable || [];

        // this.fillterData(data);     // 处理分页数据

        this.setData({
          listData: listData.concat(data)
        });
      } else {
        this.data.isScrollMore = false;
      };
    })
  },
  // 获取项目列表
  GetCanDeclareProject() {
    GetCanDeclareProject().then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable;

        // 处理项目列表数据
        this.fillterProjectData(data);

        this.setData({
          ProjectID: data
        });
      } else {
        this.setData({
          ProjectID: []
        });
      }
    });
  },
  // 处理项目列表数据
  fillterProjectData(data) {
    // 添加label和value字段，用在筛选里面
    data.forEach(item => {
      item.label = item.ProjectName;
      item.value = item.ProjectID;
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
      this.GetReceptionList();
    }, 300);
  },
  // 打开筛选项切换
  bindScreenClick(e) {
    let { index } = e.currentTarget.dataset;
    let { screenOpen } = this.data;

    switch (index) {
      case '0':
        this.bindOpenSelectDept();    // 选择部门
        return false;
        break;
      default:
    }

    // 重复点击要收起
    if (Number(index) === this.data.screenIndex) {
      this.bindBackdrop();
      return false;
    }

    screenOpen ? '' : this.retainBackdrop();    // 确保多次切换的情况下retainBackdrop只执行一次

    this.setData({
      screenOpen: true,
      screenIndex: Number(index)
    });
  },
  // 筛选radio改变事件
  bindRadioChange(e) {
    let { params, ProjectID } = this.data;
    let { type } = e.currentTarget.dataset;
    let { value } = e.detail;

    params[type] = value;

    // 处理选中的项目名称，已作显示
    if (type === 'ProjectID') {
      for (let item of ProjectID) {
        if (item.value === value) {
          params.ProjectName = item.label;
          break;
        }
      }
    }

    this.setData({
      params
    });
    this.GetReceptionList();  // 获取列表数据
    this.bindBackdrop();      // 选中后收起筛选项
  },
  // 打开部门选择器
  bindOpenSelectDept() {
    this.selectDept.show();
  },
  // 选择部门返回值
  bindSelectConfirm(data) {
    let { DeptID, DeptName } = data.detail.value;
    let params = this.data.params;

    params.DeptID = DeptID;
    params.DeptName = DeptName;

    this.setData({
      params
    });
    console.log(params)
  },
  // 打开更多操作
  bindOperation(e) {
    let item = e.currentTarget.dataset.item;
    let itemList = ['添加跟进', '查看跟进', '查看历史接待', '查看历史报备'];

    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        switch (res.tapIndex) {
          case 0:
            wx.navigateTo({
              url: '../follow/index?ProjectReceptionID=' + item.ProjectReceptionID
            });
            break;
          case 1:
            wx.navigateTo({
              url: '../follow-list/index?ProjectReceptionID=' + item.ProjectReceptionID
            });
            break;
          case 2:     // 查看历史接待
            wx.navigateTo({
              url: '../history-reception/index?ProjectReceptionID=' + item.ProjectReceptionID
            });
            break;
          case 3:     // 查看历史报备
            wx.navigateTo({
              url: '../history-inquiry/index?ProjectReceptionID=' + item.ProjectReceptionID
            });
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
  // 监听时间变化
  bindDateChange(e) {
    let types = e.currentTarget.dataset.types;
    let value = e.detail.value;
    let params = this.data.params;

    params[types] = value;

    if (params.Begindate && params.Enddate) {
      if (new Date(params.Begindate).getTime() > new Date(params.Enddate).getTime()) {
        $Message({ content: '起始时间不能大于结束时间', type: 'warning' });
        params[types] = '';
      }
    }

    this.setData({
      params
    });
    this.GetReceptionList();
  },
  // 清空时间筛选
  bindClearDate(e) {
    let types = e.currentTarget.dataset.types;
    let params = this.data.params;

    params[types] = '';

    this.setData({
      params
    });
    this.GetReceptionList();
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
      screenOpen: false,
      screenIndex: -1
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
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