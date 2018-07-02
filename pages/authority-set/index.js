import { $wuxBackdrop } from '../../components/index'

Page({
  data: {
  },
  onLoad() {
    this.$wuxBackdrop = $wuxBackdrop();
  },
  retain() {
    this.$wuxBackdrop.retain()
  },
  release() {
    this.$wuxBackdrop.release()
  },
  clickbackdrop() {
    console.log('隐藏')
    this.release();
  }
})