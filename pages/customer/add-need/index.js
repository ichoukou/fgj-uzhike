
const { $Message } = require('../../../components/base/index');
import data from '../new//pickerData';       // 保存所有选项数据
import _fgj from '../../../utils/util.js';
import { GetCustNeedByID, InsertCustNeed, UpdateCustNeed } from '../../../api/customer/add-need';
import { CheckLogin } from '../../../api/public';

Page({
  data: {
    paramsCustNeed: {
      CustID: '',
      CustNeedID: '',     // 有这个ID就是编辑
    },
    unit: '万元',       // 判断需求类型决定显示 元 还是 万元
    Area: ['请选择', '请选择', '请选择'],     // 区域
    pickerNeedType: data.pickerNeedType,
    pickerNeedTypeIndex: 0,
    propertyType: [
      {
        label: '住宅',
        value: '住宅'
      }, {
        label: '公寓',
        value: '公寓'
      }, {
        label: '写字楼',
        value: '写字楼'
      }, {
        label: '商铺',
        value: '商铺'
      }, {
        label: '厂房',
        value: '厂房'
      }, {
        label: '其他',
        value: '其他'
      },
    ],
    pickerRoom: data.pickerRoom,
    pickerRoomIndex: 0,
    loading: false,
    disabled: false,
  },
  onLoad: function (options) {
    console.log(options)
    let { CustID, CustNeedID } = options;

    this.data.paramsCustNeed.CustID = CustID;   // 关联ID

    // 这里是编辑
    if (CustNeedID) { 
      this.data.paramsCustNeed.CustNeedID = CustNeedID;
      this.GetCustNeedByID(CustNeedID);
    }
  },
  onReady: function () {

  },
  onShow: function () {

  },
  // 根据CustNeedID获取客户需求
  GetCustNeedByID(CustNeedID) {
    wx.showLoading({
      title: '加载中'
    });
    GetCustNeedByID({
      CustNeedID
    }).then(res => {
      wx.hideLoading();
      if (res.data.result === 'success') {
        let paramsCustNeed = this.data.paramsCustNeed,
          temptable = res.data.temptable[0] || {},
          property = '',
          propertyIndex = 0,
          index = 0;

        let map = ['NeedType', 'Room'];

        // 根据需求类型修改属性选项
        this.selectNeedType(temptable.NeedType);

        // picker控件数据回填
        for (let key of map) {
          if (temptable[key]) {
            property = 'picker' + key;
            propertyIndex = 'picker' + key + 'Index';
            index = this.backfillPicker(this.data[property], temptable[key]);
            this.setData({
              [propertyIndex]: index
            });
          }
        }
        // 回填区域
        this.setData({
          Area: temptable.Area.split('-')
        });

        // 处理数据价位
        if (temptable.NeedType === '求购') {
          temptable.MinPrice = temptable.MinPrice / 10000;
          temptable.MaxPrice = temptable.MaxPrice / 10000;
        }

        this.setData({
          paramsCustNeed: Object.assign({}, paramsCustNeed, temptable)
        });

      } else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },
  // picker控件数据回填
  backfillPicker(data, target) {
    for (let i = 0, length = data.length; i < length; i++) {
      if (data[i].value === target) {
        return i;
      }
    };
  },
  // 区域
  bindAreaChange: function (e) {
    let value = e.detail.value;
    let paramsCustNeed = this.data.paramsCustNeed;

    paramsCustNeed.Area = value.join('-');

    this.setData({
      Area: value,
      paramsCustNeed,
    });
  },
  // 多选
  changeCheckbox(e) {
    let value = e.detail.value;
    let paramsCustNeed = this.data.paramsCustNeed;
    paramsCustNeed.PropertyType = value.join('/');

    this.setData({
      paramsCustNeed
    });
  },
  // 监听下拉选项
  bindPickerCustNeedChange(e) {
    let types = e.currentTarget.dataset.type,
      index = e.detail.value,
      property = 'picker' + types,
      propertyIndex = 'picker' + types + 'Index',
      paramsCustNeed = this.data.paramsCustNeed,
      value = this.data[property][index].value;

    paramsCustNeed[types] = value;

    this.setData({
      paramsCustNeed,
      [propertyIndex]: index
    });

    // 根据需求类型修改属性选项
    if (types === 'NeedType') {
      // 处理户型
      this.selectNeedType(value);

      // 处理价位单位
      if (value === '求购') {
        this.setData({
          unit: '万元'
        });
      } else {
        this.setData({
          unit: '元'
        })
      }
    }
  },
  // 根据需求类型修改属性选项
  selectNeedType(value) {
    let picker = [],
      pickerIndex = 0,
      paramsCustNeed = this.data.paramsCustNeed;

    // 产权属性，当需求不为求购、求租时，默认为其他
    if (value !== '求购' && value !== '求租') {
      // 重置已选的数据
      paramsCustNeed.Room = '';
      picker = [
        {
          label: '其他',
          value: '其他'
        }
      ];
      this.setData({
        pickerRoom: picker,
        pickerRoomIndex: pickerIndex
      });
    } else {
      this.setData({
        pickerRoom: data.pickerRoom
      });
    }
  },
  // 监听input改变
  changeCustNeedInput(e) {
    let { type } = e.currentTarget.dataset;
    let paramsCustNeed = this.data.paramsCustNeed;

    paramsCustNeed[type] = e.detail.value;

    this.filterInputData(paramsCustNeed, type);   // 处理输入的数据

    this.setData({
      paramsCustNeed
    });
  },
  // 处理输入的数据
  filterInputData(obj, types) {
    if (obj.MaxSquare && Number(obj.MinSquare) > Number(obj.MaxSquare)) {
      $Message({ content: '最小面积不能大于最大面积', type: 'warning' });
      obj.MaxSquare = obj.MinSquare = '';
    }
    if (obj.MaxPrice && Number(obj.MinPrice) > Number(obj.MaxPrice)) {
      $Message({ content: '最低价位不能高于最高价位', type: 'warning' });
      obj.MaxPrice = obj.MinPrice = '';
    }
  },
  // 完成
  submit() {
    let params = this.data.paramsCustNeed;
    let verify = this.verifyData(params);

    if (!verify.status) {
      $Message({ content: verify.msg, type: 'error' });
      return false;
    }

    // 检查是否为登录状态
    CheckLogin(res=> {
      if (res.data.result === 'success') {

        this.setData({
          loading: true,
          disabled: true
        });

        // 处理数据价位，用作上传，元
        if (params.NeedType === '求购') {
          params.MinPrice = params.MinPrice * 10000;
          params.MaxPrice = params.MaxPrice * 10000;
        }

        if (params.CustNeedID) {
          this.UpdateCustNeed(params);          // 编辑
        } else {
          this.InsertCustNeed(params);    // 新建
        }
      } else {
        wx.showToast({
          title: '权限不足，即将跳登陆',
          icon: 'none',
          duration: 1000
        });
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/authorize/index'
          })
        }, 1000);
      }
    });
  },
  // 新建需求
  InsertCustNeed(params) {
    wx.showLoading({ title: '添加中' });
    InsertCustNeed(params).then(res => {
      wx.hideLoading();
      this.setData({
        loading: false,
        disabled: false
      });
      if (res.data.result === 'success') {
        $Message({ content: '添加成功', type: 'success' });
        // 通过上一个页面，添加需求内容
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2]; // 上一个页面
        let paramsCustNeed = prevPage.data.paramsCustNeed;

        params.CustNeedID = res.data.CustNeedID;    // 附加CustNeedID，用作删除和编辑

        // 处理价位单价，用作显示，万元
        if (params.NeedType === '求购') {
          params.MinPrice = params.MinPrice / 10000;
          params.MaxPrice = params.MaxPrice / 10000;
        }

        paramsCustNeed.push(params);
        prevPage.setData({
          paramsCustNeed
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1000);
      }
      else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    });
  },
  // 编辑需求
  UpdateCustNeed(params) {
    wx.showLoading({ title: '修改中' });
    UpdateCustNeed(params).then(res => {
      wx.hideLoading();
      this.setData({
        loading: false,
        disabled: false
      });
      if (res.data.result === 'success') {
        $Message({ content: '修改成功', type: 'success' });
        setTimeout(() => {
          wx.navigateBack();
        }, 1200);
      }
      else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    });
  },
  // 验证数据
  verifyData(data) {
    let result = {
      status: false,
      msg: '错误提示'
    };
    if (!_fgj.verify(data.NeedType, 'require')) {
      result.msg = '请选择需求类型';
      return result;
    };
    if (!_fgj.verify(data.Area, 'require')) {
      result.msg = '请选择区域';
      return result;
    };
    if (!_fgj.verify(data.PropertyType, 'require')) {
      result.msg = '请选择产权性质';
      return result;
    };
    if (!_fgj.verify(data.Room, 'require')) {
      result.msg = '请选择户型';
      return result;
    };
    if (!_fgj.verify(data.MinSquare, 'number-dot')) {
      result.msg = '请填写最小面积';
      return result;
    };
    if (!_fgj.verify(data.MaxSquare, 'number-dot')) {
      result.msg = '请填写最大面积';
      return result;
    };
    if (!_fgj.verify(data.MinPrice, 'number-dot')) {
      result.msg = '请填写最小价位';
      return result;
    };
    if (!_fgj.verify(data.MaxPrice, 'number-dot')) {
      result.msg = '请填写最大价位';
      return result;
    };
    result.status = true;
    result.msg = '验证通过';

    return result;
  },
  onUnload() {
    
  }
})
