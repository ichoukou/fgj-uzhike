const { $Message } = require('../../../components/base/index');
import { $wuxBackdrop } from '../../../components/index';
import { GetEstatePage, DelEstate } from '../../../api/estate-dict/list';
import { URL_PATH, MAP_KEY } from '../../../utils/config';
import { GetAllCityList, GetCityByStr, GetCityIDByName, GetDistrictByCityID } from '../../../api/public';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: {     // 筛选参数
      page: 1,
    },
    index:0,
    listData: [],
    src: 'http://app.vipfgj.com/upfile/20180423/8465CEA278D34DC298FA7B87C7D908A9.jpg',
    DistrictName: [], // 区域
    typeData: [    // 类型
      {
        label: '请选择类型',
        value: '',
        checked: true
      }
    ],
    price: [    // 价格
      {
        label: '请选择价格',
        value: '',
        checked: true
      }, {
        label: '0-10000元',
        value: '0-10000',
        checked: true
      }, {
        label: '10000-15000元',
        value: '10000-15000',
        checked: true
      }
    ],
    screenOpen: false,   // 是否打开筛选项
    screenIndex: -1,     // 显示哪个筛选项
    screenData: [        // 更多筛选数据
      {
        title: '选择年龄',
        data: [
          {
            label: '标签1',
            value: 0
          }, {
            label: '标签2',
            value: 1
          }
        ]
      }
    ],
    onceTime: null,
    loading: false,
    isLocation: false,    // 获取位置
    scrollLower: true,    // 显示上滑加载中
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  // 搜索返回结果
  bindQuery(e) {
    let { params } = this.data;

    this.data.onceTime ? clearTimeout(this.data.onceTime) : '';
    this.data.onceTime = setTimeout(() => {
      params.likestr = e.detail.value;
      this.setData({
        params
      })
      this.GetEstatePage();
    }, 300);
  },
  // 打开筛选项切换
  bindScreenClick(e) {
    let { index } = e.currentTarget.dataset;
    let { screenOpen } = this.data;

    // if index === '3' 就是更多筛选
    if (index === '3') {
      this.screenMore.show();
      this.setData({
        screenOpen: false
      });
      this.releaseBackdrop();
      return
    };

    screenOpen ? '' : this.retainBackdrop();    // 确保多次切换的情况下retainBackdrop只执行一次

    this.setData({
      screenOpen: true,
      screenIndex: Number(index)
    });
  },
  // 筛选radio改变事件
  bindRadioChange(e) {
    console.log(e)
    let { params } = this.data;
    let { type } = e.currentTarget.dataset;
    console.log(type)
    let { value } = e.detail;

    params[type] = value;

    this.setData({
      params
    });
    this.GetEstatePage();     // 获取楼盘列表数据
    this.bindBackdrop();        // 选中后收起筛选项
  },
  // 更多筛选，重置
  bindScreenReset(data) {[]
    console.log(data)
  },
  // 更多筛选，确定
  bindScreenConfirm(data) {
    console.log(data)
  },
  // 保持遮罩
  retainBackdrop() {
    this.$wuxBackdrop.retain()
  },
  // 释放遮罩
  releaseBackdrop() {
    this.$wuxBackdrop.release()
  },
  // 点击遮罩
  bindBackdrop() {
    this.releaseBackdrop();
    this.setData({
      screenOpen: false
    });
  },
  // 更多操作
  bindOpenMore(e) {
    this.moreOperation(e.currentTarget.dataset.estateId);
  },
  // 列表更多操作
  moreOperation(EstateID) {
    let _this = this;

    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success: function (res) {
        console.log(res.tapIndex)
        switch (res.tapIndex) {
          case 0:
            // 去编辑
            wx.navigateTo({
              url: '../new/index?EstateID=' + EstateID,
            });
            break;
          case 1:
            // 删除
            wx.showModal({
              title: '删除提醒',
              content: '您确定要删除这个楼盘吗？',
              success: function (res) {
                if (res.confirm) {
                  _this.DelEstate(EstateID);
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            break;
          default:
            console.log('tapIndex错误')
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  // 删除楼盘
  DelEstate(EstateID) {
    wx.showLoading({
      title: '正在删除',
    });
    DelEstate({
      EstateID
    }).then(res => {
      wx.hideLoading();
      if (res.data.result === 'success') {
        $Message({ content: '删除成功', type: 'success' });
        this.GetEstatePage();     // 获取楼盘列表数据
      } else {
        $Message({ content: '删除失败', type: 'error' });
      };
    })
  },
})