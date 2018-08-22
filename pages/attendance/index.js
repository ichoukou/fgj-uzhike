import initCalendar from '../../components/calendar/index';
import { switchView } from '../../components/calendar/index';
import { MAP_KEY } from '../../utils/config.js';

// 引入SDK核心类
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOn: false,      // 是否上班
    isOff: false,    // 是否下班
    isRange: false,   // 是否进入范围
    isLate: true,    // 是否迟到
    text: '考勤打卡',
    stateText: '正常',
    forget: false,      // 是否忘记打卡
    address: '',
    time: '00:00:00',
    lat: '',
    lon: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    initCalendar(); // 使用默认配置初始化日历
    switchView('week');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getLocation()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    if (!this.data.isRange) {
      this.setData({
        text: '外勤打卡'
      })
    } else {
      if(this.data.isOn) {
        this.setData({
          text: '下班打卡'
        })
      }
    }
    if (this.data.isLate) {
      this.setData({
        stateText: '迟到'
      })
    }
    setInterval(() => {
      let time = this.getTime()
      this.setData({
        time
      })
    }, 1000)
  },

  // 获取经纬度
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        this.setData({
          lat: res.latitude,
          lon: res.longitude
        })
        this.locationMap(res.latitude, res.longitude);
      }.bind(this),
      fail(err) {
        // $Message({ content: err.errMsg, type: 'error' })
      }
    })
  },

  // 获取位置信息
  locationMap(lat, lon) {
    // 实例化API核心类
    const map = new QQMapWX({
      key: MAP_KEY // 必填
    });

    // 调用接口
    map.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lon
      },
      success: function (res) {
        console.log(res);
        this.setData({
          address: res.result.address
        })
      }.bind(this),
      fail: function (res) {
        console.log(res);
      }
    });
  },

  // 获取当前时间
  getTime() {
    let t = new Date()
    let h = this.formatTime(t.getHours());
    let m = this.formatTime(t.getMinutes());
    let s = this.formatTime(t.getSeconds());
    return `${h}:${m}:${s}`;
  },
  // 格式化时间
  formatTime(t) {
    return t > 10 ? t : '0' + t
  },

  // 打开地图
  openMap() {
    wx.navigateTo({
      url: `./map/index?lon=${this.data.lon}&lat=${this.data.lat}`,
    })
  }
})