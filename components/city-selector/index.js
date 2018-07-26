const { $Message } = require('../base/index');
import { GetAllCityList, GetCityByStr, GetCityIDByName } from '../../api/public';

const QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
const app = getApp();

Component({
  properties: {
  },
  data: {
    userInfo: {},
    map: [
      // {
      //   title: 'A',
      //   items: [
      //     { name: '城市' }
      //   ]
      // }
    ],
    params: {}, // 筛选条件
    onceTime: null,
    scrollTitle: 'A',
    scrollNavShow: false,
    scrollNavTop: '', // 侧边导航距离顶部位置
    scrollAnim: true, // 滚动动画，触摸的时候可以加，滑动的时候要去掉，否则有bug
    loading: false,
  },
  created() {
    this.getLocation();     // 获取地理位置
    this.GetAllCityList();  // 获取所有城市数据接口
  },
  ready() {
    this.getScrollNavTop(); // 获取侧边导航距离顶部位置
  },
  methods: {
    // 获取地理位置
    getLocation() {
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          // console.log(res)
          this.locationMap(res.latitude, res.longitude);
        }.bind(this), 
        fail(err) {
          console.log('err', err)
        }
      })
    },
    // 根据经纬度，定位
    locationMap(latitude, longitude) {
      // 实例化API核心类
      let map = new QQMapWX({
        key: 'JACBZ-N6EK6-IO4S7-ESP4S-3E3RS-OCFDM' // 必填
      });
      // 调用接口
      map.reverseGeocoder({
        location: {
          latitude: latitude,
          longitude: longitude
        },
        success: function (res) {
          console.log(res);
          let city = res.result.ad_info.city;
          let userInfo = this.data.userInfo;
          userInfo.city = city;

          this.setData({
            userInfo 
          });
          this.GetCityIDByName(city);   // 根据城市名称获取城市ID
        }.bind(this),
        fail: function (err) {
          console.log(err);
        }
      });
    },
    // 获取所有城市数据接口
    GetAllCityList() {
      GetAllCityList().then(res => {
        // console.log(res)
        if (res.data.result === 'success') {
          let city = res.data.datalist;
          let data = [];

          city.forEach(item => {
            if (item.Child.length) {
              item.Child.forEach(list => {
                data.push({
                  PY: list.PY.substring(0, 1).toLocaleUpperCase(),
                  name: list.CityName,
                  id: list.ID
                })
              })
            }
          });

          this.filterMap(data, function (map) {
            // 缓存城市数据
            wx.setStorage({
              key: 'cityData',
              data: map
            })
          });
        }
      })
    },
    // 根据城市名称匹配城市id
    GetCityIDByName(city) {
      let { userInfo } = this.data;

      GetCityIDByName({
        CityName: city
      }).then(res => {
        // console.log(res)
        if (res.data.result === 'success') {
          userInfo.CityID = res.data.CityID;
          this.setData({
            userInfo
          })
        } 
        else {
          $Message({ content: '没有获取到城市ID', type: 'error' })
        }
      })
    },
    // 选中当前定位的城市
    bindLocation() {
      let { userInfo } = this.data;
      if (!userInfo.CityID) {
        return
      };

      this.triggerEvent('select', {
        value: {
          CityName: userInfo.city,
          CityID: userInfo.CityID
        }
      });
    },
    // 选中列表城市
    bindClick(e) {
      // console.log(e.target)
      let { name, id } = e.target.dataset;

      this.triggerEvent('select', {
        value: {
          CityName: name,
          CityID: id
        }
      });
    },
    // 搜索返回值
    bindQuery(e) {
      console.log(e.detail.value)
      let likestr = e.detail.value;
      this.data.params.likestr = likestr;

      this.data.onceTime && (clearTimeout(this.data.onceTime));
      this.data.onceTime = setTimeout(() => {
        if (likestr) {
          this.GetCityByStr(likestr);
        } else {
          this.isHasCityData();
        }
      }, 200)
    },
    // 模糊搜索城市
    GetCityByStr(likestr) {
      this.setData({
        map: [],
        loading: false
      });
      GetCityByStr({
        likestr
      }).then(res => {
        if (res.data.result === 'success') {
          let city = res.data.temptable;
          let data = [];

          if (!city.length) {
            return
          };

          city.forEach(item => {
            data.push({
              PY: item.PY.substring(0, 1).toLocaleUpperCase(),
              name: item.CityName,
              id: item.ID
            })
          });
          this.filterMap(data);     // 处理数据
          this.getScrollNavTop();   // 重新获取nav位置
        } else {
          this.setData({ loading: true });
        }
      })
    },
    // 获取侧边导航距离顶部位置
    getScrollNavTop() {
      let query = wx.createSelectorQuery().in(this)
      query.select('#navSide').boundingClientRect(function (res) {
        // console.log(res)
        this.data.scrollNavTop = res.top;
      }.bind(this)).exec()
    },
    // 侧边栏触摸
    catchNavStart(e) {
      let { title } = e.target.dataset;
      let currentNodes = this.data.currentNodes;
      let {
        scrollTitle,
        scrollNavShow,
        scrollAnim
      } = this.data;

      this.setData({
        scrollAnim: true,
        scrollNavShow: true,
        scrollTitle: title,
      });

      // 一段时间之后隐藏选中的提示
      this.data.onceTime && (clearTimeout(this.data.onceTime))
      this.data.onceTime = setTimeout(() => {
        scrollNavShow = false;
        this.setData({
          scrollNavShow
        })
      }, 1000);
    },
    // 侧边栏滑动
    catchNavMove(e) {
      // let { title } = e.target.dataset;
      let clientY = e.touches[0].clientY;
      let {
        scrollNavTop,
        scrollTitle,
        scrollNavShow,
        scrollAnim,
        map
      } = this.data;
      let index = Math.ceil((clientY - scrollNavTop) / 20) - 1; // 20 是每个字幕的高度

      if (index >= 0 && index < map.length) {
        this.setData({
          scrollAnim: false,
          scrollNavShow: true,
          scrollTitle: map[index].title,
        });

        // 一段时间之后隐藏选中的提示
        this.data.onceTime && (clearTimeout(this.data.onceTime))
        this.data.onceTime = setTimeout(() => {
          scrollNavShow = false;
          this.setData({
            scrollNavShow
          })
        }, 1000);
      }
    },
    // 处理数据
    filterMap(data, callback) {
      let map = [],
          obj = {},
          element = '',
          type = this.data.currentType,
          title = '';

      for (let i = 0, length = data.length; i < length; i++) {
        title = data[i].PY;
        data[i].name = data[i].name;
        data[i].id = data[i].id;

        if (!obj[title]) {
          obj[title] = {
            title: title,
            items: [
              data[i]
            ]
          }
        } else {
          obj[title].items.push(data[i])
        }
      };

      // 变成有序列表
      for (let key in obj) {
        map.push(obj[key])
      };
      console.log(map)

      // 排序
      map.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      });

      this.setData({
        map,
        loading: true
      });

      typeof callback === 'function' && callback(map);
    },
  }
});