
import { GetFollowByProjectReceptionID } from '../../../api/reception/follow-list';
const { $Message } = require('../../../components/base/index');
import { URL_PATH } from '../../../utils/config';

Page({
  data: {
    ProjectReceptionID: '', // 跟进id
    listData: '',           // 跟进数据
    loading: false,         // 加载中
    isPlayAudio: -1,        // 当前正在播放的录音
  },
  onLoad: function (options) {
    let ProjectReceptionID = options.ProjectReceptionID;
    this.data.ProjectReceptionID = options.ProjectReceptionID || '78BA90D32EC6446DB4A090C9A80C9F93';
    if (!ProjectReceptionID) {
      wx.navigateBack();
    }
  },
  onReady: function () {
    this.innerAudioContext = wx.createInnerAudioContext();
  },
  onShow: function () {
    this.GetFollowByProjectReceptionID();
  },
  // 获取单个跟进跟进
  GetFollowByProjectReceptionID() {
    console.log('1')
    GetFollowByProjectReceptionID({
      ProjectReceptionID: this.data.ProjectReceptionID
    }).then(res => {
      this.setData({ loading: true });
      if (res.data.result === 'success') {
        let temptable = res.data.temptable;
        let newData = [];
        let obj = {};
        
        // 处理数据，数据是单个的，这里根据ProjectReceptionFollowID，把数据处理成理想格式
        temptable.forEach(item => {
          if (item.FileUrl) item.fullPathImg = URL_PATH + item.FileUrl;    // 拼接完整路径，用来显示

          if (!obj[item.ProjectReceptionFollowID]) {
            obj[item.ProjectReceptionFollowID] = item;
            if (item.FileUrl && item.FileType === '图片') {
              obj[item.ProjectReceptionFollowID].imageData = [item.fullPathImg];
            }
            if (item.FileUrl && item.FileType === '语音') {
              obj[item.ProjectReceptionFollowID].audioData = [{
                path: item.fullPathImg,
                time: item.Remark
              }];
            }
          } else {
            if (item.FileUrl && item.FileType === '图片') {
              obj[item.ProjectReceptionFollowID].imageData ? '' : obj[item.ProjectReceptionFollowID].imageData = [];
              obj[item.ProjectReceptionFollowID].imageData.push(item.fullPathImg);
            }
            if (item.FileUrl && item.FileType === '语音') {
              obj[item.ProjectReceptionFollowID].audioData ? '' : obj[item.ProjectReceptionFollowID].audioData = [];
              obj[item.ProjectReceptionFollowID].audioData.push({
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
      url: '../follow/index?ProjectReceptionID=' + this.data.ProjectReceptionID,
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