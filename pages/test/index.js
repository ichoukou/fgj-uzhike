// pages/test/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_attr: [
      {
        name: '型号',
        key: 'key-1',    // 这个是这条数据的名称，可以是最终传给后端的字段
        child: [
          {
            val: '8G+64G'
          }, {
            val: '8G+256G'
          }
        ]
      },
      // 可能是下面这样
      {
        name: '尺寸',
        key: 'key-2',
        child: [
          {
            val: 'M'
          }, {
            val: 'L'
          }, {
            val: 'XL'
          }
        ]
      },
      // 再多的数据也能显示
      {
        name: '颜色',
        key: 'key-3',
        child: [
          {
            val: '红色'
          }, {
            val: '黑色'
          }, {
            val: '白色'
          }
        ]
      },
    ],
    params: {}, // 存储选中的值
  },
  onLoad: function (options) {
  
  },
  onShow: function () {
  
  },
  // 改变选项
  bindChange(e) {
    // console.log(e.currentTarget.dataset)
    let { val, type } = e.currentTarget.dataset;
    let params = this.data.params;

    params[type] = val;   // 动态修改

    this.setData({
      params
    });
  },
  // 输出选中的结果
  bindLog() {
    console.log(this.data.params)
  }
})