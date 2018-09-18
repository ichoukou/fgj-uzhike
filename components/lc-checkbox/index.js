
Component({
  properties: {
    items: {
      type: Array,
      value: []
    },
    value: {        // 一个拼接起来的字符串，用什么分割都无所谓
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
        if (newVal) {
          this.checkboxFill();
        }
      }
    }
  },
  data: {
  },
  created() {
  },
  ready() {
    this.checkboxFill();
  },
  methods: {
    checkboxChange(e) {
      let items = this.data.items;
      let ArrValue = e.detail.value;
      
      // 先清空状态
      items.forEach(item => {
        item.checked = false
      });

      // 再添加状态
      for (let key of items) {
        if (ArrValue.indexOf(key.value) !== -1) {
          key.checked = true;
        }
      }

      this.setData({
        items
      });
      
      this.triggerEvent('change', {
        value: ArrValue,
        items
      });
    },
    // 数据回填
    checkboxFill() {
      let { value, items } = this.data;
      
      // 先清空状态
      items.forEach(item => {
        item.checked = false
      });

      // 再添加状态
      for (let key of items) {
        if (value.indexOf(key.value) !== -1) {
          key.checked = true;
        }
      }

      this.setData({
        items
      });
    }
  },
});