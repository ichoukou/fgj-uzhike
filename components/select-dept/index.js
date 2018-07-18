
import { GetDepartmentByDeptNo } from '../../api/organizational/department';
import { $wuxBackdrop } from '../index';
import { MAXIMUM } from '../../utils/config';

Component({
  properties: {
    isShow: {
      type: Boolean,
      value: false
    },
  },
  data: {
    departmert: {
      offsetLeft: '-0%',
      Layer: 0,
      DeptNo: '',
      nav: [],
      data: [[], [], [], []],
      value: {},
    }
  },
  created() {
    this.$wuxBackdrop = $wuxBackdrop('#wux-backdrop', this);
    this.GetDepartmentByDeptNo();
  },
  methods: {
    // 获取对应的部门
    GetDepartmentByDeptNo(callback) {
      let departmert = this.data.departmert;
      let { Layer, DeptNo } = departmert;

      GetDepartmentByDeptNo({
        Layer,
        DeptNo
      }).then(res => {
        // console.log(res.data)
        if (res.data.result === 'success') {
          departmert.data.splice(Layer, 1, res.data.temptable);
          this.setData({
            departmert
          });
          typeof callback === 'function' && callback();     // 获取到下一级数据之后的回调
        }
      })
    },
    // 选项改变
    bindChangeSelect(e) {
      let { layer, deptNo, deptId, deptName } = e.currentTarget.dataset;
      let departmert = this.data.departmert;
      let nextIndex = Number(layer) + 1;

      departmert.value = {
        DeptID: deptId,
        DeptName: deptName
      }

      departmert.data.splice(nextIndex, 1, []);   // 每次获取前都先清空下一级

      this.setData({
        departmert
      });

      // 当前导航
      this.selectNav(layer, deptName);

      // 最多4级
      if (nextIndex >= MAXIMUM) {
        return;
      }

      departmert.Layer = nextIndex;
      departmert.DeptNo = deptNo;

      // 获取下一级数据
      this.GetDepartmentByDeptNo(() => {
        this.selectOffsetLeft();    // 有下一级数据再滑动位置
      });
    },
    // 当前导航
    selectNav(layer, deptName) {
      let departmert = this.data.departmert;

      departmert.nav.splice(layer, MAXIMUM, deptName);    // 每次切换的时候，把后面的导航都去掉

      this.setData({
        departmert
      })
    },
    // 导航位置切换
    bindSelectNav(e) {
      let { index } = e.currentTarget.dataset;
      let departmert = this.data.departmert;

      switch (index) {
        case 0:
          departmert.offsetLeft = '-0%'
          break;
        case 1:
          departmert.offsetLeft = '-50%'
          break;
        case 2:
          departmert.offsetLeft = '-100%'
          break;
        default:
          departmert.offsetLeft = '-100%'
      };
      this.setData({
        departmert
      })
    },
    // 滑动位置
    selectOffsetLeft() {
      let departmert = this.data.departmert;

      if (departmert.Layer === 2) {
        departmert.offsetLeft = '-50%'
      } else if (departmert.Layer === 3) {
        departmert.offsetLeft = '-100%'
      };

      this.setData({
        departmert
      })
    },
    // 确定按钮
    confirm() {
      this.triggerEvent('confirm', {
        value: this.data.departmert.value
      });
      this.hide();
    },
    // 显示
    show() {
      this.retainBackdrop();
      this.setData({
        isShow: true
      })
    },
    // 隐藏
    hide() {
      this.releaseBackdrop();
      this.setData({
        isShow: false
      })
    },
    // 保持遮罩
    retainBackdrop() {
      this.$wuxBackdrop.retain()
    },
    // 释放遮罩
    releaseBackdrop() {
      this.$wuxBackdrop.release()
    },
  },
});