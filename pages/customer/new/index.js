
const { $Message } = require('../../../components/base/index');
import GUID from '../../../utils/guid';
import data from './pickerData';       // 保存所有选项数据
import _fgj from '../../../utils/util';

import { InsertCustomer, GetCustByID, GetCustomerLinkByCustID, UpCustomer } from '../../../api/customer/new';
import { DelCustLink } from '../../../api/customer/add-link';
import { DelCustNeed, UpCustomerNeed } from '../../../api/customer/add-need';

// 保存需求选项数据
const NeedObjs = {
  unit: '万元',       // 判断需求类型决定显示 元 还是 万元
  Area: ['请选择', '请选择', '请选择'],     // 区域
  pickerNeedType: data.pickerNeedType,
  pickerNeedTypeIndex: 0,
  propertyType: [
    {
      label: '住宅',
      value: '住宅'
    }, {
      label: '公寓',
      value: '公寓'
    }, {
      label: '写字楼',
      value: '写字楼'
    }, {
      label: '商铺',
      value: '商铺'
    }, {
      label: '厂房',
      value: '厂房'
    }, {
      label: '其他',
      value: '其他'
    },
  ],
  pickerRoom: data.pickerRoom,
  pickerRoomIndex: 0,
}

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
    pickerNeedData: [],     // 根据数据需求个数，填充对应的筛选项
  },
  onLoad: function (options) {
    let CustID = options.CustID || '7708F6394133EFA611660B925FEE6301';
    let paramsCustomer = this.data.paramsCustomer;

    // 有CustID就是编辑
    if (CustID) {
      paramsCustomer.CustID = CustID;
      this.GetCustByID(CustID);
      // this.GetCustomerLinkByCustID(CustID);
    } else {
      paramsCustomer.CustID = guidstr;    // 临时ID
    }
    this.data.CustID = CustID || '';      // 全局保存
  },
  onReady: function () {
  },
  onShow: function () {
    // 发送请求之后，如果权限不足回跳到登陆页面，登陆成功返回之后，可以再次上传
    // this.setData({
    //   loading: false,
    //   disabled: false,
    // });
  },
  // 监听input改变——客户主体数据
  changeCustomerInput(e) {
    let { types } = e.currentTarget.dataset;
    let paramsCustomer = this.data.paramsCustomer;

    paramsCustomer[types] = e.detail.value;
    this.setData({
      paramsCustomer
    });
  },
  // 监听下拉选项——客户主体数据
  bindPickerCustomerChange(e) {
    let types = e.currentTarget.dataset.types,
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
  // 添加客户需求
  bindAddNeed() {
    let { paramsCustNeed, pickerNeedData } = this.data;

    pickerNeedData.unshift({...NeedObjs});    // 同步添加需求选项，对象是引用类型，这里赋值了一份
    paramsCustNeed.unshift({});

    this.setData({
      pickerNeedData,
      paramsCustNeed,
    });
    $Message({ content: '成功添加了一条需求', type: 'success' });
  },
  // 删除客户需求
  bindClearNeed(e) {
    let index = e.currentTarget.dataset;
    let { paramsCustNeed, pickerNeedData} = this.data;
    
    paramsCustNeed.splice(index, 1);
    pickerNeedData.splice(index, 1);

    this.setData({
      paramsCustNeed,
      pickerNeedData
    });
    $Message({ content: '成功删除了一条需求', type: 'error' });
  },
  // 添加需求
  // bindOpenNeed() {
  //   let paramsCustomer = this.data.paramsCustomer;

  //   wx.navigateTo({
  //     url: `../add-need/index?CustID=${paramsCustomer.CustID}`
  //   });
  // },
  // 修改需求
  // bindOpenNeedEdit(e) {
  //   let { custid, custneedid } = e.currentTarget.dataset;
  //   wx.navigateTo({
  //     url: `../add-need/index?CustNeedID=${custneedid}&CustID=${custid}`
  //   });
  // },
  // 删除需求
  // bindCloseNeed(e) {
  //   let { index, custneedid } = e.currentTarget.dataset;
  //   let paramsCustNeed = this.data.paramsCustNeed;
  //   let _this = this;

  //   wx.showModal({
  //     content: '您确定要删除这条需求吗?',
  //     cancelColor: '#666',
  //     confirmColor: '#ff6714',
  //     success: function(res) {
  //       if (res.confirm) {
  //         DelCustNeed({
  //           CustNeedID: custneedid
  //         }).then(res => {
  //           if (res.data.result === 'success') {
  //             $Message({ content: '删除成功', type: 'success' });
  //             paramsCustNeed.splice(index, 1);
  //             _this.setData({
  //               paramsCustNeed
  //             });
  //             _this.UpCustomerNeed(paramsCustNeed);
  //           } else {
  //             $Message({ content: '删除失败', type: 'error' });
  //           }
  //         })
  //       }
  //     },
  //   })
  // },
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
        let { paramsCustomer, pickerNeedData } = this.data,
            temptable = res.data.temptable[0] || {},
            property = '',
            propertyIndex = '',
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

        this.backFillNeedData(temptable);    // 需求数据回填处理

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
  // 需求数据回填处理
  backFillNeedData(obj) {
    console.log(obj)
    let paramsCustNeed = this.data.paramsCustNeed;

    if (obj.GNeedType === '1') {
      let needObj = {};
      for (let key of Object.keys(obj)) {
        if (/^G/.test(key)) {
          let keys = key.replace(/^G/, '');   // 去掉首字母的一个字符串

          if ((keys === 'MinPrice' || keys === 'MaxPrice') && obj[key] > 10000) {
            obj[key] /= 10000;     // 处理万元
          }
          needObj[keys] = obj[key];      
          needObj.NeedType = '求购';
        }
      }
      paramsCustNeed.push(needObj);
    }
    if (obj.ZNeedType === '1') {
      let needObj = {};
      for (let key of Object.keys(obj)) {
        if (/^Z/.test(key)) {
          needObj[key.replace(/^Z/, '')] = obj[key];      // 去掉首字母，已做显示
          needObj.NeedType = '求租';
        }
      }
      paramsCustNeed.push(needObj);
    }
    if (obj.XNeedType === '1') {
      let needObj = {};
      for (let key of Object.keys(obj)) {
        if (/^X/.test(key)) {
          needObj[key.replace(/^X/, '')] = obj[key];      // 去掉首字母，已做显示
          needObj.NeedType = '装修';
        }
      }
      paramsCustNeed.push(needObj);
    }

    /**
     * 回填picker组件
     */
    let pickerNeedData = Array(paramsCustNeed.length).fill(NeedObjs);     // 根据需求个数，填充对应的选项
    let property = '',
        propertyIndex = 0,
        pickerIndex = 0;

    // 回填picker组件
    let pickerMap = ['NeedType', 'Room'];
    paramsCustNeed.forEach((item, index) => {
      // picker控件数据回填，数回填的关键在Index
      for (let key of pickerMap) {
        if (item[key]) {
          property = 'picker' + key;
          propertyIndex = 'picker' + key + 'Index';
          pickerIndex = this.backfillPicker(pickerNeedData[index][property], item[key]);
          // console.log('下标', pickerIndex);
          pickerNeedData[index][propertyIndex] = pickerIndex;
        }
      }
      pickerNeedData[index].Area = item.Area.split('-');    // 区域
    }); 
    
    this.setData({
      paramsCustNeed,
      pickerNeedData
    });
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
  // 完成
  submit() {
    let { paramsCustomer, paramsCustNeed } = this.data;
    let verifyCustomer = this.verifyCustomerData(paramsCustomer);

    // 先验证主体内容
    if (!verifyCustomer.status) {
      $Message({ content: verifyCustomer.msg, type: 'error' });
      return false;
    }

    // 必须要有一个客户需求
    if (!this.data.paramsCustNeed.length) {
      $Message({ content: '请添加客户需求', type: 'error' });
      return false;
    }

    console.log('需求数据', paramsCustNeed)

    // 验证需求内容，需求是一个数组
    for (let obj of paramsCustNeed) {
      let verifyNeed = this.verifyNeedData(obj);
      if (!verifyNeed.status) {
        $Message({ content: verifyNeed.msg, type: 'error' });
        return false;
      }
    }

    let needObj = this.filterNeedData(paramsCustNeed);      // 处理需求数据，根据类型把对象拼接起来

    console.log(needObj)

    // 最终合并主体数据和需求数据
    let params = Object.assign({}, paramsCustomer, needObj);

    console.log('数据', params)

    // 防止重复点击
    if (this.data.disabled) {
      return false;
    }
    wx.showLoading({ title: '保存中' });
    this.setData({
      loading: true,
      disabled: true,
    });

    // 判断是添加还是编辑
    if (!this.data.CustID) {
      this.InsertCustomer(params);    // 添加
    }
    else {
      this.UpCustomer(params);      // 编辑
    }
  },
  // 处理需求数据，根据类型把对象拼接起来
  filterNeedData(array) {
    let obj = {};

    array.forEach(item => {
      switch (item.NeedType) {
        case '求购':
          for (let key of Object.keys(item)) {
            if ((key === 'MinPrice' || key === 'MaxPrice') && item[key] < 10000) {
              item[key] *= 10000;   // 处理万元
            }
            if (key === 'NeedType') {
              item[key] = '1'
            }
            obj['G' + key] = item[key];
          }
        break;
        case '求租':
          for (let key of Object.keys(item)) {
            if (key === 'NeedType') {
              item[key] = '1'
            }
            obj['Z' + key] = item[key];
          }
        break;
        case '装修':
          for (let key of Object.keys(item)) {
            if (key === 'NeedType') {
              item[key] = '1'
            }
            obj['X' + key] = item[key];
          }
        break;
        default:
          console.log('只有三种类型');
      }
    });
    return obj;
  },
  // 添加客户——主体数据
  InsertCustomer(params) {
    InsertCustomer(params).then(res => {

      wx.hideLoading();
      this.setData({
        loading: false,
        disabled: false,
      });

      if (res.data.result === 'success') {
        $Message({ content: '添加成功', type: 'success' });
        this.emptyData();     // 上传成后清空已上传的一些数据
        setTimeout(() => {
          wx.navigateBack();
        }, 1000);
      }
      else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },
  // 修改客户数据
  UpCustomer(params) {
    console.log(params)
    UpCustomer(params).then(res => {
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
  // 清空已上传的一些数据
  emptyData() {
    let guidstr = guid.newGUID().toUpperCase();

    this.setData({
      paramsCustomer: {
        CustID: guidstr
      },
      paramsCustNeed: [],
      pickerNeedData: [],
    });
  },
  // 验证主体内容数据
  verifyCustomerData(data) {
    let result = {
      status: false,
      msg: '错误提示'
    };
    
    if (!_fgj.verify(data.CustName, 'require')) {
      result.msg = '请填写客户名称';
      return result;
    }
    // 验证正常手机号码，或前五后二位手机号码
    if (!_fgj.verify(data.Tel, 'phone') && !_fgj.verify(data.Tel, 'phone-mark')) {
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
  },
  // 验证客户需求数据
  verifyNeedData(data) {
    let result = {
      status: false,
      msg: '错误提示'
    };
    // 验证需求
    if (!_fgj.verify(data.NeedType, 'require')) {
      result.msg = '请选择需求类型';
      return result;
    };
    if (!_fgj.verify(data.Area, 'require')) {
      result.msg = '请选择区域';
      return result;
    };
    if (!_fgj.verify(data.PropertyType, 'require')) {
      result.msg = '请选择产权性质';
      return result;
    };
    if (!_fgj.verify(data.Room, 'require')) {
      result.msg = '请选择户型';
      return result;
    };
    if (!_fgj.verify(data.MinSquare, 'number-dot')) {
      result.msg = '请填写最小面积';
      return result;
    };
    if (!_fgj.verify(data.MaxSquare, 'number-dot')) {
      result.msg = '请填写最大面积';
      return result;
    };
    if (!_fgj.verify(data.MinPrice, 'number-dot')) {
      result.msg = '请填写最小价位';
      return result;
    };
    if (!_fgj.verify(data.MaxPrice, 'number-dot')) {
      result.msg = '请填写最大价位';
      return result;
    };
    if (Number(data.MinSquare) > Number(data.MaxSquare)) {
      result.msg = '最小面积不能大于最大面积';
      return result;
    }
    if (Number(data.MinPrice) > Number(data.MaxPrice)) {
      result.msg = '最低价位不能高于最高价位';
      return result;
    }

    result.status = true;
    result.msg = '验证通过';

    return result;
  },

  /**
   * 处理客户需求
   */
  // 根据CustNeedID获取客户需求
  GetCustNeedByID(CustNeedID) {
    wx.showLoading({
      title: '加载中'
    });
    GetCustNeedByID({
      CustNeedID
    }).then(res => {
      wx.hideLoading();
      if (res.data.result === 'success') {
        let paramsCustNeed = this.data.paramsCustNeed,
          temptable = res.data.temptable[0] || {},
          property = '',
          propertyIndex = 0,
          index = 0;

        let map = ['NeedType', 'Room'];

        // 根据需求类型修改属性选项
        this.selectNeedType(temptable.NeedType);

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
        // 回填区域
        this.setData({
          Area: temptable.Area.split('-')
        });

        // 处理数据价位
        if (temptable.NeedType === '求购') {
          temptable.MinPrice = temptable.MinPrice / 10000;
          temptable.MaxPrice = temptable.MaxPrice / 10000;
        }

        this.setData({
          paramsCustNeed: Object.assign({}, paramsCustNeed, temptable)
        });

      } else {
        $Message({ content: res.data.msg, type: 'error' });
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
  // 区域
  bindAreaChange: function (e) {
    let index = e.currentTarget.dataset.index;
    let value = e.detail.value;
    let { paramsCustNeed, pickerNeedData } = this.data

    paramsCustNeed[index].Area = value.join('-');
    pickerNeedData[index].Area = value;

    this.setData({
      paramsCustNeed,
      pickerNeedData,
    });
  },
  // 产权性质多选
  changeCheckbox(e) {
    let index = e.currentTarget.dataset.index;
    let { value, items } = e.detail;
    let { paramsCustNeed, pickerNeedData } = this.data

    paramsCustNeed[index].PropertyType = value.join('/');
    pickerNeedData[index].propertyType = items;

    console.log(items);

    this.setData({
      paramsCustNeed,
      pickerNeedData
    });
  },
  // 监听下拉选项
  bindPickerCustNeedChange(e) {
    let { paramsCustNeed, pickerNeedData } = this.data,
        { types, index } = e.currentTarget.dataset,
        currentIndex = e.detail.value,
        property = 'picker' + types,
        propertyIndex = 'picker' + types + 'Index',
        value = pickerNeedData[index][property][currentIndex].value;

    paramsCustNeed[index][types] = value;
    pickerNeedData[index][propertyIndex] = currentIndex;

    // 根据需求类型修改属性选项
    if (types === 'NeedType') {
      // 处理户型
      this.selectNeedType(value, index);

      // 处理价位单位
      if (value === '求购') {
        pickerNeedData[index].unit = '万元';
      } else {
        pickerNeedData[index].unit = '元';
      }
    }

    console.log(pickerNeedData)

    this.setData({
      paramsCustNeed,
      pickerNeedData
    });
  },
  // 根据需求类型修改属性选项
  selectNeedType(value, index) {
    let picker = [],
      pickerIndex = 0,
      pickerNeedData = this.data.pickerNeedData;

    // 处理价位单位
    if (value === '求购') {
      pickerNeedData[index].unit = '万元';
    } else {
      pickerNeedData[index].unit = '元';
    }

    // 产权属性，当需求不为求购、求租时，默认为其他
    if (value !== '求购' && value !== '求租') {
      picker = [
        {
          label: '其他',
          value: '其他'
        }
      ];
      // 重置已选的数据
      pickerNeedData[index].Room = '';
      pickerNeedData[index].pickerRoom = picker;
      pickerNeedData[index].pickerRoomIndex = pickerIndex;
      this.setData({
        pickerNeedData
      });
    } else {
      pickerNeedData[index].pickerRoom = NeedObjs.pickerRoom;
      this.setData({
        pickerNeedData
      });
    }
  },
  // 监听input改变
  changeCustNeedInput(e) {
    let { types, index } = e.currentTarget.dataset;
    let paramsCustNeed = this.data.paramsCustNeed;

    paramsCustNeed[index][types] = e.detail.value;

    this.setData({
      paramsCustNeed
    });
  },
})