
const { $Message } = require('../../../components/base/index');
import _fgj from '../../../utils/util';
import { GetPurviewListByLayer, UpPurviewStatus } from '../../../api/purview/purview';

Page({
  data: {
    params: {
      pagetype: '0',   // 传递页面类型
      ParentID: '',   // 父级id
      LevelType: 2,   // 层级，当前层级是 1
    },
    ParentNo: [],     // 父级编号
    ParentNote: [],   // 父级名称，用来显示
    itemData: [],
    touch: {},      // 保存滑动的操作
    loading: false,
  },
  onLoad: function (options) {
    console.log('项参数', options)
    let { ParentID, ParentNo, ParentNote } = options;
    let params = this.data.params;
    params.ParentID = ParentID;
    this.setData({
      params,
      ParentNo,
      ParentNote: ParentNote.split(/,/)    // 当前层级，传过来的是一个用 , 分割的字符串，要把他变成数组
    });
  },
  onShow: function () {
    this.getItemData();    // 获取表数据
    wx.showLoading({ title: '加载中' });
  },
  // 获取表数据
  getItemData() {
    this.data.touch.sides = false;    // 获取数据要重置sides滑动
    GetPurviewListByLayer(this.data.params).then(res => {
      // console.log(res)
      wx.hideLoading();
      this.setData({ loading: true });
      let data = res.data;
      if (data.result === 'success') {
        data.temptable.forEach(item => {
          item.offsetLeft = 0;    // 添加 offsetLeft 用来滑动
          // 判断ValueType权限值类型显示操作类型
          switch (item.ValueType) {
            case '0':
              item.ValueTypeName = '开关'
            break;
            case '1':
              item.ValueTypeName = '分级'
            break;
            case '2':
              item.ValueTypeName = '控量'
            break;
            default:
              console.log('ValueType is error');
              item.ValueTypeName = '空';
          }
        });
        this.setData({
          itemData: data.temptable
        })
      } else {
        // $Message({ content: data.msg, type: 'warning' });
      }
    })
  },
  // 编辑项
  bindEdit(e) {
    let { purviewId } = e.currentTarget.dataset;
    console.log(purviewId)
    wx.navigateTo({
      url: '../new/index?isNew=false&LevelType=2' + '&PurviewID=' + purviewId
    })
  },
  // 新建项
  bindNew() {
    let data = this.data;
    let params = {
      isNew: true,
      LevelType: 2,
      ParentNo: data.ParentNo,
      ParentNote: data.ParentNote,
      ParentID: data.params.ParentID
    };
    wx.navigateTo({
      url: '../new/index?' + _fgj.param(params)
    })
  },
  // 修改状态，启用还是作废
  bindUpStatus(e) {
    let { purviewNo, status } = e.currentTarget.dataset;
    let _this = this;

    wx.showLoading({ title: '稍等' });

    UpPurviewStatus({
      PurviewNo: purviewNo,
      FlagStatus: status
    }).then(res => {
      wx.hideLoading();
      if (res.data.result === 'success') {
        $Message({ content: '设置成功', type: 'success' });
        _this.getItemData();    // 修改状态之后，再次求情
      } else {
        $Message({ content: res.data.msg, type: 'error' });
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
    let { purviewId } = e.currentTarget.dataset;

    if (touch.sides) {
      for (let i = 0, length = itemData.length; i < length; i++) {
        if (itemData[i].PurviewID === purviewId) {
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