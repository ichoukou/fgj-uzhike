
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
      ValueType: '',  // 权限值类型
      Cost: '',       // 价值额（添加组时不传）
      NeedType: '',   // 应用的公司类型（添加组时不传）
    },
    ParentNote: '顶级',  // 当前层级的显示
    pickerType: ['本人', '本部', '本师', '跨部'],
    pickerTypeIndex: 0,
    pickerCompany: ['类型一', '类型二', '类型三'],
    pickerCompanyIndex: 0,
    pickerValue: [
      {
        name: '选项一',
        index: 0
      }, {
        name: '选项二',
        index: 1
      }, {
        name: '选项三',
        index: 2
      }
    ],
    pickerValueIndex: 0,
    disabled: false,
    loading: false,
    onceTime: null,
  },
  onLoad(options) {
    console.log('参数', options)
    let { isNew, LevelType, PurviewID, ParentNote, ParentID } = options;
    let params = this.data.params;
    let BooIsNew = /true/.test(isNew);   // isNew传过来之后变成了string类型
    
    this.diffLevelType(LevelType);    // 区分是组或是表或是项
    params.LevelType = LevelType;
    ParentID && (params.ParentID = ParentID);   // 父级Id

    this.setData({
      isNew: BooIsNew,
      params
    });

    PurviewID && this.setData({ PurviewID });
    ParentNote && this.setData({ ParentNote });

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
    let params = this.data.params;
    GetPurviewByID({PurviewID}).then(res => {
      let data = res.data;
      let newObj = {};
      if (data.result === 'success') {
        newObj = Object.assign({}, params, data.temptable[0]);
        this.setData({
          params: newObj
        })
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
  // 改变名称
  changePurviewName(e) {
    let params = this.data.params;

    this.data.onceTime && clearTimeout(this.data.onceTime);
    this.data.onceTime = setTimeout(() => {
      params.PurviewName = e.detail.value;
      this.setData({
        params
      })
    }, 300);
  },
  // 改变索引
  changePurviewIndex(e) {
    let params = this.data.params;
    this.data.onceTime && clearTimeout(this.data.onceTime);
    this.data.onceTime = setTimeout(() => {
      params.PurviewIndex = e.detail.value;
      this.setData({
        params
      })
    }, 300);
  },
  // 改变备注
  changePurviewNote(e) {
    let params = this.data.params;
    this.data.onceTime && clearTimeout(this.data.onceTime);
    this.data.onceTime = setTimeout(() => {
      params.PurviewNote = e.detail.value;
      this.setData({
        params
      })
    }, 300);
  },
  // 改变价值额
  changeCost(e) {
    let params = this.data.params;
    this.data.onceTime && clearTimeout(this.data.onceTime);
    this.data.onceTime = setTimeout(() => {
      params.Cost = e.detail.value;
      this.setData({
        params
      })
    }, 300);
  },
  // 封装监听input函数
  changeInput(e) {

  },
  // 企业类型选项
  bindNeedActionSheet() {
    let _this = this;
    let arr = ['本公司', '分销商', '中介'];
    wx.showActionSheet({
      itemList: arr,
      success: function (res) {
        let params = _this.data.params;
        params.NeedType = arr[res.tapIndex];
        _this.setData({
          params
        })
      }
    })
  },
  // picker改变事件
  bindPickerChange: function (e) {
    let { name } = e.currentTarget.dataset;
    this.setData({
      [name]: e.detail.value
    })
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
      console.log(res)
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
      console.log(res)
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
    if (!_fgj.verify(data.PurviewName, 'require')) {
      result.msg = '名称不能为空';
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