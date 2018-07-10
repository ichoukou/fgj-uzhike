
const { $Message } = require('../../components/base/index');
import { GetAllDepartment } from '../../api/organizational/organizational';

Page({
  data: {
    params: {},
    listData: [],
    UserGroupID: '',    // 记录要编辑的用户组ID
    loading: false,    // 加载中
    isClick: false,   // 只能点一次
  },
  onLoad: function (options) {
  },
  onReady: function () {
  },
  onShow: function () {
    wx.showLoading({ title: '加载中' });
    this.GetAllDepartment();    // 获取所有部门
  },
  // 获取所有部门
  GetAllDepartment() {
    GetAllDepartment(this.data.params).then(res => {
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
      url: './new/index?isNew=true&Layer=0'
    })
  },
  // 打开下一级
  bindOpenChild(e) {
    let { deptNo } = e.currentTarget.dataset;
    wx.navigateTo({
      url: './child-1/index?&DeptNo=' + deptNo
    })
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
        switch(res.tapIndex) {
          case 0:
            wx.navigateTo({
              url: './new/index?&DeptID=' + deptId
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