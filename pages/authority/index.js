
const app = getApp();
const { $Message } = require('../../components/base/index');
import { $wuxBackdrop } from '../../components/index';

Page({
  data: {
    modalTitleText: '',
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
    // 把拿到权限模板保存到缓存
    wx.setStorage({
      key: "authorityTempData",
      data: this.data.list
    });
  },
  // 新建组
  bindNew() {
    wx.navigateTo({
      url: './new/index?LevelType=0'
    })
  },
  // 打开表
  bindOpenTable(e) {
    console.log(e.currentTarget)
    let { groupId } = e.currentTarget.dataset;
    wx.navigateTo({
      url: './table/index?groupId=' + groupId
    })
  },
  // 删除成功提醒
  messageError() {
    $Message({
      content: '删除成功',
      type: 'error'
    });
  },
  // 弹出框确定返回按钮
  _modalSubmit(e, option) {
    let { inputValue } = e.detail;
    let { whoType } = this.data.parents;

    this.modalInput.onHideModal();
    $Message({
      content: '新建成功',
      type: 'success'
    });
  },
  // 列表滑动按下
  handlerStart(e) {
    let { list, touch } = this.data,
        { clientX, clientY } = e.touches[0];

    if (touch.sides) {
      // 已经有滑动，全部收起
      for (let i = 0, length = list.length; i < length; i++) {
        list[i].offsetLeft = 0;
      };
      this.setData({
        list: list
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
    let { list, touch } = this.data;
    let { groupId } = e.currentTarget.dataset;

    console.log(touch)

    if (touch.sides) {
      for (let i = 0, length = list.length; i < length; i++) {
        if (list[i].PurviewIndex === groupId) {
          list[i].offsetLeft = -240;
          this.setData({
            list: list
          });
          console.log(list)
          touch.startX = 0;
          return;
        }
      };
    }
  },
  // retainBackdrop() {
  //   this.$wuxBackdrop.retain()
  // },
  // releaseBackdrop() {
  //   this.$wuxBackdrop.release()
  // },
  // clickBackdrop() {
  //   console.log('隐藏')
  //   this.releaseBackdrop();
  // }
});
