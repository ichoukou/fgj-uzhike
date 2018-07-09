
const { $Message } = require('../../../components/base/index');
import _fgj from '../../../utils/util.js';

import { GetPositionByID, InsertPosition, UpPosition } from '../../../api/position/position';

Page({
  data: {
    params: {
      PositionID: '',       // 职务id
      PositionName: '',     // 职务名称
      PositionLevel: '0',   // 职务等级
      BaseSalary: '',     // 基本薪资
      FloatSalary: '',   // 浮动薪资
    },
    pickerValueType: [
      {
        label: '0',
        value: '0'
      }, {
        label: '1',
        value: '1'
      }, {
        label: '2',
        value: '2'
      }, {
        label: '3',
        value: '3'
      }, {
        label: '4',
        value: '4'
      }
    ],
    pickerValueTypeIndex: 0,
    disabled: false,
    loading: false,
  },
  onLoad(options) {
    console.log('参数', options)
    let { isNew, PositionID } = options;
    let params = this.data.params;
    let BooIsNew = /^true$/.test(isNew);   // isNew传过来之后变成了string类型

    PositionID && (params.PositionID = PositionID);

    this.setData({
      isNew: BooIsNew,
      params
    });

    // 是新建还是编辑
    if (!BooIsNew) {
      wx.setNavigationBarTitle({
        title: '编辑职务'
      });
      this.GetPositionByID(PositionID);    // 获取需要编辑的数据
    } else {
      wx.setNavigationBarTitle({
        title: '新建职务'
      });
    }
  },
  onReady: function () {
  },
  onShow: function () {
  },
  // 获取需要编辑的数据
  GetPositionByID(PositionID) {
    let { params, pickerValueType } = this.data;

    wx.showLoading({ title: '加载中' });
    GetPositionByID({
      PositionID
    }).then(res => {
      // console.log(res)
      if (res.data.result === 'success') {
        let temptable = res.data.temptable[0];
        let pickerValueTypeIndex = 0;
        let newObj = Object.assign({}, params, temptable);

        // 处理权限类型
        for (let i = 0, length = pickerValueType.length; i < length; i++) {
          if (temptable.PositionLevel === pickerValueType[i].value) {
            pickerValueTypeIndex = i
          }
        };

        this.setData({
          pickerValueTypeIndex,
          params: newObj
        });
        wx.hideLoading();
      } else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },
  // 封装监听input函数
  changeInput(e) {
    let { type } = e.currentTarget.dataset;
    let params = this.data.params;
    params[type] = e.detail.value;
    this.setData({
      params
    });
  },
  // picker改变事件
  bindPickerChange: function (e) {
    let { params, pickerValueType, pickerValueTypeIndex } = this.data;
    let index = e.detail.value;

    params.PositionLevel = pickerValueType[index].value;
    this.setData({
      params,
      pickerValueTypeIndex: index
    })
  },
  // 点击完成
  bindSubmit() {
    let params = this.data.params;
    let verify = this.verifyData(params);   // 验证数据

    if (verify.status) {
      console.log(params)
      // 判断isNew是新建还是编辑
      this.setData({
        disabled: true,
        loading: true
      });
      if (this.data.isNew) {
        this.InsertPosition()
      } else {
        this.UpPosition();
      }
    } else {
      $Message({ content: verify.msg, type: 'error' });
    }
  },
  // 新建
  InsertPosition() {
    let params = this.data.params;
    wx.showLoading({ title: '加载中' });

    InsertPosition(params).then(res => {
      // console.log(res)
      wx.hideLoading();
      this.setData({
        disabled: false,
        loading: false
      });
      if (res.data.result === 'success') {
        $Message({ content: '新建成功', type: 'success' });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },
  // 编辑
  UpPosition() {
    let params = this.data.params;

    wx.showLoading({ title: '加载中' });
    UpPosition(params).then(res => {
      // console.log(res)
      wx.hideLoading();
      this.setData({
        disabled: false,
        loading: false
      });
      if (res.data.result === 'success') {
        $Message({ content: '编辑成功', type: 'success' });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },
  // 验证数据
  verifyData(data) {
    let result = {
      status: false,
      msg: '错误提示'
    };
    if (!_fgj.verify(data.PositionName, 'require')) {
      result.msg = '职务名称不能为空';
      return result;
    };
    if (!_fgj.verify(data.BaseSalary, 'number-dot')) {
      result.msg = '基本薪资只能是纯数字';
      return result;
    };
    if (!_fgj.verify(data.FloatSalary, 'number-dot')) {
      result.msg = '浮动薪资只能是纯数字';
      return result;
    };
    result.status = true;
    result.msg = '验证通过';
    return result;
  },
})