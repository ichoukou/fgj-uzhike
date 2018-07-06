
const { $Message } = require('../../components/base/index');
import { InsertUserGroup, GetAllUserGroup, UpUserGroup } from '../../api/userGroup/userGroup';

Page({
  data: {
    groupData: [],
    modalType: 'new',    // 记录弹窗当前的作用，是新建还是编辑
    UserGroupID: '',    // 记录要编辑的用户组ID
    loader: false,    // 加载中
    isClick: false,   // 只能点一次
  },
  onLoad: function (options) {
    this.modalInput = this.selectComponent('#modalInput');
  },
  onReady: function () {
    this.getGroupData();    // 获取所有用户组数据
  },
  onShow: function () {
    // let str = "Employee-Select-1,Employee-Insert-1,Employee-Update-1,Employee-Delete-1,testTable1-testItem1-1,testTable1-testItem2-本师,testTable1-testItem3-1,"

    // let oneArr = str.split(',');
    // let obj = {};
    // let listArr = [];

    // oneArr.forEach(item => {
    //   if (item) {
    //     listArr = item.split('-');
    //     console.log(listArr)
    //     if (!obj[listArr[0]]) {
    //       obj[listArr[0]] = {
    //         [listArr[1]]: listArr[2]
    //       }
    //     } else {
    //       obj[listArr[0]][listArr[1]] = listArr[2]
    //     }
    //   }
    // })
    // console.log(obj)

  },
  // 获取所有用户组数据
  getGroupData() {
    GetAllUserGroup().then(res => {
      console.log(res)
      this.setData({
        loader: true
      });
      let data = res.data;
      if (data.result === 'success') {
        this.setData({
          groupData: data.temptable
        });
      } else {
        $Message({ content: data.msg, type: 'warning' })
      }
    })
  },
  // 新建用户组
  bindNew() {
    this.data.modalType = 'new';
    this.modalInput.onShowModal();
  },
  // 模态输入框返回事件
  bindModalInput(e) {
    console.log(e)
    let data = this.data;
    let GroupName = e.detail.inputValue;
    if (!this.data.isClick) {
      this.data.isClick = true;
      if (data.modalType === 'new') {
        this.newGroup(GroupName);    // 新建用户组
      }
      else if (data.modalType === 'edit') {
        this.editGroup(GroupName)   // 编辑用户组
      }
    }
  },
  // 新建用户组
  newGroup(GroupName) {
    InsertUserGroup({
      GroupName
    })
      .then(res => {
        this.data.isClick = false;
        this.modalInput.onHideModal();
        console.log(res)
        if (res.data.result === 'success') {
          $Message({ content: '新建成功', type: 'success' });
          this.getGroupData();    // 新建成功后再次获取所有用户组数据
        } else {
          $Message({ content: res.data.msg, type: 'error' });
        }
      })
  },
  // 用户组操作
  bindActionSheet(e) {
    let _this = this;
    console.log(e.currentTarget)
    let { userGroupId, groupName } = e.currentTarget.dataset;
    wx.showActionSheet({
      itemList: ['启用', '禁用', '编辑', '设置权限'],
      success: function (res) {
        console.log(res.tapIndex)
        _this.data.UserGroupID = userGroupId;
        switch(res.tapIndex) {
          case 0:
          break;
          case 1:
          break;
          case 2:
            _this.actionEdit(groupName);
          break;
          case 3:
            // 设置权限
            wx.navigateTo({
              url: '../purview-set/index?ObjType=1&ObjID=' + userGroupId
            });
          break;
          default:
            console.log('tapIndex异常')
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  // 编辑用户组
  actionEdit(GroupName) {
    this.data.modalType = 'edit';
    this.modalInput.onShowModal({
      inputValue: GroupName
    });
  },
  // 编辑用户组
  editGroup(GroupName) {
    let UserGroupID = this.data.UserGroupID;
    UpUserGroup({
      UserGroupID,
      GroupName
    })
      .then(res => {
        this.data.isClick = false;
        this.modalInput.onHideModal();
        console.log(res)
        if (res.data.result === 'success') {
          $Message({ content: '编辑成功', type: 'success' });
          this.getGroupData();    // 新建成功后再次获取所有用户组数据
        } else {
          $Message({ content: res.data.msg, type: 'error' });
        }
      })
  },
})