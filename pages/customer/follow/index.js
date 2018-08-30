const { $Message } = require('../../../components/base/index');
import { FileUpLoad } from '../../../api/public';
import { URL_PATH } from '../../../utils/config';
import { InserCustomerFollow, InserCustomerFollowFile } from '../../../api/customer/follow';
import GUID from '../../../utils/guid';

// 临时ID
const guid = new GUID();
const guidstr = guid.newGUID().toUpperCase();

Page({
  data: {
    CustFollowID: guidstr,
    adjust: false,
    tempFilePath: '',
    keyboardHeight: 0,        // 键盘高度
    typeData: ['电话', '接待', '带访', '到访', '自访'],
    typeIndex: 0,             // 当前选中的类型下标
    typeLine: 0,              // 当前类型下划线的位置
    typeItemWidth: 140,       // 当前类型项的宽度
    FollowContent: '',        // 跟进内容
    IsShowRecord: false,      // 是否打开录音
    recordStatus: 0,          // 当前录音的状态 0 => 准备录音, 1 => 正在录音, 2 => 录音结束
    recordPlay: false,        // 播放录音状态
    recordDesc: '点击开始录音', // 当前状态文字提醒
    recordDuration: 30000,     // 指定录音的时长，单位 ms 
    recordDurationTime: 0,     // 录音计时
    recordPath: {},           // 当前录音数据
    recordData: [],           // 保存的录音
    imageData: [],            // 保存图片数据
    imageFullData: [],        // 保存图片完整地址数据
    Position: '',             // 地理位置
    IsShowShade: false,       // 是否显示遮罩
    currentRecordPlay: -1, // 当前需要播放的单条语音
  },
  onLoad: function (options) {
    this.data.CustID = 'AD5FE90B8133EF43112BB9D0AFBE8E9B'
  },
  onReady: function () {
    this.recorderManager = wx.getRecorderManager();
    this.innerAudioContext = wx.createInnerAudioContext();
  },
  onShow: function () {
  },
  // 发送
  bindSend() {
    let data = this.data;
    let params = {};

    params.CustFollowID = data.CustFollowID;
    params.FollowType = data.typeData[data.typeIndex];
    params.CustID = data.CustID;
    params.FollowContent = data.FollowContent;
    params.Position = data.Position;

    console.log(params);

    // 上传主体内容
    if (params.FollowContent) {
      this.InserCustomerFollow(params);
    }
    // 上传图片
    let imgStr = data.imageData.join('|');
    if (imgStr) {
      this.InserCustomerFollowFile('图片', imgStr);
    }
    // 上传语音
    let recordArr = data.recordData.map(item => item.tempFilePath);
    let recordStr = recordArr.join('|');
    if (recordStr) {
      this.InserCustomerFollowFile('语音', recordStr);
    }
  },
  // 添加客户跟进文件
  InserCustomerFollowFile(FileType, FileUrl) {
    InserCustomerFollowFile({
      CustFollowID: this.data.CustFollowID,
      FileType,
      FileUrl,
    }).then(res => {
      if (res.data.result === 'success') {
        $Message({ content: FileType + '上传成功', type: 'success' });
      } else {
        $Message({ content: FileType + '上传失败', type: 'error' });
      };
    });
  },
  // 添加客户跟进主体
  InserCustomerFollow(params) {
    InserCustomerFollow(params).then(res => {
      console.log(res)
      if (res.data.result === 'success') {
        $Message({ content: '添加成功', type: 'success' });
      } else {
        $Message({ content: '添加失败', type: 'error' });
      };
    })
  },
  // 切换类型
  bindTypeItem(e) {
    let index = e.currentTarget.dataset.index;
    let left = index * (this.data.typeItemWidth + 1);

    this.setData({
      typeLine: left,
      typeIndex: index
    })
  },
  // 输入框同步输入
  bindinputText(e) {
    this.setData({
      text: e.detail.value
    })
  },
  // 输入框聚焦时触发
  bindfocusText(e) {
    // let height = e.detail.height || '';
    // let keyboardHeight = height

    this.setData({
      IsShowRecord: false,
      // keyboardHeight: e.detail.height || 0,
    });
    setTimeout(() => {
      this.setData({
        keyboardHeight: e.detail.height || 0,
      });
    }, 30);
  },
  // 输入框失去焦点时触发
  bindblurText(e) {

    this.data.FollowContent = e.detail.value;

    this.setData({
      keyboardHeight: 0,
    });
  },

  // 上传图片
  updateImage() {
    let _this = this;

    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths || [];

        wx.showLoading({
          title: '图片上传中',
        });

        tempFilePaths.forEach(item => {
          _this.uploadFile(item);
        });
      },
      fail(e) {
        console.log(e)
      }
    })
  },
  // 调用上传接口
  uploadFile(path) {
    let _this = this;
    let { imageData, imageFullData } = this.data;

    wx.uploadFile({
      url: FileUpLoad,
      filePath: path,
      name: 'file',
      success(res) {
        let data = JSON.parse(res.data);
        if (data.result === 'success') {
          let path = data.sm_path.replace(/\|/, '');      

          imageData.push(path);
          imageFullData.push(URL_PATH + path);    // URL_PATH 拼接图片地址，用来显示
          
          _this.data.imageData = imageData;
          _this.setData({
            imageFullData
          });
          $Message({ content: '图片上传成功', type: 'success' });
        } else {
          $Message({ content: '图片上传失败', type: 'error' });
        };
        wx.hideLoading();
      },
      fail(error) {
        console.log(error)
        wx.hideLoading();
        $Message({ content: '图片上传失败', type: 'error' });
      }
    })
  },
  // 删除图片
  bindRemoveImg(e) {
    let index = e.currentTarget.dataset;
    let { imageData, imageFullData } = this.data;

    imageData.splice(index, 1);
    imageFullData.splice(index, 1);

    this.setData({
      imageData,
      imageFullData
    });
  },

  // 录音功能
  // 打开录音
  bindOpenRecord() {
    console.log('open')
    this.setData({
      IsShowRecord: true,
      IsShowShade: true
    });
  },
  // 开始录音
  bindRecordStart() {
    let recordStatus = this.data.recordStatus;

    // 判断当前录音状态，再次点击的时候，进去下一步状态
    if (recordStatus === 0) {
      this.setData({
        recordStatus: 1,      // 修改状态为 1 正在录音
        recordDesc: '开始录音'
      });
      this.recordStart();
    }
    if (recordStatus === 1) {
      this.setData({
        recordStatus: 2,      // 修改状态为 2 结束录音
      });
      this.recorderManager.stop();
    }
    // 播放录音
    if (this.data.recordPath.tempFilePath && recordStatus === 2 && !this.data.recordPlay) {
      this.setData({
        recordPlay: true
      });
      this.audioPlay(this.data.recordPath.tempFilePath);
    }
  },
  // 开始录音
  recordStart() {
    this.recorderManager.start({
      duration: this.data.recordDuration,
    });
    this.recorderManager.onStart(() => {
      this.setData({
        recordDesc: '正在录音...'
      });
      // 计时
      let num = 1;
      this.setData({ recordDurationTime: 1 });
      this.data.time = setInterval(() => {
        if (this.data.recordDurationTime >= (this.data.recordDuration / 1000)) {
          clearInterval(this.data.time);
          return false;
        }
        this.setData({
          recordDurationTime: num++
        });
      }, 1000);
    });
    this.recordStop();
  },
  // 监听结束录音
  recordStop() {
    this.recorderManager.onStop((data) => {
      this.data.recordPath = data;     // 保存当前录音数据
      console.log(data)
      this.setData({
        recordDesc: '完成录音',
        recordStatus: 2
      });
      clearInterval(this.data.time);
    });
    this.recorderManager.onError((err) => {
      this.setData({
        recordDesc: err.errMsg || '录音错误'
      });
      clearInterval(this.data.time);
    });
  },
  // 播放录音
  audioPlay(path) {
    this.innerAudioContext.src = path;
    this.innerAudioContext.play();
    this.innerAudioContext.onPlay(() => {
      this.setData({
        recordDesc: '正在播放录音'
      });
    });
    this.innerAudioContext.onEnded(() => {
      this.setData({
        recordPlay: false,
        recordDesc: '播放结束',
        currentRecordPlay: -1
      });
    });
    this.innerAudioContext.onError((res) => {
      this.setData({
        recordPlay: false,
        recordDesc: '录音错误',
        currentRecordPlay: -1
      });
    });
  },
  // 删除录音
  bindRemoveRecord() {
    this.data.recordPath = {};
    this.innerAudioContext.stop();
    this.setData({
      recordStatus: 0,
      recordPlay: false,
      recordDurationTime: 0,
      recordDesc: '点击开始录音',
    });
  },
  // 保存录音
  bindSaveRecord() {
    let recordData = this.data.recordData;
    let recordPath = this.data.recordPath;
    
    recordPath.time = parseInt(recordPath.duration / 1000);   // 取秒数

    recordData.push(recordPath);
    this.data.recordPath = {};
    this.innerAudioContext.stop();

    this.setData({
      recordStatus: 0,
      recordPlay: false,
      recordDurationTime: 0,
      recordDesc: '点击开始录音',
      recordData
    });
  },
  // 删除语音
  bindRemoveVoice(e) {
    let index = e.currentTarget.dataset.index;
    let recordData = this.data.recordData;

    recordData.splice(index, 1);

    this.setData({
      recordData
    });
  },
  // 播放单条语音
  bindVoicePlay(e) {
    let index = e.currentTarget.dataset.index;
    
    this.innerAudioContext.stop();
    this.audioPlay(this.data.recordData[index].tempFilePath);
    this.setData({
      currentRecordPlay: index
    });
  },  

  // 点击遮罩
  bindShade() {
    this.setData({
      IsShowRecord: false,
      IsShowShade: false
    })
  }
})