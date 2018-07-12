
const { $Message } = require('../../../components/base/index');
import _fgj from '../../../utils/util';
import { GetAllDepartment, UpDepartmentStatus } from '../../../api/organizational/department';

Page({
  data: {
    params: {},
    listData: [],
    time: null,
    loading: false,    // 加载中
    isClick: false,   // 只能点一次
  },
  onLoad: function (options) {
  },
  onReady: function () {
  },
  onShow: function () {
    this.GetAllDepartment();
  },
  // 监听input函数
  changeInput(e) {
    let params = this.data.params;
    params.likestr = e.detail.value;

    this.data.time && clearTimeout(this.data.time);
    this.data.time = setTimeout(() => {
      this.GetAllDepartment();
    }, 300);
  },
  // 获取所有部门
  GetAllDepartment() {
    wx.showLoading({
      title: '搜索中',
    });
    GetAllDepartment(this.data.params).then(res => {
      // console.log(res)
      let data = res.data;
      if (data.result === 'success') {
        this.setData({
          listData: data.temptable
        });
      }
      wx.hideLoading();
      this.setData({ loading: true });
    })
  },
  // 打开下一级
  bindOpenChild(e) {
    if (path >= maximum) {
      $Message({ content: '最多' + (maximum + 1) + '级', type: 'warning' })
      return;
    };
    let { deptNo, deptName } = e.currentTarget.dataset;
    let data = this.data;
    let ParentNote = [].concat(data.ParentNote);

    ParentNote.push(deptName);   // 拼接导航地址

    let params = {
      Layer: data.params.Layer,
      DeptNo: deptNo,
      DeptName: deptName,
      ParentNote: ParentNote.join(',')
    };
    wx.navigateTo({
      url: '../child-' + (path + 1) + '/index?' + _fgj.param(params)
    })
  },
  // 用户组操作
  bindActionSheet(e) {
    let _this = this;
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
              url: '../new/index?&DeptID=' + deptId
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
          this.GetAllDepartment();    // 获取所有用户组数据
        } else {
          $Message({ content: res.data.msg, type: 'error' });
        }
      })
  }
})