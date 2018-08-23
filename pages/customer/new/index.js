
const { $Message } = require('../../../components/base/index');
import GUID from '../../../utils/guid';
import data from './pickerData';       // 保存所有选项数据

import { InsertCustomer, InsertCustNeed, GetCustByID, UpCustomer, GetCustNeedByCustID } from '../../../api/customer/new';
import { DelCustLink } from '../../../api/customer/add-link';

// 随机ID
const guid = new GUID();
const guidstr = guid.newGUID().toUpperCase();

Page({
  data: {
    CustID: '',     // 有ID就是编辑
    Area: ['江西省', '南昌市', '高新区'],     // 区域
    Intention: 0,   // 意向度
    paramsCustomer: {   // 主体内容
      CustID: guidstr,
    },
    paramsCustNeed: {   // 客户需求
      CustID: guidstr
    },
    paramsLink: [],   // 保存关联人
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
    pickerRest: data.pickerRest,
    pickerRestIndex: 0,
    pickerAssets: data.pickerAssets,
    pickerAssetsIndex: 0,
    pickerInvestment: data.pickerInvestment,
    pickerInvestmentIndex: 0,
    pickerDecision: data.pickerDecision,
    pickerDecisionIndex: 0,
    pickerLookHouse: data.pickerLookHouse,
    pickerLookHouseIndex: 0,
    pickerSource: data.pickerSource,
    pickerSourceIndex: 0,
  },
  onLoad: function (options) {
    let { CustID } = options;

    // let CustID = 'AD5FE90B8133EF43112BB9D0AFBE8E9B';

    this.data.CustID = CustID;

    // 有CustID就是编辑
    if (CustID) {
      this.GetCustByID(CustID);
      this.GetCustNeedByCustID(CustID);
    }
  },
  onReady: function () {
    
  },
  onShow: function () {
    console.log('paramsLink', this.data.paramsLink)
  },
  // 监听input改变——客户主体数据
  changeCustomerInput(e) {
    let { type } = e.currentTarget.dataset;
    let paramsCustomer = this.data.paramsCustomer;

    paramsCustomer[type] = e.detail.value;
    this.setData({
      paramsCustomer
    });
  },
  // 监听下拉选项——客户主体数据
  bindPickerCustomerChange(e) {
    let types = e.currentTarget.dataset.type,
        index = e.detail.value,
        property = 'picker' + types,
        propertyIndex = 'picker' + types + 'Index',
        paramsCustomer = this.data.paramsCustomer;

    paramsCustomer[types] = this.data[property][index].value;

    this.setData({
      paramsCustomer,
      [propertyIndex]: index
    });
    console.log(this.data.paramsCustomer)
  },
  // 监听input改变——客户需求数据
  changeCustNeedInput(e) {
    let { type } = e.currentTarget.dataset;
    let paramsCustNeed = this.data.paramsCustNeed;

    paramsCustNeed[type] = e.detail.value;
    this.setData({
      paramsCustNeed
    });
  },
  // 监听下拉选项——客户需求数据
  bindPickerCustNeedChange(e) {
    let types = e.currentTarget.dataset.type,
        index = e.detail.value,
        property = 'picker' + types,
        propertyIndex = 'picker' + types + 'Index',
        paramsCustNeed = this.data.paramsCustNeed,
        value = this.data[property][index].value;

    paramsCustNeed[types] = value;

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
      url: '../add-link/index?PriCustID=' + guidstr,
    });
  },
  // 删除联系人
  bindCloseLink(e) {
    console.log(e.currentTarget)
    const { index, id } = e.currentTarget.dataset;
    let paramsLink = this.data.paramsLink;

    wx.showLoading({ title: '删除中' });
    DelCustLink({
      CustLinkID: id
    }).then(res => {
      wx.hideLoading();
      if (res.data.result === 'success') {
        $Message({ content: '删除成功', type: 'success' });
        paramsLink.splice(index, 1);
        this.setData({
          paramsLink
        });
      } else {
        $Message({ content: '删除失败', type: 'error' });
      }
    });
  },
  // 打开城市选择器
  bindOpenCity() {
    wx.navigateTo({
      url: '../city/index'
    })
  },
  // 编辑——根据ID获取客户——主体数据
  GetCustByID(CustID) {
    GetCustByID({
      CustID
    }).then(res => {
      if (res.data.result === 'success') {
        let paramsCustomer = this.data.paramsCustomer,
            temptable = res.data.temptable[0] || {},
            property = '',
            propertyIndex = 0,
            index = 0;

        let map = ['Grade', 'Marriage', 'Children', 'Income', 'Occupation', 'Assets', 'Investment', 'Decision', 'LookHouse'];

        // picker控件数据回填
        for (let key of map) {
          console.log(temptable[key])
          if (temptable[key]) {
            property = 'picker' + key;
            propertyIndex = 'picker' + key + 'Index';
            index = this.backfillPicker(this.data[property], temptable[key]);
            console.log(index)
            this.setData({
              [propertyIndex]: index
            });
          }
        }

        this.setData({
          paramsCustomer: Object.assign({}, paramsCustomer, res.data.temptable[0])
        })
      }
    })
  },
  // picker控件数据回填
  backfillPicker(data, target) {
    for (let i = 0, length = data.length; i < length; i++) {
      if (data[i].value === target) {
        return i;
      }
    };
  },
  // 编辑——根据ID获取客户——需求数据
  GetCustNeedByCustID(CustID) {
    GetCustByID({
      CustID
    }).then(res => {
      if (res.data.result === 'success') {
        let paramsCustNeed = this.data.paramsCustNeed;
        this.setData({
          paramsCustNeed: Object.assign({}, paramsCustNeed, res.data.temptable[0])
        })
      }
    })
  },
  // 修改客户——主体数据
  UpCustomer() {
    UpCustomer(this.data.paramsCustomer).then(res => {
      console.log(res)
    })
  },
  // 完成
  submit() {
    let { paramsCustomer, paramsCustNeed } = this.data;

    // 判断是添加还是编辑
    if (!this.data.CustID) {
      // 添加主体内容
      InsertCustomer(this.data.paramsCustomer).then(res => {
        console.log(res)
      });
      // 添加需求内容
      InsertCustNeed(this.data.paramsCustNeed).then(res => {
        console.log(res)
      });
    }
    // 下面是编辑
    else {
      this.UpCustomer();
    }
  }
})