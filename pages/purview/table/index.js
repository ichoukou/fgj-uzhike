
const { $Message } = require('../../../components/base/index');
import { GetPurviewListByLayer } from '../../../api/purview/purview';

Page({
  data: {
    ParentNote: [],   // 父级编号，用来显示
    params: {
      pagetype: '表',   // 传递页面类型
      ParentID: '',   // 父级id
      LevelType: 1,   // 层级，当前层级是 1
    },
    tableData: [], // 当前表数据
    touch: {},      // 保存滑动的操作
  },
  onLoad: function (options) {
    let { ParentID, ParentNote } = options;
    let params = this.data.params;
    params.ParentID = ParentID;
    this.setData({
      ParentNote: ParentNote.split(/,/),    // 当前层级，传过来的是一个用 , 分割的字符串，要把他变成数组
      params
    });
  },
  onReady: function () {
  
  },
  onShow: function () {
    this.getTableData();    // 获取表数据
    this.data.touch.sides = false;    // 编辑成功后，返回要重置sides滑动
  },
  // 获取表数据
  getTableData() {
    GetPurviewListByLayer(this.data.params).then(res => {
      console.log(res)
      let data = res.data;
      if (data.result === 'success') {
        data.temptable.forEach(item => {
          item.offsetLeft = 0;    // 添加 offsetLeft 用来滑动
        });
        this.setData({
          tableData: data.temptable
        })
      } else {
        $Message({ content: data.msg, type: 'warning' });
      }
    })
  },
  // 编辑表
  bindEdit(e) {
    let { purviewId } = e.currentTarget.dataset;
    console.log(purviewId)
    wx.navigateTo({
      url: '../new/index?isNew=false&LevelType=1' + '&PurviewID=' + purviewId
    })
  },
  // 新建表
  bindNew() {
    let data = this.data;
    wx.navigateTo({
      url: `../new/index?isNew=true&LevelType=1&ParentNote=${data.ParentNote}&ParentID=${data.params.ParentID}`
    })
  },
  // 打开项
  bindOpenItem(e) {
    console.log(e.currentTarget)
    let { purviewId, parentNote } = e.currentTarget.dataset;

    wx.navigateTo({
      url: '../item/index?ParentID=' + purviewId + '&ParentNote=' + this.data.ParentNote[0] + ',' +parentNote
    })
  },
  // 列表滑动按下
  handlerStart(e) {
    let { tableData, touch } = this.data,
      { clientX, clientY } = e.touches[0];

    if (touch.sides) {
      // 已经有滑动，全部收起
      for (let i = 0, length = tableData.length; i < length; i++) {
        tableData[i].offsetLeft = 0;
      };
      this.setData({
        tableData: tableData
      });
      touch.sides = false
      return
    };
    touch.startX = clientX;
    touch.startY = clientY;
  },
  // 列表滑动
  handlerMove(e) {
    let { clientX, clientY } = e.touches[0],
      touch = this.data.touch,
      deltaX = clientX - touch.startX,
      deltaY = clientY - touch.startY;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {      // 如果是Y轴滑动，就不执行
      touch.sides = false;
      return;
    };

    if (deltaX < -60) {
      touch.sides = true;
    } else {
      touch.sides = false;
      return;
    }
  },
  // 列表滑动抬起
  handlerEnd(e) {
    let { tableData, touch } = this.data;
    let { purviewId } = e.currentTarget.dataset;

    if (touch.sides) {
      for (let i = 0, length = tableData.length; i < length; i++) {
        if (tableData[i].PurviewID === purviewId) {
          tableData[i].offsetLeft = -360;
          this.setData({
            tableData: tableData
          });
          touch.startX = 0;
          return;
        }
      };
    }
  },
})