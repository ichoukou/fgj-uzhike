// pages/authority/table/index.js
Page({
  data: {
    list: [],     // 模板总数据
    tableData: [], // 当前表数据
    groupId: 0,   // 组ID
    touch: {},      // 保存滑动的操作
  },
  onLoad: function (options) {
    console.log('表', options)
    let groupId = options.groupId;
    this.getStorage(options.groupId);
    this.setData({
      groupId
    });
  },
  onReady: function () {
  
  },
  onShow: function () {
  
  },
  // 打开项
  bindOpenItem(e) {
    let { tableId } = e.currentTarget.dataset;
    let { groupId } = this.data;

    wx.navigateTo({
      url: '../item/index?groupId=' + groupId + '&tableId=' + tableId
    })
  },
  // 获取缓存模板数据
  getStorage(groupId) {
    let _this = this;
    wx.getStorage({
      key: 'authorityTempData',
      success: function (res) {
        let data = res.data;
        for (let i = 0, length = data.length; i < length; i++) {
          if (data[i].PurviewIndex === groupId) {
            _this.setData({
              list: data,
              tableData: data[i].table
            });
            console.log(data[i].table)
            return;
          }
        }
      }
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
    let { index } = e.currentTarget.dataset;

    if (touch.sides) {
      for (let i = 0, length = tableData.length; i < length; i++) {
        if (tableData[i].PurviewIndex === index) {
          tableData[i].offsetLeft = -240;
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