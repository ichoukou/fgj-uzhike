
const { $Message } = require('../../../components/base/index');
import _fgj from '../../../utils/util';
import { GetPurviewListByLayer } from '../../../api/purview/purview';

Page({
  data: {
    params: {
      pagetype: '1',   // 传递页面类型
      ParentID: '',   // 父级id
      LevelType: 2,   // 层级，当前层级是 1
    },
    ParentNo: [],     // 父级编号
    ParentNote: [],   // 父级名称，用来显示
    itemData: [],
    loading: false,
    disabled: false,
    itemValue0: 0,    // item的值
    pickerItemValue: [
      {
        label: '本人',
        value: '本人'
      }, {
        label: '本部',
        value: '本部'
      }, {
        label: '本师',
        value: '本师'
      }
    ],
    pickerItemValueIndex: 0,
    itemValue2: 0,    // item的值
  },
  onLoad: function (options) {
    console.log('项参数', options)
    let { ParentID, ParentNo, ParentNote } = options;
    let params = this.data.params;
    params.ParentID = ParentID;
    this.setData({
      params,
      ParentNo,
      ParentNote: ParentNote.split(/,/)    // 当前层级，传过来的是一个用 , 分割的字符串，要把他变成数组
    });
  },
  onReady: function () {

  },
  onShow: function () {
    this.getItemData();    // 获取表数据
  },
  // 获取表数据
  getItemData() {
    GetPurviewListByLayer(this.data.params).then(res => {
      console.log(res)
      let data = res.data;
      if (data.result === 'success') {
        data.temptable.forEach(item => {
          item.offsetLeft = 0;    // 添加 offsetLeft 用来滑动
          // 判断ValueType权限值类型显示操作类型
          switch (item.ValueType) {
            case '0':
              item.ValueTypeName = '开关'
            break;
            case '1':
              item.ValueTypeName = '分级'
            break;
            case '2':
              item.ValueTypeName = '控量'
            break;
            default:
              console.log('ValueType is error');
              item.ValueTypeName = '空';
          }
        });
        this.setData({
          itemData: data.temptable
        })
      } else {
        $Message({ content: data.msg, type: 'warning' });
      }
    })
  },
  // picker改变事件
  bindPickerChange: function (e) {
    let { params, pickerItemValue, pickerItemValueIndex } = this.data;
    let index = e.detail.value;

    // params.pickerItemValue = pickerItemValue[index].value;
    this.setData({
      // params,
      pickerItemValueIndex: index
    })
  },
  // 切换选项
  switchChange(e) {
    // let params = this.data.params;
    // params.DenyOP = Number(e.detail.value);   // 把Boolean值转换成数字
    // this.setData({
    //   params
    // })
  },
})