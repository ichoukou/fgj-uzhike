const { $Message } = require('../../../components/base/index');
import { GetUnionProjectToPage, DelProject } from '../../../api/project/list';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: {     // 筛选参数
      page: 1,
    },
    listData: [],
    onceTime: null,
    loading: false,
    scrollLower: true,    // 显示上滑加载中
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.GetUnionProjectToPage();     // 获取项目列表数据
  },
  // 搜索返回结果
  bindQuery(e) {
    let { params } = this.data;

    this.data.onceTime ? clearTimeout(this.data.onceTime) : '';
    this.data.onceTime = setTimeout(() => {
      params.likestr = e.detail.value;
      this.setData({
        params
      })
      this.GetUnionProjectToPage();
    }, 300);
  },

  // 获取楼盘列表数据
  GetUnionProjectToPage() {
    let { params } = this.data;

    this.setData({
      loading: false
    });

    params.page = 1;
    GetUnionProjectToPage(params).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable || [];

        this.setData({
          listData: data,
          loading: true
        })
        console.log(this.data.listData)
      } else {
        this.setData({
          listData: [],
          loading: true
        })
      };
    })
  },

  // 列表滚动到底部，加载下一页
  bindscrolltolower(e) {
    console.log(e)
    let { params, listData } = this.data;
    this.setData({
      scrollLower: false
    });
    params.page++;
    GetUnionProjectToPage(params).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable || [];

        this.setData({
          listData: listData.concat(data),
          scrollLower: true
        })
      } else {
        this.setData({
          scrollLower: true
        })
      };
    })
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
  
  },


  // 更多操作
  bindOpenMore(e) {
    console.log(e)
    this.moreOperation(e.currentTarget.dataset.projectId);
  },
  // 列表更多操作
  moreOperation(projectId) {
    console.log(projectId)
    let _this = this;

    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success: function (res) {
        console.log(res.tapIndex)
        switch (res.tapIndex) {
          case 0:
            // 去编辑
            wx.navigateTo({
              url: '../new/index?projectId=' + projectId,
            });
            break;
          case 1:
            // 删除
            wx.showModal({
              title: '删除提醒',
              content: '您确定要删除这个楼盘吗？',
              success: function (res) {
                if (res.confirm) {
                  _this.DelProject(projectId);
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            break;
          default:
            console.log('tapIndex错误')
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  // 删除楼盘
  DelProject(projectId) {
    wx.showLoading({
      title: '正在删除',
    });
    DelProject({
      projectId
    }).then(res => {
      wx.hideLoading();
      if (res.data.result === 'success') {
        $Message({ content: '删除成功', type: 'success' });
        this.GetEstatePage();     // 获取楼盘列表数据
      } else {
        $Message({ content: '删除失败', type: 'error' });
      };
    })
  },
})