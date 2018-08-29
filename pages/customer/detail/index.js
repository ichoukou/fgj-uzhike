
import { GetCustByID, GetCustNeedByCustID, GetCustomerLinkByCustID } from '../../../api/customer/detail'; 
import { DelCustLink } from '../../../api/customer/add-link';
const { $Message } = require('../../../components/base/index');

Page({
  data: {
    CustID: '',
    custData: {},     // 客户主体数据
    needData: [],     // 客户需求数据
    linkData: [],     // 关联人数据
    detailShow: false
  },
  onLoad: function (options) {
    console.log('参数', options)
    let CustID = options.CustID || '7A58D4327133EF45E4E530F040D7311B';

    this.data.CustID = CustID;
  },
  onReady: function () {
  },
  onShow: function () {
    let CustID = this.data.CustID;
    if (!CustID) {
      wx.navigateBack();
      return
    }
    this.GetCustByID(CustID);
    this.GetCustNeedByCustID(CustID);
    this.GetCustomerLinkByCustID(CustID)
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
  // 添加需求
  bindOpenAddneed() {
    wx.navigateTo({
      url: '../add-need/index?CustID=' + this.data.CustID
    })
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
})