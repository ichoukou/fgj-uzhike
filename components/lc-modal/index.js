
import { $wuxBackdrop } from '../index';

Component({
  properties: {
    isShow: {
      type: Boolean,
      value: false
    },
  },
  data: {
  },
  created() {
    this.$wuxBackdrop = $wuxBackdrop('#wux-backdrop-modal', this);
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