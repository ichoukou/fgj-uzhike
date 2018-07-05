
const { $Message } = require('../../../components/base/index');
import _fgj from '../../../utils/util.js';

import { InsertPurview, UpPurview, GetPurviewByID } from '../../../api/purview/purview';

Page({
  data: {
    isNew: true,      // true是新建，false是编辑
    PurviewID: '',    // 需要编辑的那个的权限ID 
    params: {
      LevelType: '0',    // 当前层级，可以用来判断新建类型，组/表和项的选项不一样
      PurviewName: '',  // 名称
      PurviewIndex: '',  // 索引
      PurviewNote: '',  // 备注
      DenyOP: 1,    // 无权限时是否显示  0：隐藏  1：显示（添加组时默认传1）
      ParentID: '',   // 父级ID
      ParentNo: '',   // 父级编号
      ValueType: '0',  // 权限值类型
      Cost: '',       // 价值额（添加组时不传）
      NeedType: '本人',   // 应用的公司类型（添加组时不传）
    },
    ParentNote: '顶级',  // 当前层级的显示
    pickerValueType: [
      {
        label: '开关',
        value: '0'
      }, {
        label: '分级',
        value: '1'
      }, {
        label: '控量',
        value: '2'
      }
    ],
    pickerValueTypeIndex: 0,
    pickerNeedType: [
      {
        label: '本人',
        value: '本人'
      }, {
        label: '本部',
        value: '本部'
      }, {
        label: '本师',
        value: '本师'
      }, {
        label: '跨部',
        value: '跨部'
      }
    ],
    pickerNeedTypeIndex: 0,
    disabled: false,
    loading: false,
    onceTime: null,
  },
  onLoad(options) {
    console.log('参数', options)
    let { isNew, LevelType, PurviewID, ParentNo, ParentID, ParentNote } = options;
    let params = this.data.params;
    let BooIsNew = /true/.test(isNew);   // isNew传过来之后变成了string类型
    
    this.diffLevelType(LevelType);    // 区分是组或是表或是项
    params.LevelType = LevelType;
    ParentID && (params.ParentID = ParentID);   // 父级Id
    ParentNo && (params.ParentNo = ParentNo);   // 父级编号
    
    this.setData({
      isNew: BooIsNew,
      params
    });

    PurviewID && this.setData({ PurviewID });
    ParentNote && this.setData({ ParentNote });   // 只用来显示的当前层级

    // 是新建还是编辑
    if (!BooIsNew) {
      this.getPurviewData(PurviewID);    // 获取需要修改的数据
    };
  },
  onReady: function () {

  },
  onShow: function () {
  },
  // 获取需要修改的数据
  getPurviewData(PurviewID) {
    let { params, pickerNeedType, pickerValueType } = this.data;

    GetPurviewByID({PurviewID}).then(res => {
      let data = res.data;
      let newObj = {};
      if (data.result === 'success') {
        let temptable = data.temptable[0];
        let pickerNeedTypeIndex = 0;
        let pickerValueTypeIndex = 0;
        newObj = Object.assign({}, params, temptable);

        // 处理公司类型
        for (let i = 0, length = pickerNeedType.length; i < length; i++) {
          if (temptable.NeedType === pickerNeedType[i].value) {
            pickerNeedTypeIndex = i
          }
        };
        // 处理权限类型
        for (let i = 0, length = pickerValueType.length; i < length; i++) {
          if (temptable.ValueType === pickerValueType[i].value) {
            pickerValueTypeIndex = i
          }
        };

        this.setData({
          pickerNeedTypeIndex,
          pickerValueTypeIndex,
          params: newObj
        });
      } else {
        $Message({ content: data.msg, type: 'warning' });
      }
    })
  },
  // 区分是组或是表或是项
  diffLevelType(LevelType) {
    switch (LevelType) {
      case '0':
        wx.setNavigationBarTitle({
          title: '新建组'
        });
        break;
      case '1':
        wx.setNavigationBarTitle({
          title: '新建表'
        });
        break;
      case '2':
        wx.setNavigationBarTitle({
          title: '新建项'
        });
        break;
      default:
        console.log('走到这就是一条死路')
    };
  },
  // 封装监听input函数
  changeInput(e) {
    let { type } = e.currentTarget.dataset;
    let params = this.data.params;
    this.data.onceTime && clearTimeout(this.data.onceTime);
    this.data.onceTime = setTimeout(() => {
      params[type] = e.detail.value;
      this.setData({
        params
      })
    }, 300);
  },
  // picker改变事件
  bindPickerChange: function (e) {
    let { type } = e.currentTarget.dataset;
    let { params, pickerValueType, pickerValueTypeIndex, pickerNeedType, pickerNeedTypeIndex } = this.data;
    let index = e.detail.value;

    if (type === 'ValueType') {
      params[type] = pickerValueType[index].value;
      this.setData({
        params,
        pickerValueTypeIndex: index
      })
    } else if (type === 'NeedType') {
      params[type] = pickerNeedType[index].value;
      this.setData({
        params,
        pickerNeedTypeIndex: index
      })
    }
  },
  // 切换选项
  switchChange(e) {
    let params = this.data.params;
    params.DenyOP = Number(e.detail.value);   // 把Boolean值转换成数字
    this.setData({
      params
    })
  },
  // 新建完成
  bindSubmit() {
    let params = this.data.params;
    let verify = this.verifyData(params);   // 验证数据
    if (verify.status) {
      console.log(params)
      // 判断isNew是新建还是编辑
      this.setData({
        disabled: true,
        loading: true
      });
      if (this.data.isNew) {
        this.InsertPurview()
      } else {
        this.UpPurview();
      }
    } else {
      $Message({ content: verify.msg, type: 'error' });
    }
  },
  // 新建
  InsertPurview() {
    let params = this.data.params;
    InsertPurview(params).then(res => {
      // console.log(res)
      this.setData({
        disabled: false,
        loading: false
      });
      if (res.data.result === 'success') {
        $Message({ content: '新建成功', type: 'success' });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },
  // 编辑
  UpPurview() {
    let params = this.data.params;
    UpPurview(params).then(res => {
      // console.log(res)
      this.setData({
        disabled: false,
        loading: false
      });
      if (res.data.result === 'success') {
        $Message({ content: '编辑成功', type: 'success' });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },
  // 验证数据
  verifyData(data) {
    let result = {
      status: false,
      msg: '错误提示'
    };
    if (!_fgj.verify(data.PurviewName, 'word')) {
      result.msg = '名称只能是单词字符';
      return result;
    };
    if (!_fgj.verify(data.PurviewIndex, 'require')) {
      result.msg = '索引不能为空';
      return result;
    };
    if (!_fgj.verify(data.PurviewNote, 'require')) {
      result.msg = '备注名不能为空';
      return result;
    };
    result.status = true;
    result.msg = '验证通过';
    return result;
  },
})