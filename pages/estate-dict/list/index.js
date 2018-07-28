
const { $Message } = require('../../../components/base/index');
import { $wuxBackdrop } from '../../../components/index';
import { GetEstatePage, DelEstate } from '../../../api/estate-dict/list';
import { URL_PATH } from '../../../utils/config';

Page({
  data: {
    params: {     // 筛选参数
      page: 1
    },
    listData: [],
    src: 'http://app.vipfgj.com/upfile/20180423/8465CEA278D34DC298FA7B87C7D908A9.jpg',
    citySelector: {
      CityName: '南昌'
    },
    DistrictName: [    // 区域
    {
      label: '请选择区域',
      value: '',
      checked: true
    }, {
      label: '高新区',
      value: '高新区',
      checked: false
    }, {
        label: '青山湖区',
        value: '青山湖区',
        checked: false
      }
    ],
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
  },
  onLoad: function (options) {
    
  },
  onReady: function () {
    this.$wuxBackdrop = $wuxBackdrop('#wux-backdrop', this)
  },
  onShow: function () {
    this.GetEstatePage();     // 获取楼盘列表数据
    console.log(this.data.citySelector)
  },
  // 获取楼盘列表数据
  GetEstatePage() {
    GetEstatePage(this.data.params).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable || [];

        data.forEach(item => {
          item.src = URL_PATH + item.CoverImgUrl;     // 拼接图片地址
        });

        this.setData({
          listData: data
        })
      } else {

      }
    })
  },
  // 打开选择城市页面
  bindOpenCity() {
    wx.navigateTo({
      url: '../city/index'
    })
  },
  // 搜索返回结果
  bindQuery(e) {
    console.log(e)
  },
  // 打开筛选项切换
  bindScreenClick(e) {
    let { index } = e.currentTarget.dataset;
    let { screenOpen } = this.data;

    screenOpen ? '' : this.retainBackdrop();    // 确保多次切换的清空下retainBackdrop只执行一次
    
    this.setData({
      screenOpen: true,
      screenIndex: Number(index)
    });
  },
  // 筛选radio改变事件
  bindRadioChange(e) {
    console.log(e)
    let { screenOpen } = this.data;

    this.bindBackdrop();        // 选中后收起筛选项
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
  // 打开详细页
  bindOpenDetail(e) {
    wx.navigateTo({
      url: '../detail/index?EstateID=' +  e.currentTarget.dataset.estateId,
    })
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
      } else {
        $Message({ content: '删除失败', type: 'error' });
      };
    })
  },
  // 快速创建
  bindOpenNew() {
    wx.navigateTo({
      url: '../new/index'
    })
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
})