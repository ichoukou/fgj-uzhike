
const { $Message } = require('../../../components/base/index');
import _fgj from '../../../utils/util';
import { GetPurviewListByLayer, UpPurviewStatus } from '../../../api/purview/purview';

Page({
  data: {
    ParentNo: '',     // 父级编号
    ParentNote: [],   // 父级层级，用来显示
    params: {
      pagetype: '0',   // 传递页面类型
      ParentID: '',   // 父级id
      LevelType: 1,   // 层级，当前层级是 1
    },
    tableData: [], // 当前表数据
    touch: {},      // 保存滑动的操作
    loading: false,    // 数据加载中
  },
  onLoad: function (options) {
    console.log('表', options);
    let { ParentID, ParentNo, ParentNote } = options;
    let params = this.data.params;
    params.ParentID = ParentID;
    this.setData({
      ParentNo,
      ParentNote: ParentNote.split(/,/),
      params
    });
  },
  onShow: function () {
    this.getTableData();    // 获取表数据
    wx.showLoading({ title: '加载中' });
  },
  // 获取表数据
  getTableData() {
    this.data.touch.sides = false;    // 获取数据要重置sides滑动
    GetPurviewListByLayer(this.data.params).then(res => {
      console.log(res)
      wx.hideLoading();
      this.setData({ loading: true });
      let data = res.data;
      if (data.result === 'success') {
        data.temptable.forEach(item => {
          item.offsetLeft = 0;    // 添加 offsetLeft 用来滑动
        });
        this.setData({
          tableData: data.temptable
        })
      } else {
        // $Message({ content: data.msg, type: 'warning' });
      }
    })
  },
  // 编辑表
  bindEdit(e) {
    let { purviewId } = e.currentTarget.dataset;
    let data = this.data;
    console.log(purviewId)
    let params = {
      isNew: false,
      LevelType: 1,
      PurviewID: purviewId,
      ParentNote: data.ParentNote,
    };
    wx.navigateTo({
      url: '../new/index?' + _fgj.param(params)
    })
  },
  // 新建表
  bindNew() {
    let data = this.data;
    let params = {
      isNew: true,
      LevelType: 1,
      ParentID: data.params.ParentID,
      ParentNo: data.ParentNo,
      ParentNote: data.ParentNote,
    };
    wx.navigateTo({
      url: '../new/index?' + _fgj.param(params)
    })
  },
  // 打开项
  bindOpenItem(e) {
    // console.log(e.currentTarget)
    let { purviewId, parentNo, parentNote } = e.currentTarget.dataset;
    let ParentNote = [].concat(this.data.ParentNote);

    ParentNote.push(parentNote);   // 拼接导航地址

    let params = {
      ParentID: purviewId,    // 父级ID
      ParentNo: parentNo,     // 父级编号
      ParentNote: ParentNote.join(',')  // 父级名称
    };

    wx.navigateTo({
      url: '../item/index?' + _fgj.param(params)
    })
  },
  // 修改状态，启用还是作废
  bindUpStatus(e) {
    let { purviewNo, status } = e.currentTarget.dataset;
    let _this = this;

    wx.showModal({
      title: '操作提示',
      content: '本次修改将同步修改所有下级，是否继续？',
      success: function (res) {
        if (res.confirm) {

          wx.showLoading({ title: '稍等' });

          UpPurviewStatus({
            PurviewNo: purviewNo,
            FlagStatus: status
          }).then(res => {
            wx.hideLoading();
            if (res.data.result === 'success') {
              $Message({ content: '设置成功', type: 'success' });
              _this.getTableData();    // 修改状态之后，再次求情
            } else {
              $Message({ content: res.data.msg, type: 'error' });
            }
          })

        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  // 导航屑返回
  bindBack(e) {
    let { index } = e.currentTarget.dataset;
    let ParentNote = this.data.ParentNote;

    ++index;      // 默认是从 0 开始，所以要加 1

    // 最后一个是不能点的
    if (index === ParentNote.length) {
      return
    };

    wx.navigateBack({
      delta: Math.abs(index - ParentNote.length)
    });
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