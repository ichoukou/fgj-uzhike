
Page({
  data: {
    groupId: 0,
    tableId: 0,
    itemData: [
      {
        PurviewName: '项名1',
        PurviewIndex: 'item-0',
        offsetLeft: 0
      },
      {
        PurviewName: '项名2',
        PurviewIndex: 'item-1',
        offsetLeft: 0
      },
    ],
    touch: {},      // 保存滑动的操作
  },
  onLoad: function (options) {
    console.log('项参数', options)
    let { groupId, tableId } = options;
    this.setData({
      groupId,
      tableId
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  // 列表滑动按下
  handlerStart(e) {
    let { itemData, touch } = this.data,
      { clientX, clientY } = e.touches[0];

    if (touch.sides) {
      // 已经有滑动，全部收起
      for (let i = 0, length = itemData.length; i < length; i++) {
        itemData[i].offsetLeft = 0;
      };
      this.setData({
        itemData: itemData
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
    let { itemData, touch } = this.data;
    let { index } = e.currentTarget.dataset;

    if (touch.sides) {
      for (let i = 0, length = itemData.length; i < length; i++) {
        if (itemData[i].PurviewIndex === index) {
          itemData[i].offsetLeft = -240;
          this.setData({
            itemData: itemData
          });
          touch.startX = 0;
          return;
        }
      };
    }
  },
})