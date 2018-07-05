
const { $Message } = require('../../components/base/index');
import _fgj from '../../utils/util';
import { GetPurviewListByLayer } from '../../api/purview/purview';

Page({
  data: {
    params: {
      pagetype: '1',   // 传递页面类型
      ParentID: '',   // 父级id
      LevelType: 0,   // 层级，当前层级是 0
    },
    modalTitleText: '',
    groupData: [],    // 组数据
    loader: false,  // 数据加载中
  },
  onLoad() {
    this.getGroupData();    // 获取组数据
  },
  onShow() {
  },
  // 获取组数据
  getGroupData() {
    let params = this.data.params;
    GetPurviewListByLayer(params).then(res => {
      this.setData({
        loader: true
      });
      let data = res.data;
      if (data.result === 'success') {
        this.setData({
          groupData: data.temptable
        });
      } else {
        $Message({ content: data.msg, type: 'warning' });
      }
    })
  },
  // 打开表
  bindOpenTable(e) {
    let { purviewId, parentNo, parentNote } = e.currentTarget.dataset;
    let params = {
      ParentID: purviewId,    // 父级ID
      ParentNo: parentNo,     // 父级编号
      ParentNote: parentNote  // 父级名称
    };
    wx.navigateTo({
      url: './table/index?' + _fgj.param(params)
    })
  },
});
