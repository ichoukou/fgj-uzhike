
const { $Message } = require('../../../components/base/index');
import GUID from '../../../utils/guid';
import data from './pickerData';       // 保存所有选项数据
import _fgj from '../../../utils/util';

import { InsertCustomer, GetCustByID, GetCustNeedByCustID, GetCustomerLinkByCustID, UpCustomer } from '../../../api/customer/new';
import { DelCustLink } from '../../../api/customer/add-link';
import { DelCustNeed, UpCustomerNeed } from '../../../api/customer/add-need';

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
    loading: false,
    disabled: false,
  },
  onLoad: function (options) {
    let { CustID } = options;
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
    // 发送请求之后，如果权限不足回跳到登陆页面，登陆成功返回之后，可以再次上传
    this.setData({
      loading: false,
      disabled: false,
    });
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
  },
  // 添加需求
  bindOpenNeed() {
    let paramsCustomer = this.data.paramsCustomer;

    wx.navigateTo({
      url: `../add-need/index?CustID=${paramsCustomer.CustID}`
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
              _this.UpCustomerNeed(paramsCustNeed);
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
        let temptable = res.data.temptable;

        this.disposePice(temptable);
        
        this.setData({
          paramsCustNeed: res.data.temptable
        });
      }
    })
  },
  // 处理价位单价
  disposePice(arr = []) {
    for (let item of arr) {
      if (item.NeedType === '求购') {
        item.MinPrice = item.MinPrice / 10000;
        item.MaxPrice = item.MaxPrice / 10000;
      }
    }
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
      this.setData({
        loading: false,
        disabled: false,
      });
      if (res.data.result === 'success') {
        $Message({ content: '保存成功', type: 'success' });
        setTimeout(() => {
          wx.navigateBack();
        }, 1000);
      } 
      else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },
  // 添加客户——主体数据
  InsertCustomer() {
    let { paramsCustomer, paramsCustNeed } = this.data;
    // 在主体内容上附加需求数据
    let custNeedObj = this.addCustNeedData(paramsCustNeed);
    // 拼接到主体数据内
    let params = Object.assign({}, paramsCustomer, custNeedObj);

    InsertCustomer(params).then(res => {
      wx.hideLoading();
      this.setData({
        loading: false,
        disabled: false,
      });
      if (res.data.result === 'success') {
        $Message({ content: '添加成功', type: 'success' });
        setTimeout(() => {
          wx.navigateBack();
        }, 1000);
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

    // 必须要有一个客户需求
    if (!this.data.paramsCustNeed.length) {
      $Message({ content: '请添加客户需求', type: 'error' });
      return false;
    }

    wx.showLoading({ title: '保存中' });
    this.setData({
      loading: true,
      disabled: true,
    });

    // 判断是添加还是编辑
    if (!this.data.CustID) {
      this.InsertCustomer();    // 添加
    }
    else {
      this.UpCustomer();      // 编辑
    }
  },
  // 单独修改客户需求到客户主体
  UpCustomerNeed(needData) {
    let params = this.addCustNeedData(needData)
    params.CustID = this.data.CustID;

    UpCustomerNeed(params).then(res => {
      if (res.data.result === 'success') {
        console.log('上传成功')
      } else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    });
  },
  // 在主体内容上附加需求数据， 返回拼接好的数据
  addCustNeedData(needData) {
    let custNeedObj = {
      NeedType: '',
      PropertyType: '',
      Area: '',
      Room: '',
      MinGSquare: 0,
      MaxGSquare: 0,
      MinZSquare: 0,
      MaxZSquare: 0,
      MinXSquare: 0,
      MaxXSquare: 0,
      MinGPrice: 0,
      MaxGPrice: 0,
      MinZPrice: 0,
      MaxZPrice: 0,
      MinXPrice: 0,
      MaxXPrice: 0,
    };

    needData.forEach(item => {
      for (let key of Object.keys(item)) {
        // 只针对部分字段做拼接
        if (key === 'NeedType' || key === 'PropertyType' || key === 'Area' || key === 'Room') {
          if (custNeedObj[key]) {
            custNeedObj[key] = custNeedObj[key] + '|' + item[key]
          } else {
            custNeedObj[key] = '|' + item[key]
          }
        }
      }
      // 面积和价位有对应的字段，根据类型对应
      switch (item.NeedType) {
        case '求购':
          custNeedObj.MinGSquare = item.MinSquare;
          custNeedObj.MaxGSquare = item.MaxSquare;
          custNeedObj.MinGPrice = item.MinPrice;
          custNeedObj.MaxGPrice = item.MaxPrice;
          break;
        case '求租':
          custNeedObj.MinZSquare = item.MinSquare;
          custNeedObj.MaxZSquare = item.MaxSquare;
          custNeedObj.MinZPrice = item.MinPrice;
          custNeedObj.MaxZPrice = item.MaxPrice;
          break;
        case '装修':
          custNeedObj.MinXSquare = item.MinSquare;
          custNeedObj.MaxXSquare = item.MaxSquare;
          custNeedObj.MinXPrice = item.MinPrice;
          custNeedObj.MaxXPrice = item.MaxPrice;
          break;
        default:
          console.log('你敢走到这里来试试');
      }
    });
    return custNeedObj
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
    if (data.Age && (data.Age > 120)) {
      result.msg = '您这个客户的年龄都快成精了吧';
      return result;
    }
    if (data.Email && !_fgj.verify(data.Email, 'email')) {
      result.msg = '邮箱格式有误';
      return result;
    }

    result.status = true;
    result.msg = '验证通过';

    return result;
  }
})