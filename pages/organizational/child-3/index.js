
const { $Message } = require('../../../components/base/index');
import _fgj from '../../../utils/util';
import { maximum } from '../../../utils/config';
import { GetDepartmentByDeptNo } from '../../../api/organizational/organizational';

const path = 3;   // 当前级别，也是页面索引

Page({
  data: {
    params: {
      Layer: path,         // 当前级别
      ParentDeptName: '', // 上级部门名称
      ParentDeptNo: '',   // 上级部门编号
    },
    ParentNote: [],     // 页面层级导航
    listData: [],
    UserGroupID: '',    // 记录要编辑的用户组ID
    loading: false,    // 加载中
    isClick: false,   // 只能点一次
  },
  onLoad: function (options) {
    console.log('child-' + path, options)
    let { DeptName, DeptNo, ParentNote } = options;
    let params = this.data.params;

    params.ParentDeptName = DeptName;
    params.ParentDeptNo = DeptNo;

    // 设置标题
    wx.setNavigationBarTitle({
      title: DeptName
    });

    this.setData({
      params,
      ParentNote: ParentNote.split(/,/)
    });
  },
  onReady: function () {
  },
  onShow: function () {
    wx.showLoading({ title: '加载中' });
    this.GetDepartmentByDeptNo();    // 获取所有部门
    console.log('onShow', this.data.ParentNote)
  },
  // 获取所有部门
  GetDepartmentByDeptNo() {
    let { ParentDeptNo, Layer } = this.data.params;

    GetDepartmentByDeptNo({
      DeptNo: ParentDeptNo,
      Layer
    }).then(res => {
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
      url: '../new/index?' + _fgj.param(this.data.params)
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
  // 返回
  bindBack(e) {
    let { index } = e.currentTarget.dataset;
    let ParentNote = this.data.ParentNote;
    ++index;      // 默认是从 0 开始，所以要加 1

    // 最后一个不能点
    if (index === ParentNote.length) {
      return
    };

    wx.navigateBack({
      delta: Math.abs(index - ParentNote.length)
    });
  },
  // 用户组操作
  bindActionSheet(e) {
    let _this = this;
    console.log(e.currentTarget.dataset)
    let { deptId } = e.currentTarget.dataset;
    let itemList = ['编辑', '作废'];

    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        switch (res.tapIndex) {
          case 0:
            wx.navigateTo({
              url: '../new/index?&DeptID=' + deptId
            });
            break;
          case 1:
            wx.showModal({
              title: '操作提示',
              content: '作废之后无法恢复，确定吗？',
              success: function (res) {
                if (res.confirm) {
                  // 
                } else if (res.cancel) {
                  // console.log('用户点击取消')
                }
              }
            })
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
  // 修改权限状态
  UpGroupStatus(UserGroupID, FlagStatus) {
    wx.showLoading({ title: '加载中' });
    UpGroupStatus({
      UserGroupID,
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