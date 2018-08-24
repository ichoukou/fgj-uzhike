
import { GetCustByID, GetCustNeedByCustID, GetCustomerLinkByCustID } from '../../../api/customer/detail';

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

    this.CustID = CustID;

    this.GetCustByID(CustID);
    this.GetCustNeedByCustID(CustID);
    this.GetCustomerLinkByCustID(CustID)
  },
  onReady: function () {

  },
  onShow: function () {
    
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
  }
})