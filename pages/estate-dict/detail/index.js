// pages/estate-dict/detail/index.js
const { $Message } = require('../../../components/base/index');
import { GetEstateByID } from '../../../api/estate-dict/new';
import { GetEstatePhotoList } from '../../../api/estate-dict/detail';
import { URL_PATH } from '../../../utils/config';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    EstateID: '',
    EstateData: {},     // 楼盘数据
    src: 'http://app.vipfgj.com/upfile/20180423/8465CEA278D34DC298FA7B87C7D908A9.jpg',
    swiper: {
      imgUrls: [
        // 'http://app.vipfgj.com/upfile/20180423/8465CEA278D34DC298FA7B87C7D908A9.jpg',
        // 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        // 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      ],
      indicatorDots: false,
      autoplay: false,
      interval: 5000,
      duration: 500
    },
    tabIndex: 2,
    map: {
      controls: [{
        id: 1,
        // iconPath: '/resources/location.png',
        position: {
          left: 0,
          top: 300 - 50,
          width: 50,
          height: 50
        },
        clickable: true
      }],
      markers: '',
      polyline: ''
    },
    house: {
      option: [{
        label: '列表一',
        value: '1'
      }, {
        label: '列表二',
        value: '2'
      }, {
        label: '列表三',
        value: '3'
      }],
      listData: [
        {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
      ]
    },
    photoData: [
      { path: 'http://img.vipfgj.com/upfile/20170321/48A8F26E9ACF4432A5DA6AFC6D2546B7.jpg' },
      { path: 'http://img.vipfgj.com/upfile/20170321/9D830D69FDD64584AE79BC159EC6E0D8.jpg' },
      { path: 'http://app.vipfgj.com/upfile/20171101/38546B7795BC40F18476788A253B8E8E.jpg' },
      { path: 'http://app.vipfgj.com/upfile/20180423/8465CEA278D34DC298FA7B87C7D908A9.jpg' },
      { path: 'http://app.vipfgj.com/upfile/20170321/07BC51F3A8C14696BA1ED3DACB2769D2.jpg' },
      { path: 'http://app.vipfgj.com/upfile/20170321/F97D1A7B21BF4986B413F1B8DD10E194.jpg' },
      { path: 'http://app.vipfgj.com/upfile/20170321/F67483FED44946BCA56D73B191FF6215.jpg' },
    ]
  },
  onLoad: function (options) {
    console.log(options.EstateID)
    // let { EstateID } = options;
    let EstateID = 'BFC031C84545490593A7DECF7FC32897'

    if (!EstateID) {
      wx.navigateBack();
    };
    this.data.EstateID = EstateID;
    this.GetEstateByID(EstateID);
    this.GetEstatePhotoList(EstateID, '楼盘图');
  },
  onReady: function () {
  
  },
  onShow: function () {
  
  },
  controltap(e) {

  },
  // 根据ID获取楼盘数据
  GetEstateByID(EstateID) {
    GetEstateByID({
      EstateID
    }).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable[0];
        let { swiper } = this.data;

        swiper.imgUrls.push(URL_PATH + data.CoverImgUrl)

        console.log(data)
        this.setData({
          EstateData: data,
          swiper
        })
      } else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },
  // 根据类型获取楼盘图片
  GetEstatePhotoList(EstateID, PhotoType) {
    let { photoData } = this.data;

    wx.showLoading({
      title: '加载中',
    });
    GetEstatePhotoList({
      EstateID,
      PhotoType
    }).then(res => {
      wx.hideLoading();
      if (res.data.result === 'success') {
        // console.log(res.data)
        this.setData({
          photoData: res.data.temptable
        })
      } else {
        this.setData({
          photoData: []
        })
      }
    })
  },
  // tab切换
  bindTabSwitch(e) {
    // console.log(e.target)
    let { index } = e.target.dataset;
    this.setData({
      tabIndex: index
    })
  },
  /**
   * 下面处理在售房源相关逻辑
   */
  // 在售房源筛选结果
  bindHouseCheckout(e) {
    // console.log(e.detail)
  },
  /**
   * 下面处理楼盘相册相关逻辑
   */
  // 切换图片类型
  bindGetImgType(e) {
    console.log(e.target.dataset)
  },
  // 图片预览
  bindPreviewImage(e) {
    let { current } = e.currentTarget.dataset;
    let { urls } = this.data.photo;

    wx.previewImage({
      current,
      urls
    })
  },
})