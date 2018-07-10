
const { $Message } = require('../../../components/base/index');
import _fgj from '../../../utils/util.js';

import { InsertDepartment, GetDepartmentByID, UpDepartment } from '../../../api/organizational/organizational';

Page({
  data: {
    params: {
      DeptName: '',       // 部门名称
      Tel: '',            // 电话
      Address: '',        // 地址
      DeptType: '默认值',  // 部门类型
      FlagStatus: '1',     // 状态，默认是1
      ParentDeptNo: '',    // 上级部门编号
      Layer: '',           // 级别
    },
    pickerValueType: [
      {
        label: '类型1',
        value: '类型1'
      }, {
        label: '类型2',
        value: '类型2'
      }
    ],
    pickerValueTypeIndex: 0,
    disabled: false,
    loading: false,
  },
  onLoad(options) {
    console.log('参数', options)
    let { DeptID, Layer } = options;
    let params = this.data.params;

    Layer && (params.Layer = Layer);
    DeptID && (params.DeptID = DeptID);

    this.setData({
      params
    });

    // 有部门ID就是编辑
    if (DeptID) {
      wx.setNavigationBarTitle({
        title: '编辑部门'
      });
      this.GetDepartmentByID(DeptID);    // 获取需要编辑的数据
    } else {
      wx.setNavigationBarTitle({
        title: '新建部门'
      });
    }
  },
  onReady: function () {
  },
  onShow: function () {
  },
  // 获取需要编辑的数据
  GetDepartmentByID(DeptID) {
    let { params, pickerValueType } = this.data;

    wx.showLoading({ title: '加载中' });
    GetDepartmentByID({
      DeptID
    }).then(res => {
      // console.log(res)
      if (res.data.result === 'success') {
        let temptable = res.data.temptable[0];
        let pickerValueTypeIndex = 0;
        let newObj = Object.assign({}, params, temptable);

        // 回填切换
        for (let i = 0, length = pickerValueType.length; i < length; i++) {
          if (temptable.DeptType === pickerValueType[i].value) {
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
      this.setData({
        disabled: true,
        loading: true
      });
      wx.showLoading({ title: '稍等' });
      
      if (params.DeptID) {
        this.UpDepartment();    // 编辑
      } else {
        this.InsertDepartment();  // 新建
      }
    } else {
      $Message({ content: verify.msg, type: 'error' });
    }
  },
  // 新建
  InsertDepartment() {
    let params = this.data.params;

    InsertDepartment(params).then(res => {
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
  UpDepartment() {
    let params = this.data.params;

    UpDepartment(params).then(res => {
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
    if (!_fgj.verify(data.DeptName, 'require')) {
      result.msg = '部门名称不能为空';
      return result;
    };
    if (!_fgj.verify(data.DeptType, 'require')) {
      result.msg = '请选择部门类型';
      return result;
    };
    result.status = true;
    result.msg = '验证通过';
    return result;
  },
})