
Component({
  properties: {
    hidden: {
      type: Boolean,
      value: false
    }
  },
  data: {
  },
  created() {
  },
  methods: {
    show() {
      this.setData({
        hidden: true
      });
      this.triggerEvent('loading', {
        value: true
      });
    },
    hide() {
      this.setData({
        hidden: false
      });
      this.triggerEvent('loading', {
        value: false
      });
    }
  },
});