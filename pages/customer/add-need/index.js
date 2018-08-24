
const { $Message } = require('../../../components/base/index');
import data from '../new//pickerData';       // 保存所有选项数据
import _fgj from '../../../utils/util.js';
import { InsertCustNeed, UpdateCustNeed } from '../../../api/customer/new';
import { GetCustNeedByID } from '../../../api/customer/add-need';

Page({
  data: {
    paramsCustNeed: {
      CustID: '',
      CustNeedID: '',     // 有这个ID就是编辑
    },
    Intention: 0,         // 意向度
    Area: ['江西省', '南昌市', '高新区'],     // 区域
    pickerNeedType: data.pickerNeedType,
    pickerNeedTypeIndex: 0,
    pickerPropertyType: data.pickerPropertyType,
    pickerPropertyTypeIndex: 0,
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
    GetCustNeedByID({
      CustNeedID
    }).then(res => {
      if (res.data.result === 'success') {
        let paramsCustNeed = this.data.paramsCustNeed,
          temptable = res.data.temptable[0] || {},
          property = '',
          propertyIndex = 0,
          index = 0;

        let map = ['NeedType', 'PropertyType', 'Room'];

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
          paramsCustNeed: Object.assign({}, paramsCustNeed, temptable)
        })

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
  // 监听下拉选项
  bindPickerCustNeedChange(e) {
    let types = e.currentTarget.dataset.type,
      index = e.detail.value,
      property = 'picker' + types,
      propertyIndex = 'picker' + types + 'Index',
      paramsCustNeed = this.data.paramsCustNeed;

    paramsCustNeed[types] = this.data[property][index].value;

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
  // 监听input改变
  changeCustNeedInput(e) {
    let { type } = e.currentTarget.dataset;
    let paramsCustNeed = this.data.paramsCustNeed;

    paramsCustNeed[type] = e.detail.value;

    this.setData({
      paramsCustNeed
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
  }
})
