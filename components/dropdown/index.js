
Component({
  properties: {
    isShow: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: '下拉文字'
    },
    option: {     // 数据列表
      type: Array,
      value: []
    }
  },
  data: {
    active: -1
  },
  created() {
    console.log(this)
  },
  methods: {
    // 展开收起下拉
    bindTrigger() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    // 选中
    bindCheckout(e) {
      let { index, value } = e.currentTarget.dataset;
      console.log(e)

      this.setData({
        active: index,
        isShow: false
      });

      this.triggerEvent('checkout', {
        value: value
      });
    }
  }
});