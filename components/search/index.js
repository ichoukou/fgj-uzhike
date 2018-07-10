
Component({
  properties: {
    titleText: {
      type: String,
      value: '标题'
    }
  },
  data: {
    inputValue: '', // input的值
  },
  created() {
  },
  methods: {
    // 显示模态框
    onShowModal(params = {}) {
      this.setData({
        inputValue: params.inputValue || ''
      })
    },
    // 输入名称
    changeInput(e) {
      this.setData({
        inputValue: e.detail.value
      })
    },
    // 确定按钮
    onSubmit(e) {
      let { inputValue } = this.data;

      if (!inputValue.trim()) {
        wx.showToast({
          title: '请输入名称',
          icon: 'none',
          duration: 2000
        })
        return;
      };

      this.triggerEvent('submit', {
        inputValue: inputValue
      });
      // 发送成功后清空
      this.setData({
        inputValue: ''
      })
    },
  },
});