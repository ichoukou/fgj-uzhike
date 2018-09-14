
const { $Message } = require('../../../components/base/index');
import { GetReceptionist, InsertFollowPerson } from '../../../api/reception/history-reception';
import _fgj from '../../../utils/util';

Page({
  data: {
    ProjectReceptionID: '',     // 接待id
    ProjectReceptionistID: '',  // 接待历史id
    listData: [],               // 列表数据
    loading: false,             // 是否加载完毕
    isDisabled: false,          // 防止重复发送
    FollowPerson: [],           // 存储已添加的随行人员
    pickerObj: {                // 临时保存添加的随行人员
      Sex: '先生'
    },
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
  },
  onLoad: function (options) {
    this.data.ProjectReceptionID = options.ProjectReceptionID || '78BA90D32EC6446DB4A090C9A80C9F93';
    this.GetReceptionist();    // 获取数据
  },
  onReady: function () {
    this.followPersonModeal = this.selectComponent('#followPersonModeal');
  },
  onShow: function () {
    // 页面返回的时候，没有数据再去获取
    setTimeout(() => {
      if (!this.data.listData.length) {
        this.GetReceptionist();    // 获取数据
      }
    }, 300);
  },
  // 获取数据
  GetReceptionist() {
    this.setData({
      loading: false
    });
    GetReceptionist({
      ProjectReceptionID: this.data.ProjectReceptionID
    }).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable;

        this.filterData(data);    // 处理数据

        this.setData({
          listData: data,
          loading: true
        });
      } else {
        this.setData({
          listData: [],
          loading: true
        });
      }
    });
  },
  // 处理数据
  filterData(data) {
    data.forEach(item => {
      item.FollowPerson && (item.FollowPersonData = JSON.parse(item.FollowPerson));
    });
    console.log(data);
  },
  // 打开随行人员弹窗
  bindAddPerson(e) {
    let item = e.currentTarget.dataset.item;

    this.data.ProjectReceptionistID = item.ProjectReceptionistID;   // 保存接待历史ID
    this.data.FollowPerson = item.FollowPersonData;
    this.followPersonModeal.onShowModal();
  },
  // 随行人员输入完成确认
  bindPersonConfirm() {
    let { pickerObj, FollowPerson } = this.data;
    let params = {};

    if (!_fgj.verify(pickerObj.Tel, 'phone')) {
      $Message({ content: '手机号码有误', type: 'error' });
      return
    }
    FollowPerson.push(pickerObj);
    params.FollowPerson = JSON.stringify(FollowPerson);
    params.ProjectReceptionistID = this.data.ProjectReceptionistID;
    
    this.InsertFollowPerson(params);
    this.bindPersonCancel();
  },
  // 对接待历史记录添加随行人员
  InsertFollowPerson(params) {
    InsertFollowPerson(params).then(res => {
      if (res.data.result === 'success') {
        $Message({ content: '操作成功', type: 'success' });
        this.GetReceptionist();       // 再次获取数据
      } else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    });
  },
  // 取消添加随行人员
  bindPersonCancel() {
    this.followPersonModeal.onHideModal();
    this.setData({
      pickerObj: {
        Sex: '先生'
      },
      pickerSexIndex: 0
    });
  },
  // 删除随行人员
  bindRemovePerson(e) {
    let {item, index} = e.currentTarget.dataset;
    let params = {};

    console.log(item)
    item.FollowPersonData.splice(index, 1);

    params.FollowPerson = JSON.stringify(item.FollowPersonData);
    params.ProjectReceptionistID = item.ProjectReceptionistID;

    this.InsertFollowPerson(params);
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
  onHide: function () {
  
  },
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})