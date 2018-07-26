
Component({
  properties: {
    inputType: {
      type: String,
      value: 'input'
    },
    value: {
      type: String,
      value: ''
    },
    label: {
      type: String,
      value: ''
    },
    isField: {
      type: Boolean,
      value: false
    },
  },
  data: {
    focus: false,
  },
  ready() {
    // 回填
    if (this.data.value) {
      this.setData({
        isField: true
      })
    }
  },
  methods: {
    // 输入框聚焦
    bindTextFieldFocus(e) {
      let { isField, focus } = this.data;

      this.setData({
        isField: false,
        focus: true
      })
    },
    // 输入框失去焦点
    bindTextFieldBlur(e) {
      let newVal = e.detail.value;
      let { value, isField, focus } = this.data;

      this.setData({
        value: newVal,
        isField: newVal ? true : false,
        focus: false
      });

      this.triggerEvent('value', {
        value: newVal
      });
    }
  },
});