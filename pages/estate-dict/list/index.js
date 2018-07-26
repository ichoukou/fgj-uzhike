import { $wuxBackdrop } from '../../../components/index';

Page({
  data: {
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
    console.log(this.data.citySelector)
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
    console.log('retainBackdrop')
  },
  // 释放遮罩
  releaseBackdrop() {
    this.$wuxBackdrop.release()
    console.log('release')
  },
  // 点击遮罩
  bindBackdrop() {
    this.releaseBackdrop();
    this.setData({
      screenOpen: false
    });
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