const { $Message } = require('../../../components/base/index');
import { FileUpLoad } from '../../../api/public';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
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
  // 选择图片并上传
  chooseImage() {
    const _this = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log(res)
        let tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: '图片加载中',
        })
        wx.uploadFile({
          url: FileUpLoad,
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res) {
            wx.hideLoading();
            let data = JSON.parse(res.data)
            if (data.result === 'success') {
              console.log(res)
              _this.setData({
                tempFilePath: tempFilePaths[0]
              })
              $Message({ content: '上传成功', type: 'success' });
            } else {
              $Message({ content: '上传失败', type: 'error' })
            }
          },
          fail: function (err) {
            $Message({ content: '网络错误' + err, type: 'error' })
          }
        })
      }
    })
  }
})