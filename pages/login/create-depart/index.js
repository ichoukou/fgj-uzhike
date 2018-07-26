const { $Message } = require('../../../components/base/index');
import { InsertDepartment } from '../../../api/organizational/department.js';
import _fgj from '../../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    deptType: ['类型一', '类型二', '类型三'],
    index: 0,
    params: {
      DeptName: '',  // 部门名称
      Address: ''   // 地址
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  bindTypeChange() {
    this.setData({
      index: e.detail.value
    })
  },
  // 监听input事件
  inputChange (e) {
    let { type } = e.currentTarget.dataset
    let params = this.data.params;
    params[type] = e.detail.value;
    this.setData({
      params
    })
  },
  // 完成
  submit () {
    let params = this.data.params
    let result = this.verifyData(params);
    let data = Object.assign({}, {
      Layer: 1,
      DeptType: this.data.deptType[this.data.index]
    }, params)
    if(result.status) {
      this.insertDepartment(data)
    } else {
      $Message({ content: result.msg, type: 'error'})
    }
  },
  // 自定义部门
  insertDepartment (params) {
    InsertDepartment(params).then(res => {
      console.log(res)
      let data = res.data
      if(data.result === 'success') {
        $Message({ content: '新建成功', type: 'success'})
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      } else {
        $Message({ content: data.msg, type: 'error'})
      }
    })
  },
  // 校验数据
  verifyData(data) {
    let result = {
      status: false,
      msg: '错误提示'
    };
    if (!_fgj.verify(data.DeptName, 'require')) {
      result.msg = '请填写部门名称';
      return result;
    };
    // if (!_fgj.verify(data.Address, 'require')) {
    //   result.msg = '请填写部门地址';
    //   return result;
    // };
    result.status = true;
    result.msg = '验证通过';
    return result;
  }
})