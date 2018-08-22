
import GUID from '../../../utils/guid.js';
import data from './pickerData.js';       // 保存所有选项数据

import { InsertCustomer, InsertCustNeed, GetCustByID } from '../../../api/customer/add.js';

// 随机ID
const guid = new GUID();
const guidstr = guid.newGUID().toUpperCase();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerTypeIndex: 0,
    customerType: ['A', 'B', 'C', 'D'],
    Area: ['江西省', '南昌市', '高新区'],     // 区域
    Intention: 0,   // 意向度
    paramsCustomer: {   // 主体内容
      CustID: guidstr
    },
    paramsCustNeed: {   // 客户需求
      CustID: guidstr
    },
    pickerGrade: data.pickerGrade,
    pickerGradeIndex: 0,
    pickerMarriage: data.pickerMarriage,
    pickerMarriageIndex: 0,
    pickerNeedType: data.pickerNeedType,
    pickerNeedTypeIndex: 0,
    pickerPropertyType: data.pickerPropertyType,
    pickerPropertyTypeIndex: 0,
    pickerRoom: data.pickerRoom,
    pickerRoomIndex: 0,
    pickerChildren: data.pickerChildren,
    pickerChildrenIndex: 0,
    pickerIncome: data.pickerIncome,
    pickerIncomeIndex: 0,
    pickerOccupation: data.pickerOccupation,
    pickerOccupationIndex: 0,
    pickerAssets: data.pickerAssets,
    pickerAssetsIndex: 0,
    pickerInvestment: data.pickerInvestment,
    pickerInvestmentIndex: 0,
    pickerDecision: data.pickerDecision,
    pickerDecisionIndex: 0,
    pickerLookHouse: data.pickerLookHouse,
    pickerLookHouseIndex: 0,
  },
  onLoad: function (options) {
    let { CustID } = options;

    // 有CustID就是编辑
    if (CustID) {
      this.GetCustByID(CustID)
    }
  },
  onReady: function () {
    
  },
  onShow: function () {
    
  },
  // 监听input改变——客户主体数据
  changeCustomerInput(e) {
    let { type } = e.currentTarget.dataset;
    let paramsCustomer = this.data.paramsCustomer;

    paramsCustomer[type] = e.detail.value;
    this.setData({
      paramsCustomer
    });
    console.log(this.data.params)
  },
  // 监听下拉选项——客户主体数据
  bindPickerCustomerChange(e) {
    let types = e.currentTarget.dataset.type,
        index = e.detail.value,
        property = 'picker' + types,
        propertyIndex = 'picker' + types + 'Index',
        paramsCustomer = this.data.paramsCustomer;

    paramsCustomer[property] = this.data[property][index].value;

    this.setData({
      paramsCustomer,
      [propertyIndex]: index
    });
    console.log(this.data)
  },
  // 监听input改变——客户需求数据
  changeCustNeedInput(e) {
    let { type } = e.currentTarget.dataset;
    let paramsCustNeed = this.data.paramsCustNeed;

    paramsCustNeed[type] = e.detail.value;
    this.setData({
      paramsCustNeed
    });
    console.log(this.data.params)
  },
  // 监听下拉选项——客户需求数据
  bindPickerCustNeedChange(e) {
    let types = e.currentTarget.dataset.type,
        index = e.detail.value,
        property = 'picker' + types,
        propertyIndex = 'picker' + types + 'Index',
        paramsCustNeed = this.data.paramsCustNeed,
        value = this.data[property][index].value;

    paramsCustNeed[property] = value;

    this.setData({
      paramsCustNeed,
      [propertyIndex]: index
    });

    // 根据需求类型修改属性选项
    if (types === 'NeedType') {
      this.selectNeedType(value);
    }
  },
  // 根据需求类型修改属性选项
  selectNeedType(value) {
    let picker = [],
        pickerIndex = 0;

    // 产权属性，当需求不为一手房、一二手房、租房时，默认为其他
    if (value !== '一手房' && value !== '一二手房' && value !== '租房') {
      picker = [
        {
          label: '其他',
          value: '其他'
        }
      ];
      this.setData({
        pickerPropertyType: picker,
        pickerPropertyTypeIndex: pickerIndex,
        pickerRoom: picker,
        pickerRoomIndex: pickerIndex
      });
    } else {
      this.setData({
        pickerPropertyType: data.pickerPropertyType,
        pickerRoom: data.pickerRoom
      });
    }
  },
  bindCustomerType: function(e) {
    console.log(e.detail.value)
    this.setData({
      customerTypeIndex: e.detail.value
    })
  },
  // 区域
  bindAreaChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let value = e.detail.value;
    let paramsCustNeed = this.data.paramsCustNeed;

    paramsCustNeed.Area = value;

    this.setData({
      Area: value,
      paramsCustNeed,
    });
  },
  // 意向度
  sliderChange(e) {
    let value = e.detail.value;
    let paramsCustNeed = this.data.paramsCustNeed;

    paramsCustNeed.Intention = value;

    this.setData({
      Intention: value,
      paramsCustNeed
    })
    console.log('发生change事件，携带值为', e.detail.value)
  },
  // 打开关联人
  bindOpenLink() {
    wx.navigateTo({
      url: '../add/index?PriCustID=' + guidstr,
    });
  },
  // 编辑——根据ID获取数据
  GetCustByID(CustID) {
    console.log(CustID)
  },
  // 完成
  submit() {
    // 添加主体内容
    InsertCustomer(this.data.paramsCustomer).then(res => {
      console.log(res)
    });
    // 添加需求内容
    InsertCustNeed(this.data.paramsCustNeed).then(res => {
      console.log(res)
    });
  }
})