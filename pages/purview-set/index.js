
const { $Message } = require('../../components/base/index');
import _fgj from '../../utils/util';
import { GetPurviewListByLayer } from '../../api/purview/purview';

Page({
  data: {
    ObjType: '',    // 对象类型   0：人员  1：用户组
    ObjID: '',      // 对象id
    params: {
      pagetype: '1',   // 传递页面类型
      ParentID: '',   // 父级id
      LevelType: 0,   // 层级，当前层级是 0
    },
    ParentNote: ['权限设置'], // 页面层级导航
    modalTitleText: '',
    groupData: [],    // 组数据
    loading: false,  // 数据加载中
  },
  onLoad(options) {
    console.log('设置权限', options)
    this.setData({
      ObjType: options.ObjType || '',
      ObjID: options.ObjID || ''
    });
    this.getGroupData();    // 获取组数据
  },
  onShow() {
  },
  // 获取组数据
  getGroupData() {
    wx.showLoading({ title: '加载中' });
    let params = this.data.params;
    GetPurviewListByLayer(params).then(res => {
      let data = res.data;
      if (data.result === 'success') {
        this.setData({
          groupData: data.temptable
        });
      } else {
        $Message({ content: data.msg, type: 'warning' });
      };
      wx.hideLoading();
      this.setData({ loading: true });
    })
  },
  // 打开表
  bindOpenTable(e) {
    let { purviewId, groupName, parentNote } = e.currentTarget.dataset;
    let data = this.data;
    let ParentNote = [].concat(data.ParentNote);

    ParentNote.push(parentNote);   // 拼接导航地址

    let params = {
      ObjType: data.ObjType,    // 对象类型   0：人员  1：用户组
      ObjID: data.ObjID,      // 对象id
      ParentID: purviewId,    // 父级ID
      groupName: groupName,   // 组名
      ParentNote: ParentNote.join(',')  // 父级名称
    };
    wx.navigateTo({
      url: './table/index?' + _fgj.param(params)
    })
  },
});
