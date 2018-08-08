
Component({
  properties: {
    isShow: {
      type: Boolean,
      value: false
    },
    screenData: {
      type: Object,
      value: {}
    }
  },
  data: {
    option: {}
  },
  created() {
  },
  methods: {
    bindRadioChange(e) {
      console.log(e)
      let { option } = this.data;
      let { type } = e.currentTarget.dataset;
      let { value } = e.detail;

      option[type] = value;

      this.setData({
        option
      });
    },
    // 重置
    bindReset() {
      let { screenData } = this.data;

      this.setData({
        option: {}
      });
      this.triggerEvent('reset', {
        option: {}
      });
      this.hide();

      // 去掉选中状态
      for (let key of Object.keys(screenData)) {
        if (screenData[key]) {
          screenData[key].forEach(item => {
            item.checked = false
          })
        }
      };
      this.setData({
        screenData
      });
    },
    // 确定
    bindConfirm() {
      console.log(this.data.screenData)
      this.triggerEvent('confirm', {
        option: this.data.option
      });
      this.hide();
    },
    // 显示
    show() {
      this.setData({
        isShow: true
      })
    },
    // 隐藏
    hide() {
      this.setData({
        isShow: false
      })
    }
  },
});