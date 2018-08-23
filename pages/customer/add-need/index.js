
const { $Message } = require('../../../components/base/index');
import data from '../new//pickerData';       // 保存所有选项数据

Page({
  data: {
    paramsCustNeed: {},
    Intention: 0,         // 意向度
    Area: ['江西省', '南昌市', '高新区'],     // 区域
    pickerNeedType: data.pickerNeedType,
    pickerNeedTypeIndex: 0,
    pickerPropertyType: data.pickerPropertyType,
    pickerPropertyTypeIndex: 0,
    pickerRoom: data.pickerRoom,
    pickerRoomIndex: 0,
  },
  onLoad: function (options) {
    
  },
  onReady: function () {

  },
  onShow: function () {

  },
  // 监听下拉选项——客户主体数据
  bindPickerCustomerChange(e) {
    let types = e.currentTarget.dataset.type,
      index = e.detail.value,
      property = 'picker' + types,
      propertyIndex = 'picker' + types + 'Index',
      paramsCustomer = this.data.paramsCustomer;

    paramsCustomer[types] = this.data[property][index].value;

    this.setData({
      paramsCustomer,
      [propertyIndex]: index
    });
    console.log(this.data.paramsCustomer)
  },
  // 监听input改变——客户需求数据
  changeCustNeedInput(e) {
    let { type } = e.currentTarget.dataset;
    let paramsCustNeed = this.data.paramsCustNeed;

    paramsCustNeed[type] = e.detail.value;
    this.setData({
      paramsCustNeed
    });
  },
  submit() {
  }
})
