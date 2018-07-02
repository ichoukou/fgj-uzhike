
export default function fetch(params) {
  let { url, method, data } = params;
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        resolve(res)
      },
      fail(err) {
        console.log(err)
        reject(err)
      }
    })
  })
};
