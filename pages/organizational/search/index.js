
const { $Message } = require('../../../components/base/index');
import _fgj from '../../../utils/util';
import { GetAllDepartment, UpDepartmentStatus } from '../../../api/organizational/department';
import { GetAllEmployee } from '../../../api/organizational/employee';
import { MAXIMUM, URL_PATH, DEFAULT_IMG } from '../../../utils/config';

Page({
  data: {
    params: {},
    depData: [],        // 部门数据
    empData: [],        // 人员数据
    time: null,
    loading: false,    // 加载中
    isClick: false,   // 只能点一次
  },
  onLoad: function (options) {
  },
  onReady: function () {
  },
  onShow: function () {
    this.getAllData();
  },
  // 监听input函数
  changeInput(e) {
    let params = this.data.params;
    params.likestr = e.detail.value;

    this.data.time && clearTimeout(this.data.time);
    this.data.time = setTimeout(() => {
      this.getAllData();
    }, 300);
  },
  // 搜索返回结果
  bindQuery(e) {
    let params = this.data.params;
    params.likestr = e.detail.value;

    this.data.time && clearTimeout(this.data.time);
    this.data.time = setTimeout(() => {
      this.getAllData();
    }, 300);
  },
  // 根据筛选条件获取部门和人员数据
  getAllData() {
    wx.showLoading({
      title: '搜索中',
    });
    this.GetAllDepartment();
    this.GetAllEmployee();
  },
  // 获取部门
  GetAllDepartment() {
    GetAllDepartment(this.data.params).then(res => {
      // console.log(res)
      let data = res.data;
      if (data.result === 'success') {
        this.setData({
          depData: data.temptable
        });
      } else {
        this.setData({
          depData: []
        });
      }
    });
  },
  // 获取人员
  GetAllEmployee() {
    GetAllEmployee(this.data.params).then(res => {
      // console.log(res)
      let data = res.data;
      if (data.result === 'success') {
        data.temptable.forEach(item => {
          item.EmpImg = item.EmpImg ? URL_PATH + item.EmpImg : DEFAULT_IMG;     // 处理图片
        });
        this.setData({
          empData: data.temptable
        });
      } else {
        this.setData({
          empData: []
        });
      }
      wx.hideLoading();
      this.setData({ loading: true });
    })
  },
  // 打开下一级
  bindOpenChild(e) {
    if (path >= MAXIMUM) {
      $Message({ content: '最多' + (MAXIMUM + 1) + '级', type: 'warning' })
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
  // 人员更多操作
  bindActionEmp(e) {
    let { empId } = e.currentTarget.dataset;
    let itemList = ['编辑', '设置权限'];

    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        switch (res.tapIndex) {
          case 0:
            wx.navigateTo({
              url: '../emp-edit/index?EmpID=' + empId
            })
            break;
          case 1:
            wx.navigateTo({
              url: '../../purview-set/index?ObjType=0&ObjID=' + empId     // ObjType = 0 人员
            })
            break;
          default:
            console.log('tapIndex异常')
        }
      }
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
        switch (res.tapIndex) {
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