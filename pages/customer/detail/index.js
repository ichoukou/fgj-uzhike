
import { GetCustByID, GetCustNeedByCustID, GetCustomerLinkByCustID } from '../../../api/customer/detail'; 
import { DelCustLink } from '../../../api/customer/add-link';
import { GetFollowByCustID } from '../../../api/customer/follow-list';
const { $Message } = require('../../../components/base/index');
import { URL_PATH } from '../../../utils/config';

Page({
  data: {
    CustID: '',       // 客户ID
    custData: {},     // 客户主体数据
    needData: [],     // 客户需求数据
    followData: [],   // 跟进数据
    linkData: [],     // 关联人数据
    detailShow: false,
    followLoading: false,
    isPlayAudio: -1,    // 当前播放的语音位置
  },
  onLoad: function (options) {
    console.log('参数', options)
    let CustID = options.CustID || '7A58D4327133EF45E4E530F040D7311B';

    this.data.CustID = CustID;
  },
  onReady: function () {
    this.innerAudioContext = wx.createInnerAudioContext();
  },
  onShow: function () {
    let CustID = this.data.CustID;
    if (!CustID) {
      wx.navigateBack();
      return
    }
    this.GetCustByID(CustID);
    this.GetCustNeedByCustID(CustID);
    this.GetFollowByCustID(CustID);
    this.GetCustomerLinkByCustID(CustID);
  },
  // 根据客户ID获取客户数据
  GetCustByID(CustID) {
    GetCustByID({
      CustID
    }).then(res => {
      if (res.data.result === 'success') {
        let custData = res.data.temptable[0];

        this.setData({
          custData
        });
      } else {
        wx.navigateBack();
      }
    })
  },
  // 根据客户ID获取客户需求
  GetCustNeedByCustID(CustID) {
    GetCustNeedByCustID({
      CustID
    }).then(res => {
      if (res.data.result === 'success') {
        let needData = res.data.temptable;

        this.setData({
          needData
        });
      } else {
      }
    })
  },
  // 根据客户ID获取跟进
  GetFollowByCustID(CustID) {
    GetFollowByCustID({
      CustID: CustID
    }).then(res => {
      this.setData({ followLoading: true });
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
              obj[item.CustFollowID].imageData.push(item.fullPathImg)
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
          followData: newData
        });
      }
    })
  },
  // 根据客户ID获取关联人
  GetCustomerLinkByCustID(CustID) {
    GetCustomerLinkByCustID({
      CustID
    }).then(res => {
      if (res.data.result === 'success') {
        let linkData = res.data.temptable;

        this.setData({
          linkData
        });
      } else {
      }
    })
  },
  showSlide () {
    this.setData({
      detailShow: !this.data.detailShow
    })
  },
  // 编辑
  bindEdit() {
    wx.navigateTo({
      url: '../new/index?CustID=' + this.data.CustID
    })
  },
  // 打开跟进
  bindOpenFollow() {
    wx.navigateTo({
      url: '../follow/index?CustID=' + this.data.CustID
    })
  },
  // 拨打电话
  bindPhoneCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.custData.Tel
    })
  },
  // 添加需求
  bindOpenAddneed() {
    let { CustID, custData } = this.data;

    wx.navigateTo({
      url: `../add-need/index?CustID=${CustID}&NeedType=${custData.NeedType}`
    });
  },
  // 添加关联人
  bindOpenAddLink() {
    wx.navigateTo({
      url: '../add-link/index?CustID=' + this.data.CustID
    })
  },
  // 删除关联人
  bindCloseLink(e) {
    const { index, id } = e.currentTarget.dataset;
    let linkData = this.data.linkData;
    let _this = this;

    wx.showModal({
      content: '您确定要删除这个联系人吗?',
      cancelColor: '#666',
      confirmColor: '#ff6714',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({ title: '删除中' });
          DelCustLink({
            CustLinkID: id
          }).then(res => {
            wx.hideLoading();
            if (res.data.result === 'success') {
              $Message({ content: '删除成功', type: 'success' });
              linkData.splice(index, 1);
              _this.setData({
                linkData
              });
            } else {
              $Message({ content: '删除失败', type: 'error' });
            }
          });
        }
      },
    })
  },
  // 查看全部跟进
  bindOpenAllFollow() {
    wx.navigateTo({
      url: '../follow-list/index?CustID=' + this.data.custData.CustID
    })
  },
  // 预览跟进图片
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
})