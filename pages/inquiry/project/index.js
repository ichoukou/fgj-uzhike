
const { $Message } = require('../../../components/base/index');
import { $wuxBackdrop } from '../../../components/index';
import _fgj from '../../../utils/util';
import { GetCanDeclareProject, GetDeclareListToPage } from '../../../api/inquiry/project';
import { InsertDeclare } from '../../../api/inquiry/batch';

Page({
  data: {
    tabCut: '0',        // 列表切换
    projectData: [      // 项目列表数据
      {
        id: '01',
        name: '聚仁国际',
        ask: '全号'
      }, {
        id: '02',
        name: '艾溪湖一号',
        ask: '不限'
      }, {
        id: '03',
        name: '敬老院',
        ask: '全号'
      }, 
    ],
    queryProject: {},     // 项目列表筛选参数
    inquiryData: [],      // 报备列表数据
    queryInquiry: {       // 报备列表筛选参数
      page: 1
    },
    onceTime: null,       // 保存定时器
    screenOpen: false,    // 是否打开筛选项
    screenIndex: -1,      // 显示哪个筛选项
    isInquiryMore: true,  // 是否有更多报备列表数据
    isLoading1: false,    // 项目列表是否加载完毕
    isLoading2: false,    // 报备列表是否加载完毕
    ProjectID: [
      {
        label: '不限',
        value: ''
      }
    ],
    IsExp: [
      {
        label: '不限',
        value: ''
      }, {
        label: '过期',
        value: '0'
      }, {
        label: '有效',
        value: '1'
      }
    ],
    order: [
      {
        label: '不限',
        value: ''
      }, {
        label: '最新报备',
        value: 'DeclareDate-desc'
      }, {
        label: '最新到访',
        value: 'VisitDate-desc'
      }
    ],
  },
  onLoad: function (options) {
  
  },
  onReady: function () {
    this.$wuxBackdrop = $wuxBackdrop('#wux-backdrop', this);
  },
  onShow: function () {
    this.data.isInquiryMore = true;
    this.GetCanDeclareProject();    // 获取项目列表
    this.GetDeclareListToPage();    // 获取报备客户列表
  },
  // 列表切换
  bindTabCut(e) {
    let index = e.currentTarget.dataset.index;

    if (index !== this.data.tabCut) {
      this.setData({
        tabCut: index
      });
      this.bindBackdrop();            // 收起筛选项
    }
  },

  /**
   * 报备项目功能
   */
  // 获取项目列表
  GetCanDeclareProject() {
    GetCanDeclareProject(this.data.queryProject).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable;

        // 处理项目列表数据
        this.fillterProjectData(data);

        this.setData({
          projectData: data,
          ProjectID: this.data.ProjectID.concat([], data),
          isLoading1: true
        })
      } else {
        this.setData({
          projectData: [],
          isLoading1: true
        });
      }
    });
  },
  // 处理项目列表数据
  fillterProjectData(data) {
    // 添加label和value字段，用在筛选里面
    data.forEach(item =>{
      item.label = item.ProjectName;
      item.value = item.ProjectID;
    });
  },
  // 选择要报备的项目
  bindSelectProject(e) {
    let item = e.currentTarget.dataset.item;

    wx.setStorage({
      key: 'projectData',
      data: item,
      success() {
        wx.navigateTo({
          url: '../batch/index',
        });
      },
      fail(err) {
        console.log(err)
      }
    });
  },
  // 项目列表搜索
  bindProjectQuery(e){
    let value = e.detail.value;
    let queryProject = this.data.queryProject;

    this.data.onceTime ? clearTimeout(this.data.onceTime) : '';
    this.data.onceTime = setTimeout(() => {
      queryProject.likestr = value;
      this.setData({
        queryProject
      })
      this.GetCanDeclareProject();
    }, 300);
  },
  projectListLower() {
    console.log('projectListLower')
  },

  /**
   * 报备列表功能
   */
  // 获取报备客户列表
  GetDeclareListToPage() {
    let queryInquiry = this.data.queryInquiry;

    this.data.isInquiryMore = true;
    queryInquiry.page = 1;
    GetDeclareListToPage(queryInquiry).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable;

        // 处理报备列表数据
        this.fillterInquiryData(data);

        this.setData({
          inquiryData: data,
          isLoading2: true
        })
      } else {
        this.setData({
          inquiryData: [],
          isLoading2: true
        });
      }
    });
  },
  // 处理报备列表数据
  fillterInquiryData(data) {
    data.forEach(item => {
      let ExpireDate = new Date(item.ExpireDate).getTime();
      let DeclareDate = new Date(item.DeclareDate).getTime();
      let hour = (ExpireDate - DeclareDate) / 1000 / 60 / 60;   // 计算还有多少个小时到期

      // 到期时间小于或等于一个小时，提醒
      if (hour <= 1) {
        item.expire = true;
      }
    });
  },
  // 加载更多报备列表
  inquiryListLower() {
    let { inquiryData, queryInquiry, isInquiryMore } = this.data;

    if (!isInquiryMore) {
      console.log('没有更多数据')
      return false;
    }

    queryInquiry.page++;
    GetDeclareListToPage(queryInquiry).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable;

        // 处理报备列表数据
        this.fillterInquiryData(data);

        this.setData({
          inquiryData: inquiryData.concat([], data)
        });
      } else {
        this.data.isInquiryMore = false;
      }
    });
  },
  // 续报
  bindContinueInquiry(e) {
    let item = e.currentTarget.dataset.item;
    let params = {
      ProjectID: item.ProjectID,
      CustID: item.CustID,
      CustTel: item.Tel
    };
    wx.showLoading({
      title: '正在报备',
    });
    InsertDeclare(params).then(res => {
      wx.hideLoading();
      if (res.data.result === 'success') {
        $Message({ content: res.data.msg, type: 'success' });
        this.GetDeclareListToPage();
      } else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    });
  },
  // 报备列表搜索
  bindInquiryQuery(e) {
    let value = e.detail.value;
    let queryInquiry = this.data.queryInquiry;

    this.data.onceTime ? clearTimeout(this.data.onceTime) : '';
    this.data.onceTime = setTimeout(() => {
      queryInquiry.likestr = value;
      this.setData({
        queryInquiry
      })
      this.GetDeclareListToPage();
    }, 300);
  },
  // 打开筛选项切换
  bindScreenClick(e) {
    let { index } = e.currentTarget.dataset;
    let { screenOpen } = this.data;

    screenOpen ? '' : this.retainBackdrop();    // 确保多次切换的情况下retainBackdrop只执行一次

    this.setData({
      screenOpen: true,
      screenIndex: Number(index)
    });
  },
  // 筛选radio改变事件
  bindRadioChange(e) {
    let { queryInquiry } = this.data;
    let { type } = e.currentTarget.dataset;
    let { value } = e.detail;
    let item = this.data[type].filter(item => item.value === value);

    queryInquiry[type] = value;
    queryInquiry[type + 'Label'] = item[0].label;

    this.setData({
      queryInquiry
    });
    this.GetDeclareListToPage();     // 获取列表数据
    this.bindBackdrop();            // 选中后收起筛选项
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
  onHide: function () {
  
  },
  
})