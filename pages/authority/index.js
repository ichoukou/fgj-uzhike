
const app = getApp();
const { $Message } = require('../../components/base/index');
import { $wuxBackdrop } from '../../components/index';

Page({
  data: {
    modalTitleText: ''
  },
  onLoad() {
    this.modalInput = this.selectComponent('#modalInput');
    // this.modalInput.onShowModal();
    // this.$wuxBackdrop = $wuxBackdrop();
  },
  onShow() {
  },
  // 删除成功提醒
  messageError() {
    $Message({
      content: '删除成功',
      type: 'error'
    });
  },
  // 弹出框确定返回按钮
  _modalSubmit(e, option) {
    let { inputValue } = e.detail;
    let { whoType } = this.data.parents;

    this.modalInput.onHideModal();
    $Message({
      content: '新建成功',
      type: 'success'
    });
  },
  // retainBackdrop() {
  //   this.$wuxBackdrop.retain()
  // },
  // releaseBackdrop() {
  //   this.$wuxBackdrop.release()
  // },
  // clickBackdrop() {
  //   console.log('隐藏')
  //   this.releaseBackdrop();
  // }
});
