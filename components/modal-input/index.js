
import { $wuxBackdrop } from '../index';

Component({
  properties: {
    isShow: {
      type: Boolean,
      value: false
    },
    titleText: {
      type: String,
      value: '标题'
    }
  },
  data: {
    inputValue: '', // input的值
  },
  created() {
    this.$wuxBackdrop = $wuxBackdrop('#wux-backdrop2', this)
  },
  methods: {
    // 显示模态框
    onShowModal(params = {}) {
      this.setData({
        isShow: true,
        inputValue: params.inputValue || ''
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

      this.triggerEvent('submit', {
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
    },
  },
});