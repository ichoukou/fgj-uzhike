
import { GetFollowByCustID } from '../../../api/customer/follow-list';
const { $Message } = require('../../../components/base/index');
import { URL_PATH } from '../../../utils/config';

Page({
  data: {
    CustID: '',       // 客户id
    listData: '',     // 跟进数据
    loading: false,   // 加载中
    isPlayAudio: -1,  // 当前正在播放的录音
  },
  onLoad: function (options) {
    let CustID = options.CustID;
    this.data.CustID = options.CustID || '5D7FCB2B0133EF45FB5772D1F8C9B24E';
    if (!CustID) {
      wx.navigateBack();
    }
  },
  onReady: function () {
    this.innerAudioContext = wx.createInnerAudioContext();
  },
  onShow: function () {
    this.GetFollowByCustID();
  },
  // 获取单个客户跟进
  GetFollowByCustID() {
    GetFollowByCustID({
      CustID: this.data.CustID
    }).then(res => {
      this.setData({ loading: true });
      if (res.data.result === 'success') {
        let temptable = res.data.temptable;
        let newData = [];
        let obj = {};
        
        // 处理数据，数据是单个的，这里根据CustFollowID，把数据处理成理想格式
        temptable.forEach(item => {
          if (item.FileUrl) item.fullPathImg = URL_PATH + item.FileUrl;    // 拼接完整路径，用来显示

          if (!obj[item.CustFollowID]) {
            obj[item.CustFollowID] = item;
            if (item.FileUrl && item.FileType === '图片') {
              obj[item.CustFollowID].imageData = [item.fullPathImg];
            }
            if (item.FileUrl && item.FileType === '语音') {
              obj[item.CustFollowID].audioData = [{
                path: item.fullPathImg,
                time: item.Remark
              }];
            }
          } else {
            if (item.FileUrl && item.FileType === '图片') {
              obj[item.CustFollowID].imageData ? '' : obj[item.CustFollowID].imageData = [];
              obj[item.CustFollowID].imageData.push(item.fullPathImg);
            }
            if (item.FileUrl && item.FileType === '语音') {
              obj[item.CustFollowID].audioData ? '' : obj[item.CustFollowID].audioData = [];
              obj[item.CustFollowID].audioData.push({
                path: item.fullPathImg,
                time: item.Remark
              })
            }
          }
        });

        for (let key of Object.keys(obj)) {
          newData.push(obj[key])
        }
        console.log(newData)
        this.setData({
          listData: newData
        });
      }
    })
  },
  // 预览图片
  bindPreviewImage(e) {
    let { current, item } = e.currentTarget.dataset;

    wx.previewImage({
      current: current,
      urls: item.imageData || []
    });
  },
  // 播放语音
  bindPlayAudio(e) {
    let { audio, index, audioIndex } = e.currentTarget.dataset;
    let currentIndex = index + '' + audioIndex;

    this.setData({
      isPlayAudio: currentIndex
    });

    // 播放录音
    this.innerAudioContext.stop();
    this.innerAudioContext.src = audio.path;
    this.innerAudioContext.play();
    this.innerAudioContext.onEnded(() => {
      this.setData({
        isPlayAudio: -1
      });
    });
    this.innerAudioContext.onError((res) => {
      this.setData({
        isPlayAudio: -1
      });
    });
  },
  // 打开跟进页面
  bindOpenFollow() {
    wx.navigateTo({
      url: '../follow/index?CustID=' + this.data.CustID,
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
    console.log(1)
  },
})