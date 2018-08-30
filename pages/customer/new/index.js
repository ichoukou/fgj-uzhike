
const { $Message } = require('../../../components/base/index');
import GUID from '../../../utils/guid';
import data from './pickerData';       // 保存所有选项数据
import _fgj from '../../../utils/util';

import { InsertCustomer, GetCustByID, GetCustNeedByCustID, GetCustomerLinkByCustID, UpCustomer } from '../../../api/customer/new';
import { DelCustLink } from '../../../api/customer/add-link';
import { DelCustNeed } from '../../../api/customer/add-need';

// 临时ID
const guid = new GUID();
const guidstr = guid.newGUID().toUpperCase();

Page({
  data: {
    CustID: '',     // 有ID就是编辑
    paramsCustomer: {   // 主体内容
      CustID: '',
    },
    paramsCustNeed: [], // 保存客户需求
    linkData: [],   // 保存关联人
    pickerGrade: data.pickerGrade,
    pickerGradeIndex: 0,
    pickerMarriage: data.pickerMarriage,
    pickerMarriageIndex: 0,
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
    let paramsCustomer = this.data.paramsCustomer;

    if (CustID) {
      paramsCustomer.CustID = CustID;
    } else {
      paramsCustomer.CustID = guidstr;    // 临时ID
    }
    this.data.CustID = CustID || '';      // 全局保存
  },
  onReady: function () {
  },
  onShow: function () {
    console.log('show', this.data)
    // 有CustID就是编辑
    let CustID = this.data.CustID;
    if (CustID) {
      this.GetCustByID(CustID);
      this.GetCustNeedByCustID(CustID);
      this.GetCustomerLinkByCustID(CustID);
    }
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
  // 添加需求
  bindOpenNeed() {
    wx.navigateTo({
      url: '../add-need/index?CustID=' + this.data.paramsCustomer.CustID
    });
  },
  // 修改需求
  bindOpenNeedEdit(e) {
    let { custid, custneedid } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../add-need/index?CustNeedID=${custneedid}&CustID=${custid}`
    });
  },
  // 删除需求
  bindCloseNeed(e) {
    let { index, custneedid } = e.currentTarget.dataset;
    let paramsCustNeed = this.data.paramsCustNeed;
    let _this = this;

    wx.showModal({
      content: '您确定要删除这条需求吗?',
      cancelColor: '#666',
      confirmColor: '#ff6714',
      success: function(res) {
        if (res.confirm) {
          DelCustNeed({
            CustNeedID: custneedid
          }).then(res => {
            if (res.data.result === 'success') {
              $Message({ content: '删除成功', type: 'success' });
              paramsCustNeed.splice(index, 1);
              _this.setData({
                paramsCustNeed
              });
            } else {
              $Message({ content: '删除失败', type: 'error' });
            }
          })
        }
      },
    })
  },
  // 添加关联人
  bindOpenLink() {
    wx.navigateTo({
      url: '../add-link/index?CustID=' + this.data.paramsCustomer.CustID,
    });
  },
  // 删除关联人
  bindCloseLink(e) {
    const { index, id } = e.currentTarget.dataset;
    let linkData = this.data.linkData;
    let _this = this;

    wx.showModal({
      content: '您确定要删除这个联系人吗?',
      cancelColor: '#666',
      confirmColor: '#ff6714',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({ title: '删除中' });
          DelCustLink({
            CustLinkID: id
          }).then(res => {
            wx.hideLoading();
            if (res.data.result === 'success') {
              $Message({ content: '删除成功', type: 'success' });
              linkData.splice(index, 1);
              _this.setData({
                linkData
              });
            } else {
              $Message({ content: '删除失败', type: 'error' });
            }
          });
        }
      },
    })
  },
  // 打开城市选择器
  bindOpenCity() {
    wx.navigateTo({
      url: '../city/index'
    })
  },
  // 编辑——根据ID获取客户——主体数据
  GetCustByID(CustID) {
    wx.showLoading({
      title: '加载中'
    });
    GetCustByID({
      CustID
    }).then(res => {
      wx.hideLoading();
      if (res.data.result === 'success') {
        let paramsCustomer = this.data.paramsCustomer,
            temptable = res.data.temptable[0] || {},
            property = '',
            propertyIndex = 0,
            index = 0;

        // 需要回填的picker选项
        let map = ['Grade', 'Marriage', 'Children', 'Income', 'Occupation', 'Assets', 'Investment', 'Decision', 'LookHouse', 'Source'];

        // picker控件数据回填
        for (let key of map) {
          if (temptable[key]) {
            property = 'picker' + key;
            propertyIndex = 'picker' + key + 'Index';
            index = this.backfillPicker(this.data[property], temptable[key]);
            this.setData({
              [propertyIndex]: index
            });
          }
        }

        this.setData({
          paramsCustomer: Object.assign({}, paramsCustomer, temptable)
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
    GetCustNeedByCustID({
      CustID
    }).then(res => {
      if (res.data.result === 'success') {
        let paramsCustNeed = this.data.paramsCustNeed;
        this.setData({
          paramsCustNeed: res.data.temptable
        })
      }
    })
  },
  // 根据客户id获取客户关系数据
  GetCustomerLinkByCustID(CustID) {
    GetCustomerLinkByCustID({
      CustID
    }).then(res => {
      if (res.data.result === 'success') {
        let linkData = this.data.linkData;
        this.setData({
          linkData: res.data.temptable
        })
      }
    })
  },
  // 修改客户——主体数据
  UpCustomer() {
    UpCustomer(this.data.paramsCustomer).then(res => {
      wx.hideLoading();
      if (res.data.result === 'success') {
        $Message({ content: '保存成功', type: 'success' });
      } 
      else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },
  // 添加客户——主体数据
  InsertCustomer() {
    InsertCustomer(this.data.paramsCustomer).then(res => {
      wx.hideLoading();
      if (res.data.result === 'success') {
        $Message({ content: '保存成功', type: 'success' });
      }
      else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },
  // 完成
  submit() {
    let paramsCustomer = this.data.paramsCustomer;
    let verify = this.verifyData(paramsCustomer);

    if (!verify.status) {
      $Message({ content: verify.msg, type: 'error' });
      return false;
    }

    wx.showLoading({ title: '保存中' });

    // 判断是添加还是编辑
    if (!this.data.CustID) {
      this.InsertCustomer();    // 添加
    }
    else {
      this.UpCustomer();      // 编辑
    }
  },
  // 验证数据
  verifyData(data) {
    let result = {
      status: false,
      msg: '错误提示'
    };
    
    if (!_fgj.verify(data.CustName, 'require')) {
      result.msg = '请填写客户名称';
      return result;
    }
    if (!_fgj.verify(data.Tel, 'phone')) {
      result.msg = '手机号格式有误';
      return result;
    }
    if (!_fgj.verify(data.Grade, 'require')) {
      result.msg = '请选择客户类型';
      return result;
    }
    if (!_fgj.verify(data.Age, 'require')) {
      result.msg = '请选择客户类型';
      return result;
    }
    if (data.Age && (data.Age > 130)) {
      result.msg = '这个客户的年龄都快成精了吧';
      return result;
    }

    result.status = true;
    result.msg = '验证通过';

    return result;
  }
})