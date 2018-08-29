
const { $Message } = require('../../../components/base/index');
import data from '../new//pickerData';       // 保存所有选项数据
import _fgj from '../../../utils/util.js';
import { GetCustNeedByID, InsertCustNeed, UpdateCustNeed } from '../../../api/customer/add-need';

Page({
  data: {
    paramsCustNeed: {
      CustID: '',
      CustNeedID: '',     // 有这个ID就是编辑
    },
    Area: ['江西省', '南昌市', '高新区'],     // 区域
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
  },
  onLoad: function (options) {
    console.log(options)
    let { CustID, CustNeedID } = options;

    this.data.paramsCustNeed.CustID = CustID;   // 关联ID

    // 这里是编辑
    if (CustNeedID) { 
      this.data.paramsCustNeed.CustNeedID = CustNeedID;
      this.GetCustNeedByID(CustNeedID);
    }
  },
  onReady: function () {

  },
  onShow: function () {

  },
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
    let value = e.detail.value;
    let paramsCustNeed = this.data.paramsCustNeed;

    paramsCustNeed.Area = value.join('-');

    this.setData({
      Area: value,
      paramsCustNeed,
    });
  },
  // 多选
  changeCheckbox(e) {
    let value = e.detail.value;
    let paramsCustNeed = this.data.paramsCustNeed;
    paramsCustNeed.PropertyType = value.join('/');

    this.setData({
      paramsCustNeed
    });
  },
  // 监听下拉选项
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
      pickerIndex = 0,
      paramsCustNeed = this.data.paramsCustNeed;

    // 产权属性，当需求不为一手房、一二手房、租房时，默认为其他
    if (value !== '一手房' && value !== '一二手房' && value !== '租房') {
      // 重置已选的数据
      paramsCustNeed.Room = '';
      picker = [
        {
          label: '其他',
          value: '其他'
        }
      ];
      this.setData({
        pickerRoom: picker,
        pickerRoomIndex: pickerIndex
      });
    } else {
      this.setData({
        pickerRoom: data.pickerRoom
      });
    }
  },
  // 监听input改变
  changeCustNeedInput(e) {
    let { type } = e.currentTarget.dataset;
    let paramsCustNeed = this.data.paramsCustNeed;

    paramsCustNeed[type] = e.detail.value;

    console.log(paramsCustNeed)

    this.setData({
      paramsCustNeed
    });
  },
  // 完成
  submit() {
    let params = this.data.paramsCustNeed;
    let verify = this.verifyData(params);

    if (!verify.status) {
      $Message({ content: verify.msg, type: 'error' });
      return false;
    }

    if (params.CustNeedID) {
      this.UpdateCustNeed(params);          // 编辑
    } else {
      this.InsertCustNeed(params);    // 新建
    }
  },
  // 新建需求
  InsertCustNeed(params) {
    wx.showLoading({ title: '添加中' });
    InsertCustNeed(params).then(res => {
      wx.hideLoading();
      if (res.data.result === 'success') {
        $Message({ content: '添加成功', type: 'success' });
        // 通过上一个页面，添加需求内容
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2]; // 上一个页面
        let paramsCustNeed = prevPage.data.paramsCustNeed;

        params.CustNeedID = res.data.CustNeedID;    // 附加CustNeedID，用作删除和编辑

        paramsCustNeed.push(params);
        prevPage.setData({
          paramsCustNeed
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1000);
      }
      else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    });
  },
  // 编辑需求
  UpdateCustNeed(params) {
    wx.showLoading({ title: '修改中' });
    UpdateCustNeed(params).then(res => {
      wx.hideLoading();
      if (res.data.result === 'success') {
        $Message({ content: '修改中成功', type: 'success' });
        setTimeout(() => {
          wx.navigateBack();
        }, 1200);
      }
      else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    });
  },
  // 验证数据
  verifyData(data) {
    let result = {
      status: false,
      msg: '错误提示'
    };
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
    result.status = true;
    result.msg = '验证通过';

    return result;
  },
  onUnload() {
    
  }
})
