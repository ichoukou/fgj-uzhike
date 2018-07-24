const { $Message } = require('../base/index');
import { GetAllCityList, GetCityIDByName } from '../../api/public';
import city from './city';
import PinYin from './utk';

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
    // 判断是否有缓存数据
    wx.getStorage({
      key: 'cityData',
      success: (res) => {
        this.setData({
          map: res.data,
          loading: true
        })
      },
      fail: (err) => {
        this.GetAllCityList();    // 获取所有城市信息
      }
    });
    this.getSetting();      // 获取用户权限设置
  },
  ready() {
    this.getScrollNavTop(); // 获取侧边导航距离顶部位置
  },
  methods: {
    // 获取所有城市信息
    GetAllCityList() {
      GetAllCityList().then(res => {
        console.log(res)
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
          this.filterMap(data)
        }
      })
    },
    // 获取用户权限设置
    getSetting() {
      let _this = this;

      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userInfo']) {
            wx.authorize({
              scope: 'scope.userLocation',
              success() {
                _this.getUserInfo();
              },
              fail(err) {
                console.log(err)
              }
            })
          } else {
            _this.getUserInfo();
          }
        }
      });
    },
    // 获取用户信息
    getUserInfo() {
      wx.getUserInfo({
        lang: 'zh_CN',
        success: (res) => {
          // console.log(res.userInfo)
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo
          });
          this.GetCityIDByName(res.userInfo.city);
        }
      })
    },
    // 根据城市名称匹配城市id
    GetCityIDByName(city) {
      let { userInfo } = this.data;

      GetCityIDByName({
        CityName: city
      }).then(res => {
        console.log(res)
        // userInfo.CityID = res
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
    // 选中城市
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
    // 搜索
    bindQuery(e) {
      console.log(e.detail.value)
      // let likestr = e.detail.value;
      this.data.params.likestr = e.detail.value;

      this.data.onceTime && (clearTimeout(this.data.onceTime));
      this.data.onceTime = setTimeout(() => {

      }, 200)
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
    filterMap(data) {
      let map = this.data.map,
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
      // console.log(map)

      // 排序
      map.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      });

      this.setData({
        map,
        loading: true
      });

      // 缓存城市数据
      wx.setStorage({
        key: 'cityData',
        data: map
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
  }
});