// pages/create-person/index.js
const { $Message } = require('../../components/base/index');
import { InsertPurview } from '../../api/api';

const countNum = 30;

Page({
  data: {
    params: {
      pic: ''
    },
    loading: false,
    disabled: false,
    pic: 'https://licong96.github.io/lib/image/licong.jpg',
    countNum: countNum,   // 倒计时多少秒
    countTime: null,    // 倒计时
    countIsClick: false,  // 是否能够点了获取验证码
  },
  onLoad: function (options) {
    this.getList();
  },
  onShow: function () {
    // wx.setNavigationBarTitle({
    //   title: '页面标题为路由参数'
    // })
  },
  getList() {
    getList({
      page: 1,
    }).then(res => {
      console.log(res)
    })
  },
  warn() {
    let data = this.data;

    this.setData({
      loading: !data.loading,
      disabled: data.disabled
    })
  },
  // 上传头像
  uploadPic() {
    let _this = this;

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        var tempFilePaths = res.tempFilePaths;
        wx.showLoading({
          title: '图片上传中',
        });
        wx.uploadFile({
          url: 'http://t.vipfgj.com/Handler/FileUpLoad.ashx',
          filePath: tempFilePaths[0],
          name: 'file',
          success(res) {
            var data = JSON.parse(res.data);
            if (data.result === 'success') {
              $Message({ content: '上传成功', type: 'success' });
              _this.setData({
                params: {
                  pic: data.path.replace(/\|/, ''),
                },
                pic: tempFilePaths[0]
              });
            } else {
              $Message({content: '上传失败', type: 'error'});
            }
            wx.hideLoading();
          },
          fail(error) {
            $Message({ content: '网络错误' + error, type: 'error' });
          }
        })
      },
      fail(error) {
        $Message({ content: '取消上传', type: 'warning' });
      }
    })
  },
  // 获取验证码
  bindGetCode() {
    let { countIsClick, countNum } = this.data;
    if (countIsClick) {
      return;
    };
    this.setData({
      countIsClick: true
    });
    this.count(countNum);
  },
  // 倒计时
  count(num) {
    this.setData({
      countNum: num
    });
    this.data.countTime = setTimeout(() => {
      if (num <= 1) {
        clearTimeout(this.data.countTime);
        this.setData({
          countNum: countNum,
          countIsClick: false,
        });
      } else {
        this.count(num-1);
      }
    }, 1000);
  }
})