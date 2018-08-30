
export default function fetch(params) {
  let { url, method, data } = params;
  let token = wx.getStorageSync('token') || '';

  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      success: function (res) {
        if(res.data.result === '权限不足') {
          wx.showToast({
            title: '权限不足，即将跳登陆',
            icon: 'none',
            duration: 1200
          });
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/authorize/index'
            })
          }, 1200);
          return;
        };
        resolve(res);
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
