
const app = getApp();
const { $Message } = require('../../components/base/index');
import { $wuxBackdrop } from '../../components/index';
import _fgj from '../../utils/util';
import { GetPurviewListByLayer, UpPurviewStatus } from '../../api/purview/purview';

Page({
  data: {
    params: {
      pagetype: '0',   // 传递页面类型
      ParentID: '',   // 父级id
      LevelType: 0,   // 层级，当前层级是 0
    },
    modalTitleText: '',
    groupData: [],    // 组数据
    touch: {},      // 保存滑动的操作
    loading: false,  // 数据加载中
  },
  onLoad() {
    this.modalInput = this.selectComponent('#modalInput');
    // this.modalInput.onShowModal();
    // this.$wuxBackdrop = $wuxBackdrop();
    wx.showLoading({ title: '加载中' });
  },
  onShow() {
    this.getGroupData();    // 获取组数据，新建完成之后，再次求情
  },
  // 获取组数据
  getGroupData() {
    this.data.touch.sides = false;    // 获取数据要重置sides滑动
    let params = this.data.params;
    GetPurviewListByLayer(params).then(res => {
      wx.hideLoading();
      this.setData({ loading: true });
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
    let params = {
      isNew: false,
      LevelType: 0,
      PurviewID: purviewId
    };
    wx.navigateTo({
      url: './new/index?' + _fgj.param(params)
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
              _this.getGroupData();    // 修改状态之后，再次求情
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
          groupData[i].offsetLeft = -240;
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
