
const app = getApp();
const { $Message } = require('../../components/base/index');
import { $wuxBackdrop } from '../../components/index';

import { GetPurviewListByLayer } from '../../api/purview/purview';

Page({
  data: {
    params: {
      pagetype: '',   // 传递页面类型
      ParentID: '',   // 父级id
      LevelType: 0,   // 层级，当前层级是 0
    },
    modalTitleText: '',
    groupData: [],    // 组数据
    list: [
      {
        PurviewName: '组名1',
        PurviewIndex: 'group-0',
        offsetLeft: 0,
        table: [
          {
            PurviewName: '表名1',
            PurviewIndex: 'table-0',
            offsetLeft: 0,
            item: [
              {
                PurviewName: '项名1',
                PurviewIndex: 'item-0',
              },
              {
                PurviewName: '项名2',
                PurviewIndex: 'item-1',
              },
              {
                PurviewName: '项名3',
                PurviewIndex: 'item-2',
              },
              {
                PurviewName: '项名4',
                PurviewIndex: 'item-3',
              },
            ]
          },
          {
            PurviewName: '表名2',
            PurviewIndex: 'table-1',
            offsetLeft: 0,
            item: [
              {
                PurviewName: '项名1',
                PurviewIndex: 'item-0',
              },
              {
                PurviewName: '项名2',
                PurviewIndex: 'item-1',
              },
            ]
          },
          {
            PurviewName: '表名3',
            PurviewIndex: 'table-2',
            offsetLeft: 0,
            item: [
              {
                PurviewName: '项名1',
                PurviewIndex: 'item-0',
              },
            ]
          },
        ]
      },
      {
        PurviewName: '组名2',
        PurviewIndex: 'group-1',
        offsetLeft: 0,
      }
    ],
    touch: {},      // 保存滑动的操作
  },
  onLoad() {
    this.modalInput = this.selectComponent('#modalInput');
    // this.modalInput.onShowModal();
    // this.$wuxBackdrop = $wuxBackdrop();
  },
  onShow() {
    this.getGroupData();    // 获取组数据，新建完成之后，再次求情
    this.data.touch.sides = false;    // 编辑成功后，返回要重置sides滑动
  },
  // 获取组数据
  getGroupData() {
    let params = this.data.params;
    GetPurviewListByLayer(params).then(res => {
      let data = res.data;
      if (data.result === 'success') {
        data.temptable.forEach(item => {
          item.offsetLeft = 0;    // 添加 offsetLeft 用来滑动
        });
        this.setData({
          groupData: data.temptable
        });
      } else {
        $Message({ content: data.msg, type: 'warning' });
      }
    })
  },
  // 编辑组
  bindEdit(e) {
    let { purviewId } = e.currentTarget.dataset;
    console.log(purviewId)
    wx.navigateTo({
      url: './new/index?isNew=false&LevelType=0' + '&PurviewID=' + purviewId
    })
  },
  // 新建组
  bindNew() {
    wx.navigateTo({
      url: './new/index?isNew=true&LevelType=0'
    })
  },
  // 打开表
  bindOpenTable(e) {
    console.log(e.currentTarget)
    let { purviewId, parentNote } = e.currentTarget.dataset;
    wx.navigateTo({
      url: './table/index?ParentID=' + purviewId + '&ParentNote=' + parentNote
    })
  },
  // 列表滑动按下
  handlerStart(e) {
    let { groupData, touch } = this.data,
        { clientX, clientY } = e.touches[0];

    if (touch.sides) {
      // 已经有滑动，全部收起
      for (let i = 0, length = groupData.length; i < length; i++) {
        groupData[i].offsetLeft = 0;
      };
      this.setData({
        groupData
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
    let { groupData, touch } = this.data;
    let { purviewId } = e.currentTarget.dataset;

    if (touch.sides) {
      for (let i = 0, length = groupData.length; i < length; i++) {
        if (groupData[i].PurviewID === purviewId) {
          groupData[i].offsetLeft = -360;
          this.setData({
            groupData
          });
          touch.startX = 0;
          return;
        }
      };
    }
  },
});
