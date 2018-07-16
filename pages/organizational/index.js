
const { $Message } = require('../../components/base/index');
import _fgj from '../../utils/util.js';
import { GetDepartmentByDeptNo, UpDepartmentStatus } from '../../api/organizational/department';

Page({
  data: {
    params: {
      Layer: '0',     // 当前级别
    },
    ParentNote: ['组织架构'], // 页面层级导航
    listData: [],
    UserGroupID: '',  // 记录要编辑的用户组ID
    loading: false,   // 加载中
    isClick: false,   // 只能点一次
  },
  onLoad: function (options) {
  },
  onReady: function () {
  },
  onShow: function () {
    wx.showLoading({ title: '加载中' });
    this.GetDepartmentByDeptNo();    // 获取所有部门
  },
  // 获取所有部门
  GetDepartmentByDeptNo() {
    GetDepartmentByDeptNo(this.data.params).then(res => {
      console.log(res)
      let data = res.data;
      if (data.result === 'success') {
        this.setData({
          listData: data.temptable
        });
      } else {
        $Message({ content: data.msg, type: 'warning' })
      };
      wx.hideLoading();
      this.setData({ loading: true });
    })
  },
  // 新建职务
  bindNew() {
    wx.navigateTo({
      url: './new/index?Layer=' + this.data.params.Layer
    })
  },
  // 打开下一级
  bindOpenChild(e) {
    let { deptNo, deptName, deptId } = e.currentTarget.dataset;
    let data = this.data;
    let ParentNote = [].concat(data.ParentNote);

    ParentNote.push(deptName);   // 拼接导航地址

    let query = {
      Layer: data.params.Layer,
      DeptNo: deptNo,
      DeptName: deptName,
      DeptID: deptId,
      ParentNote: ParentNote.join(',')
    };

    wx.navigateTo({
      url: './child-1/index?' + _fgj.param(query)
    })
  },
  // 用户组操作
  bindActionSheet(e) {
    let _this = this;
    console.log(e.currentTarget.dataset)
    let { deptId, flagStatus } = e.currentTarget.dataset;
    let itemList = ['编辑', '无效'];

    if (flagStatus === '无效') {
      itemList = ['编辑', '有效']
    };

    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        switch(res.tapIndex) {
          case 0:
            wx.navigateTo({
              url: './new/index?&DeptID=' + deptId
            });
          break;
          case 1:
            _this.UpDepartmentStatus(deptId, itemList[res.tapIndex])
          break;
          default:
            console.log('tapIndex异常')
        }
      },
      fail: function (res) {
        // console.log(res.errMsg)
      }
    })
  },
  // 修改状态
  UpDepartmentStatus(DeptID, FlagStatus) {
    wx.showLoading({ title: '加载中' });
    UpDepartmentStatus({
      DeptID,
      FlagStatus
    })
    .then(res => {
      // console.log(res)
      wx.hideLoading();
      if (res.data.result === 'success') {
        $Message({ content: '修改成功', type: 'success' }); 
        this.GetDepartmentByDeptNo();    // 获取所有用户组数据
      } else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  }
})