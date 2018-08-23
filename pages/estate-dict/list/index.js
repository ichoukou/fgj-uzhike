
const { $Message } = require('../../../components/base/index');
import { $wuxBackdrop } from '../../../components/index';
import { GetEstatePage, DelEstate } from '../../../api/estate-dict/list';
import { URL_PATH, MAP_KEY } from '../../../utils/config';
import { GetAllCityList, GetCityByStr, GetCityIDByName, GetDistrictByCityID } from '../../../api/public';

const QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');

Page({
  data: {
    params: {     // 筛选参数
      page: 1,
    },
    listData: [],
    src: 'http://app.vipfgj.com/upfile/20180423/8465CEA278D34DC298FA7B87C7D908A9.jpg',
    citySelector: {
      CityName: ''
    },
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
        data:[
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
  onLoad: function (options) {
    this.getSetting();     // 获取地理位置
    this.GetEstatePage();     // 获取楼盘列表数据
  },
  onReady: function () {
    this.$wuxBackdrop = $wuxBackdrop('#wux-backdrop', this);
    this.screenMore = this.selectComponent('#screenMore');
  },
  onShow: function () {
    let { params, citySelector } = this.data;

    // 判断是否选择了新的城市
    if (citySelector.CityID && citySelector.CityName !== params.CityName) {
      this.GetDistrictByCityID(citySelector.CityID);
      params.DistrictName = '';
      params.CityName = citySelector.CityName;
      this.setData({
        params
      });
      this.GetEstatePage();     // 获取楼盘列表数据
    };
  },
  // 获取楼盘列表数据
  GetEstatePage() {
    let { params } = this.data;

    this.setData({
      loading: false
    });
    
    params.page = 1;
    GetEstatePage(params).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable || [];

        data.forEach(item => {
          item.src = URL_PATH + item.CoverImgUrl;     // 拼接图片地址
        });

        this.setData({
          listData: data,
          loading: true
        })
      } else {
        this.setData({
          listData: [],
          loading: true
        })
      };
    })
  },
  // 列表滚动到底部，加载下一页
  bindscrolltolower(e) {
    console.log(e)
    let { params, listData } = this.data;
    this.setData({
      scrollLower: false
    });
    params.page++;
    GetEstatePage(params).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable || [];

        data.forEach(item => {
          item.src = URL_PATH + item.CoverImgUrl;     // 拼接图片地址
        });

        this.setData({
          listData: listData.concat(data),
          scrollLower: true
        })
      } else {
        this.setData({
          scrollLower: true
        })
      };
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
    let { value } = e.detail;

    params[type] = value;

    this.setData({
      params
    });
    this.GetEstatePage();     // 获取楼盘列表数据
    this.bindBackdrop();        // 选中后收起筛选项
  },
  // 更多筛选，重置
  bindScreenReset(data) {
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
        this.GetEstatePage();     // 获取楼盘列表数据
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
  // 手动设置权限
  setLocation(e) {
    console.log(e)
    wx.openSetting({
      success: (res) => {
        console.log('res', res)
        if (res.authSetting['scope.userLocation']) {
          this.getLocation();
        }
      }
    })
  },
  // 获取地理位置
  getSetting() {
    let _this = this;

    wx.getSetting({
      success(res) {
        console.log(res)
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // console.log('授权成功')
              _this.getLocation();
            },
            fail() {
              // console.log('取消授权')
              _this.setData({
                isLocation: true      // 显示再次授权按钮
              })
            }
          })
        } else {
          _this.getLocation();
        }
      }
    })
  },
  // 获取经纬度
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        // console.log(res)
        this.locationMap(res.latitude, res.longitude);
      }.bind(this),
      fail(err) {
        $Message({ content: err.errMsg, type: 'error' })
      }
    })
  },
  // 根据经纬度，定位
  locationMap(latitude, longitude) {
    // 实例化API核心类
    let map = new QQMapWX({
      key: MAP_KEY // 必填
    });
    // 调用接口
    map.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        // console.log(res);
        let CityName = res.result.ad_info.city;
        let citySelector = this.data.citySelector;
        citySelector.CityName = CityName;

        this.setData({
          citySelector,
          isLocation: false
        });
        this.GetCityIDByName(CityName);   // 根据城市名称获取城市ID
      }.bind(this),
      fail: function (err) {
        console.log(err);
      }
    });
  },
  // 根据城市名称匹配城市id
  GetCityIDByName(CityName) {
    let { citySelector } = this.data;

    GetCityIDByName({
      CityName
    }).then(res => {
      // console.log(res)
      if (res.data.result === 'success') {
        let CityID = res.data.CityID;
        citySelector.CityID = CityID;
        citySelector.CityName = CityName;
        this.setData({
          citySelector
        });
        this.GetDistrictByCityID(CityID);   // 根据城市ID获取区域数据
      }
      else {
        $Message({ content: '没有获取到城市ID', type: 'error' })
      }
    })
  },
  // 根据城市ID获取区域数据
  GetDistrictByCityID(CityID) {
    GetDistrictByCityID({
      CityID
    }).then(res => {
      // console.log(res)
      if (res.data.result === 'success') {
        let data = res.data.temptable;
        this.setData({
          DistrictName: data
        })
      } else {
        console.log(res.data.msg)
        // $Message({ content: res.data.msg, type: 'error' });
      }
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