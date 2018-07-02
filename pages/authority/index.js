
const app = getApp();
const { $Message } = require('../../components/base/index');
import { $wuxBackdrop } from '../../components/index';

Page({
  data: {
    list: [
      {
        id: 'group-1',
        name: '组一',
        open: false,
        offsetLeft: 0,
        table: [
          {
            id: 'table-1',
            name: '表一',
            open: false,
            offsetLeft: 0,
            item: [
              {
                id: 'item-1',
                name: '项一',
                open: false,
                offsetLeft: 0
              }, {
                id: 'item-2',
                name: '项二',
                open: false,
                offsetLeft: 0
              }
            ]
          }, {
            id: 'table-2',
            name: '表二',
            open: false,
            offsetLeft: 0,
            item: [
              {
                id: 'item-1',
                name: '项一',
                open: false,
                offsetLeft: 0
              }, {
                id: 'item-2',
                name: '项二',
                open: false,
                offsetLeft: 0
              }, {
                id: 'item-3',
                name: '项三',
                open: false,
                offsetLeft: 0
              }
            ]
          }, {
            id: 'table-3',
            name: '表三',
            open: false,
            offsetLeft: 0,
            item: [
              {
                id: 'item-1',
                name: '项一',
                open: false,
                offsetLeft: 0
              }, {
                id: 'item-2',
                name: '项二',
                open: false,
                offsetLeft: 0
              }
            ]
          }
        ]
      }, {
        id: 'group-2',
        name: '组二',
        open: false,
        table: [
          {
            id: 'table-1',
            name: '表一',
            open: false,
          }, {
            id: 'table-2',
            name: '表二',
            open: false,
          }, {
            id: 'table-3',
            name: '表三',
            open: false,
          }
        ]
      }
    ],
    btnLoading: false,
    btnDisabled: false,
    openModalBtn: false,
    touch: {},    // 滑动操作
    offsetLeft: 0,  // 偏移位置
    modalTitleText: '标题', // 模态框标题
    modalValue: '', // 模态框输入返回的结果
    parents: {      // 用来临时保存当前新建操作的那一项
      whoType: '',
      groupID: '',
      tableID: '',
    }
  },
  onLoad() {
    this.modalInput = this.selectComponent('#modalInput');
    // this.$wuxBackdrop = $wuxBackdrop();
  },
  onShow() {
  },
  // 删除成功提醒
  messageError() {
    $Message({
      content: '删除成功',
      type: 'error'
    });
  },
  // 打开模态输入框
  bindOpenModal(e) {
    let whoType = e.currentTarget.dataset.type,
        groupID = e.currentTarget.dataset.groupid || '',
        tableID = e.currentTarget.dataset.tableid || '',
        title = '';
        
    // 修改模态框title
    switch(whoType) {
      case 'group':
        title = '新建组';
      break;
      case 'table':
        title = '新建表';
      break;
      case 'item':
        title = '新建项';
      break;
      default:
        title = '标题'
    };
    this.setData({
      modalTitleText: title,
      parents: {
        whoType,
        groupID,
        tableID
      },
      openModalBtn: true
    });
    this.modalInput.onShowModal();
  },
  // 弹出框确定返回按钮
  _modalSubmit(e, option) {
    let { inputValue } = e.detail;
    let { whoType } = this.data.parents;

    // 根据类型，执行对应的新建操作
    if (whoType === 'group') {
      this.newGroup(inputValue);
    }
    else if (whoType === 'table') {
      this.newTable(inputValue);
    }
    else if (whoType === 'item') {
      this.newItem(inputValue);
    };
    this.modalInput.onHideModal();
    $Message({
      content: '新建成功',
      type: 'success'
    });
  },
  // 新建项
  newItem(value) {
    let { list, parents } = this.data;
    let tableData = [];

    for (let i = 0, length = list.length; i < length; i++) {
      if (parents.groupID && list[i].id === parents.groupID) {
        tableData = list[i].table;
        for (let i = 0, length = tableData.length; i < length; i++) {
          if (parents.tableID && tableData[i].id === parents.tableID) {

            Array.isArray(tableData[i].item) || (tableData[i].item = []); // 下一项必须是数组，没有就创建数组

            let item = tableData[i].item
            let length = 1;
            item.length ? length = item.length + 1 : length = 1;
            let obj = {
              id: 'item-' + length,
              name: value,
              open: false,
              offsetLeft: 0,
            };
            item.push(obj);
            this.setData({
              list: list
            })
            return;
          }
        }
      }
    };
  },
  // 删除项
  removeItem(e) {
    let _this = this;
    let { groupid, tableid, itemid, name } = e.currentTarget.dataset;
    let list = this.data.list;

    wx.showModal({
      title: '删除提醒',
      content: '确定删除（' + name + '）吗？',
      success: function (res) {
        if (res.confirm) {

          for (let i = 0, length = list.length; i < length; i++) {
            if (list[i].id === groupid) {
              let tableData = list[i].table;
              for (let i = 0, length = tableData.length; i < length; i++) {
                if (tableData[i].id === tableid) {
                  let itemData = tableData[i].item;
                  for (let i = 0, length = itemData.length; i < length; i++) {
                    if (itemData[i].id === itemid) {
                      itemData.splice(i, 1);
                      _this.setData({
                        list: list,
                        touch: {
                          sides: false
                        }
                      });
                      _this.messageError();
                      return;
                    }
                  }
                }
              }
            }
          };

        }
      }
    });
  },
  // 新建表
  newTable(value) {
    let { list, parents } = this.data;
    for (let i = 0, length = list.length; i < length; i++) {
      if (parents.groupID && list[i].id === parents.groupID) {

        Array.isArray(list[i].table) || (list[i].table = []);

        let table = list[i].table;
        let length = 1;
        table ? length = table.length + 1 : length = 1;

        let obj = {
          id: 'table-' + length,
          name: value,
          open: false,
          offsetLeft: 0,
        };
        table.push(obj);
        this.setData({
          list: list
        });
        return;
      }
    };
  },
  // 删除表
  removeTable(e) {
    let { groupid, tableid, name } = e.currentTarget.dataset;
    let list = this.data.list;
    let _this = this;

    wx.showModal({
      title: '删除提醒',
      content: '确定删除（' + name + '）吗？',
      success: function (res) {
        if (res.confirm) {

          for (let i = 0, length = list.length; i < length; i++) {
            if (list[i].id === groupid) {
              let tableData = list[i].table;
              for (let i = 0, length = tableData.length; i < length; i++) {
                if (tableData[i].id === tableid) {
                  tableData.splice(i, 1);
                  _this.setData({
                    list: list,
                    touch: {
                      sides: false
                    }
                  });
                  _this.messageError();
                  return;
                }
              }
            }
          };

        }
      }
    })
  },
  // 新建组
  newGroup(value) {
    let list = this.data.list;
    let length = list.length + 1;
    let obj = {
      id: 'group-' + length,
      name: value,
      open: false,
      offsetLeft: 0,
    };
    list.push(obj);
    this.setData({
      list: list
    });
  },
  // 删除组
  removeGroup(e) {
    let { groupid, name } = e.currentTarget.dataset;
    let list = this.data.list;
    let _this = this;

    wx.showModal({
      title: '删除提示',
      content: '确定删除（' + name + '）吗？',
      success: function (res) {
        if (res.confirm) {

          for (let i = 0, length = list.length; i < length; i++) {
            if (list[i].id === groupid) {
              list.splice(i, 1);
              _this.setData({
                list: list,
                touch: {
                  sides: false
                }
              });
              _this.messageError();
              return;
            }
          };

        }
      }
    })
  },
  // 展开收起组
  kindToggle: function (e) {
    let id   = e.currentTarget.id, 
        list = this.data.list;
        
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open;
      } else {
        list[i].open = false;
      }
    }
    this.setData({
      list: list
    });
  },
  // 展开收起表
  kindToggleTable(e) {
    let id = e.currentTarget.id,
        groupID = e.currentTarget.dataset.groupid,
        list = this.data.list;

    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id === groupID) {
        list[i].table.forEach(item => {
          if (item.id === id) {
            item.open = !item.open;
          } else {
            item.open = false;
          }
        })
      }
    }
    this.setData({
      list: list
    });
  },
  // 列表滑动按下
  handlerStart(e) {
    let tableData = [],
        itemData = [],
        { list, touch } = this.data,
        { clientX, clientY } = e.touches[0];
    
    if (touch.sides) {
      // 已经有滑动，全部收起
      for (let i = 0, length = list.length; i < length; i++) {
          list[i].offsetLeft = 0;
          tableData = list[i].table;
          if (tableData) {
            for (let i = 0, length = tableData.length; i < length; i++) {
              tableData[i].offsetLeft = 0;
              itemData = tableData[i].item;
              if (itemData) {
                for (let i = 0, length = itemData.length; i < length; i++) {
                  itemData[i].offsetLeft = 0;
                }
              }
            }
          }
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

    if (touch.sides) {
      this._forDataModOffsetLeft(e, list);
      this.setData({
        list: list
      });
      touch.startX = 0;
    }
  },
  // 根据类型，处理数据，修改偏移
  _forDataModOffsetLeft(e, list) {
    let currentID = e.currentTarget.id,
        listType = e.currentTarget.dataset.type,    // 类别，有组、表、项
        groupID = -1,
        tableID = -1,
        tableData = [],
        itemData = [],
        { touch } = this.data,
        currentData = {};

    switch (listType) {
      case 'group':
        for (let i = 0, length = list.length; i < length; i++) {
          if (list[i].id === currentID) {
            currentData = list[i];
            break;
          }
        };
        if (touch.sides) {
          currentData.offsetLeft = -304;
        } else {
          currentData.offsetLeft = 0;
        };
      break;
      case 'table':
        groupID = e.currentTarget.dataset.groupid;
        for (let i = 0, length = list.length; i < length; i++) {
          if (list[i].id === groupID) {
            tableData = list[i].table;
            for (let i = 0, length = tableData.length; i < length; i++) {
              if (tableData[i].id === currentID) {
                currentData = tableData[i];
                break;
              }
            }
          }
        };
        if (touch.sides) {
          currentData.offsetLeft = -304;
        } else {
          currentData.offsetLeft = 0;
        };
      break;
      case 'item':
        groupID = e.currentTarget.dataset.groupid;
        tableID = e.currentTarget.dataset.tableid;
        for (let i = 0, length = list.length; i < length; i++) {
          if (list[i].id === groupID) {
            tableData = list[i].table;
            for (let i = 0, length = tableData.length; i < length; i++) {
              if (tableData[i].id === tableID) {
                itemData = tableData[i].item;
                for (let i = 0, length = itemData.length; i < length; i++) {
                  if (itemData[i].id === currentID) {
                    currentData = itemData[i];
                    break;
                  }
                }
              }
            }
          }
        };
        if (touch.sides) {
          currentData.offsetLeft = -152;
        } else {
          currentData.offsetLeft = 0;
        };
      break;
      default:
        console.info('需要一个类型');
    };
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
