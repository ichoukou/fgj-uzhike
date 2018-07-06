
const { $Message } = require('../../../components/base/index');
import _fgj from '../../../utils/util';
import { GetPurviewListByLayer } from '../../../api/purview/purview';
import { SetPurview } from '../../../api/purview-set/purview-set';
import { GetUserGroupPurview } from '../../../api/userGroup/userGroup';

Page({
  data: {
    groupName: '',  // 组名
    tableName: '',  // 表名
    oldPurview: {}, // 用来存储已设置的权限表数据，要和新数据拼接起来上传
    setPurview: {
      ObjType: '',    // 对象类型   0：人员  1：用户组
      ObjID: '',      // 对象id
      PurviewValue: ''    // 权限值打包 例 组名:表名-项名-值,表名-项名-值|组名:表名-项名-值..（只传已修改的整组或已经读取的整组）
    },
    ParentNote: [],   // 父级名称，用来显示
    params: {
      pagetype: '1',   // 传递页面类型
      ParentID: '',   // 父级id
      LevelType: 2,   // 层级，当前层级是 2
    },
    itemData: [],
    loading: false,
    disabled: false,
    pickerItemValue: [
      {
        label: '本人',
        value: '本人'
      }, {
        label: '本部',
        value: '本部'
      }, {
        label: '本司',
        value: '本司'
      }, {
        label: '跨部',
        value: '跨部'
      }
    ],
    pickerItemValueIndex: 0,
    itemValue: {
      switchValue: 0,    // 开关值
      pickerValue: '',    // 选项值
      numberValue: 0,   // 数值
    },
    onceTime: null,
  },
  onLoad: function (options) {
    console.log('项参数', options)
    let { ObjID, ObjType, ParentID, groupName, tableName, ParentNote } = options;
    let params = this.data.params;
    let setPurview = this.data.setPurview;

    setPurview.ObjID = ObjID;
    setPurview.ObjType = ObjType;
    params.ParentID = ParentID;

    this.setData({
      groupName,
      tableName,
      params,
      setPurview,
      ParentNote: ParentNote.split(/,/)    // 当前层级，传过来的是一个用 , 分割的字符串，要把他变成数组
    });

    this.getItemData();    // 获取表数据
  },
  onReady: function () {

  },
  onShow: function () {
  },
  // 设置权限
  bindSubmit() {
    let { itemData, groupName, tableName, setPurview, oldPurview } = this.data;
    let str = '';

    // 拼接新数据字符
    for (let i = 0, length = itemData.length; i < length; i++) {
      str += tableName + '-' + itemData[i].PurviewName + '-' + itemData[i].itemValue + ',';
    };
    // 拼接老数据
    console.log('oldPurview', oldPurview)
    if (Object.keys(oldPurview).length) {
      for (let key in oldPurview) {
        // 排除掉当前修改的数据
        if (key !== tableName) {
          for (let label in oldPurview[key]) {
            str += key + '-' + label + '-' + oldPurview[key][label] + ',';
          }
        }
      }
    }
    setPurview.PurviewValue = groupName + ':' + str;
    console.log(setPurview)

    SetPurview(setPurview).then(res => {
      let data = res.data;
      if (data.result === 'success') {
        $Message({ content: '设置成功', type: 'success' });
      } else {
        $Message({ content: data.msg, type: 'warning' });
      }
    })
  },
  // 获取用户组权限
  getUserGroupPurview(itemData) {
    let data = this.data;
    GetUserGroupPurview({
      UserGroupID: this.data.setPurview.ObjID
    })
      .then(res => {
        console.log(res)
        if (res.data.result === 'success') {
          let temptable = res.data.temptable[0];
          console.log('data', data)
          let str = temptable[data.groupName];

          console.log(str)

          let oneArr = str.split(',');
          let obj = {};
          let listArr = null;
          let tableObj = {};

          oneArr.forEach(item => {
            if (item) {
              listArr = item.split('-');
              if (!obj[listArr[0]]) {
                obj[listArr[0]] = {
                  [listArr[1]]: listArr[2]
                }
              } else {
                obj[listArr[0]][listArr[1]] = listArr[2]
              }
            }
          });

          console.log(obj)
          data.oldPurview = obj;    // 存储起来，设置的时候用
          tableObj = obj[data.tableName];     // 对应的表权限

          if (tableObj) {
            // 遍历数据，回填权限
            itemData.forEach(item => {
              for (let key in tableObj) {
                if (item.PurviewName === key) {
                  item.itemValue = tableObj[key]
                }
              }
            })
          } else {
            itemData.forEach(item => {
              switch (item.ValueType) {
                case '0':
                  item.itemValue = 0
                  break;
                case '1':
                  item.itemValue = '本人'
                  break;
                case '2':
                  item.itemValue = 0
                  break;
                default:
                  console.log('ValueType is error');
                  item.itemValue = '';
              }
            });
          };
          this.setData({
            itemData
          });
        } else {
          $Message({ content: res.data.msg, type: 'warning' })
        }
      })
  },
  // 获取表数据
  getItemData() {
    GetPurviewListByLayer(this.data.params).then(res => {
      // console.log(res)
      let data = res.data;
      if (data.result === 'success') {
        this.getUserGroupPurview(data.temptable);   // 获取用户组权限
      } else {
        $Message({ content: data.msg, type: 'warning' });
      }
    })
  },
  // 控数，减少
  bindNumberJian(e) {
    let { purviewId } = e.currentTarget.dataset;
    let itemData = this.data.itemData;

    for (let i = 0, length = itemData.length; i < length; i++) {
      if (itemData[i].PurviewID === purviewId) {
        if (itemData[i].itemValue <= 0) {
          return;
        } else {
          itemData[i].itemValue--;
          this.setData({
            itemData
          });
          return;
        }
      }
    };
  },
  // 控数，增加
  bindNumberJia(e) {
    let { purviewId } = e.currentTarget.dataset;
    let itemData = this.data.itemData;

    for (let i = 0, length = itemData.length; i < length; i++) {
      if (itemData[i].PurviewID === purviewId) {
        itemData[i].itemValue++;
        this.setData({
          itemData
        });
        return;
      }
    };
  },
  // 封装监听input函数
  changeInput(e) {
    let { purviewId } = e.currentTarget.dataset;
    let itemData = this.data.itemData;
    let currentData = null;

    for (let i = 0, length = itemData.length; i < length; i++) {
      if (itemData[i].PurviewID === purviewId) {
        currentData = itemData[i];
        break;
      }
    };

    this.data.onceTime && clearTimeout(this.data.onceTime);
    this.data.onceTime = setTimeout(() => {
      currentData.itemValue = e.detail.value;
      this.setData({
        itemData
      })
    }, 300);
  },
  // picker改变事件
  bindPickerChange: function (e) {
    let { purviewId } = e.currentTarget.dataset;
    let { itemData, pickerItemValue, pickerItemValueIndex } = this.data;
    let index = e.detail.value;
    let value = Number(e.detail.value);   // 把Boolean值转换成数字

    for (let i = 0, length = itemData.length; i < length; i++) {
      if (itemData[i].PurviewID === purviewId) {
        itemData[i].itemValue = pickerItemValue[index].value;
        break;
      }
    };

    this.setData({
      itemData,
      pickerItemValueIndex: index
    })
  },
  // 切换选项
  switchChange(e) {
    let { purviewId } = e.currentTarget.dataset;
    let itemData = this.data.itemData;
    let value = Number(e.detail.value);   // 把Boolean值转换成数字

    for (let i = 0, length = itemData.length; i < length; i++) {
      if (itemData[i].PurviewID === purviewId) {
        itemData[i].itemValue = String(value);
        break;
      }
    };
    
    this.setData({
      itemData
    });
  },
})