
import { $wuxBackdrop } from '../index';

Component({
  properties: {
    isShow: {
      type: Boolean,
      value: false
    },
    titleText: {
      type: String,
      value: '新建组'
    }
  },

  data: {
    inputValue: '', // input的值
  },

  ready: function () {
  },

  methods: {
    // 显示模态框
    onShowModal() {
      this.setData({
        isShow: true
      })
      this.retainBackdrop();
    },
    // 隐藏模态框
    onHideModal() {
      this.setData({
        isShow: false
      })
      this.releaseBackdrop();
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

      this.triggerEvent('bandModalSubmit', {
        inputValue: inputValue
      });
      // 发送成功后清空
      this.setData({
        inputValue: ''
      })
    },
    retainBackdrop() {
      this.$wuxBackdrop.retain()
    },
    releaseBackdrop() {
      this.$wuxBackdrop.release()
    },
    clickBackdrop() {
      this.onHideModal();
    }
  },
  created() {
    this.$wuxBackdrop = $wuxBackdrop('#wux-backdrop2', this)
  },
});