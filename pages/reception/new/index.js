
const { $Message } = require('../../../components/base/index');
import _fgj from '../../../utils/util';
import { InsertReception } from '../../../api/reception/new';
import { GetCanDeclareProject } from '../../../api/inquiry/project';

Page({
  data: {
    params: {},           // 要添加的随行人员
    FollowPerson: [],     // 存储已添加的随行人员
    pickerObj: {          // 临时保存添加的随行人员
      Sex: '先生'
    },
    pickerProjectID: [],
    pickerProjectIDIndex: 0,
    pickerSex: [
      {
        label: '先生',
        value: '先生'
      }, {
        label: '女士',
        value: '女士'
      }
    ],
    pickerSexIndex: 0,
    disabled: false,
  },
  onLoad: function (options) {
  },
  onReady: function () {
    this.followPersonModeal = this.selectComponent('#followPersonModeal');
  },
  onShow: function () {
    this.GetCanDeclareProject();    // 获取项目列表
    this.setData({
      disabled: false
    });
  },
  onHide: function () {
  
  },
  // 获取项目列表
  GetCanDeclareProject() {
    let { params, pickerProjectIDIndex } = this.data;

    GetCanDeclareProject().then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable;

        // 处理项目列表数据
        this.fillterProjectData(data);

        this.setData({
          pickerProjectID: data
        });
        params.ProjectID = data[pickerProjectIDIndex].ProjectID;    // 默认选中第一个项目
      } else {
        this.setData({
          pickerProjectID: []
        });
      }
    });
  },
  // 处理项目列表数据
  fillterProjectData(data) {
    // 添加label和value字段，用在筛选里面
    data.forEach(item => {
      item.label = item.ProjectName;
      item.value = item.ProjectID;
    });
  },
  // 点击完成新增接待
  submit() {
    let { params, FollowPerson } = this.data;
    let verify = this.verifyData(params);

    if (!verify.status) {
      $Message({ content: verify.msg, type: 'error' });
      return false;
    }

    // 处理跟随人员
    FollowPerson.length && (params.FollowPerson = JSON.stringify(FollowPerson));

    wx.showLoading({ title: '添加中' });
    this.setData({
      disabled: true
    });
    // 发送新增接待请求
    InsertReception(params).then(res => {
      wx.hideLoading();
      this.setData({
        disabled: false
      });
      if (res.data.result === 'success') {
        $Message({ content: '添加成功', type: 'success' });
        setTimeout(() => {
          // 去通知到访
          wx.navigateTo({
            url: '../inform/index?ProjectReceptionID=' + res.data.ProjectReceptionID
          });
        }, 500);
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
    if (!_fgj.verify(data.ProjectID, 'require')) {
      result.msg = '请选择接待项目';
      return result;
    };
    if (!_fgj.verify(data.CustName, 'require')) {
      result.msg = '请输入姓名';
      return result;
    };
    if (!_fgj.verify(data.CustTel, 'phone')) {
      result.msg = '手机号码有误';
      return result;
    };
    result.status = true;
    result.msg = '验证通过';

    return result;
  },
  // 监听项目列表下拉选项
  bindPickerParamsChange(e) {
    let index = e.detail.value;
    let { params, pickerProjectID } = this.data;

    params.ProjectID = pickerProjectID[index].value;

    this.setData({
      params,
      pickerProjectIDIndex: Number(index)
    });
  },
  // 监听手机号变化
  changeCustTel(e) {
    let { type } = e.currentTarget.dataset;
    let params = this.data.params;

    params[type] = e.detail.value;

    this.setData({
      params
    });
  },
  // 打开随行人员弹窗
  bindAddPreson() {
    this.followPersonModeal.onShowModal();
  },
  // 随行人员输入完成确认
  bindPersonConfirm() {
    let { pickerObj, FollowPerson } = this.data;

    if (!_fgj.verify(pickerObj.Tel, 'phone')) {
      $Message({ content: '手机号码有误', type: 'error' });
      return
    }

    FollowPerson.push(pickerObj);

    this.setData({
      FollowPerson
    });
    this.bindPersonCancel();
  },
  // 删除已添加的随行人员
  bindRemovePerson(e) {
    let index = e.currentTarget.dataset.index;
    let FollowPerson = this.data.FollowPerson;

    FollowPerson.splice(index, 1);

    this.setData({
      FollowPerson
    });
  },
  // 取消添加随行人员
  bindPersonCancel() {
    this.followPersonModeal.onHideModal();
    this.setData({
      pickerObj: {},
      pickerSexIndex: 0
    });
  },
  // 监听跟随人员性别下拉选项
  bindPickerPersonChange(e) {
    let index = e.detail.value;
    let { pickerObj, pickerSex } = this.data;

    pickerObj.Sex = pickerSex[index].value;
    
    this.setData({
      pickerObj,
      pickerSexIndex: Number(index)
    });
  },
  // 监听跟随人员input改变
  changeInput(e) {
    let pickerObj = this.data.pickerObj;

    pickerObj.Tel = e.detail.value;

    this.setData({
      pickerObj
    });
  },
})