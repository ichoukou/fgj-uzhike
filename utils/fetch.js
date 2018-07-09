
export default function fetch(params) {
  let { url, method, data } = params;
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('success')
        resolve(res)
      },
      fail(err) {
        console.log('error')
        wx.hideLoading();
        wx.showModal({
          title: '请求失败',
          content: '有一个网络请求发生了异常',
          showCancel: false,
          confirmText: '知道了',
          confirmColor: '#ff6714',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        });
        reject(err)
      }
    })
  })
};
