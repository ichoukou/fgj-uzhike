
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hrList: [
      { name: '考勤打卡', src: '../../../images/icon/b-1-05.jpg', selected: false },
      { name: '签到', src: '../../../images/icon/b-1-06.jpg', selected: false },
      { name: '审核', src: '../../../images/icon/b-1-07.jpg', selected: false },
      { name: '人员管理', src: '../../../images/icon/b-1-08.jpg', selected: false }
    ],
    marketList: [
      { name: '项目管理', src: '../../../images/icon/b-1-09.jpg', selected: false },
      { name: '客户管理', src: '../../../images/icon/b-1-10.jpg', selected: false },
      { name: '合同', src: '../../../images/icon/b-1-11.jpg', selected: false },
      { name: '工作日志', src: '../../../images/icon/b-1-12.jpg', selected: false }
    ],
    financialList: [
      { name: '报销审批', src: '../../../images/icon/b-1-13.jpg', selected: false },
      { name: '业绩统计', src: '../../../images/icon/b-1-14.jpg', selected: false }
    ],
    hrChecked: false,
    marketChecked: false,
    financialChecked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  // 提交
  submit () {
    let { hrList, marketList, financialList } = this.data
    let workList = Object.assign({}, { hrList, marketList, financialList })
    console.log(workList)
    wx.setStorage({
      key: "workspaceList",
      data: workList
    })
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  // 人事管理选择绑定事件
  hrChange (e) {
    console.log(e.detail.value)
    if (e.detail.value.length === this.data.hrList.length) {
      this.setData({
        hrChecked: true
      })
    } else {
      this.setData({
        hrChecked: false
      })
    }
  },
  // 市场营销选择绑定事件
  marketChange(e) {
    if (e.detail.value.length === this.data.marketList.length) {
      this.setData({
        marketChecked: true
      })
    } else {
      this.setData({
        marketChecked: false
      })
    }
  },
  // 财务管理选择绑定事件
  financialChange(e) {
    if (e.detail.value.length === this.data.financialList.length) {
      this.setData({
        financialChecked: true
      })
    } else {
      this.setData({
        financialChecked: false
      })
    }
  },
  // 人事管理全选操作
  hrSelected () {
    let hrList = this.data.hrList
    let selected = !this.data.hrChecked
    let list = this.selectAll(selected, hrList)
    this.setData({
      hrChecked: selected,
      hrList: list
    })
  },
  // 市场管理全选操作
  marketSelected () {
    let marketList = this.data.marketList
    let selected = !this.data.marketChecked
    let list = this.selectAll(selected, marketList)
    this.setData({
      marketChecked: selected,
      marketList: list
    })
  },
  // 财务管理全选操作
  financialSelected() {
    let financialList = this.data.financialList
    let selected = !this.data.financialChecked
    let list = this.selectAll(selected, financialList)
    this.setData({
      financialChecked: selected,
      financialList: list
    })
  },
  // 全选
  selectAll (selected, list) {
    if (selected) {
      for (let i = 0, len = list.length; i < len; i++) {
        list[i].selected = true
      }
    } else {
      for (let i = 0, len = list.length; i < len; i++) {
        list[i].selected = false
      }
    }
    return list
  }
})