
Page({
  data: {
    LevelType: '顶级',    // 当前层级
    pickerType: ['本人', '本部', '本师', '胯部'],
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
  },
  onLoad(options) {
    console.log('项参数', options)
    let { LevelType } = options;
    switch(LevelType) {
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
    // let { groupId, tableId } = options;
    // this.getStorage(groupId, tableId)
  },
  onReady: function () {

  },
  onShow: function () {

  },
  // picker改变事件
  bindPickerChange: function (e) {
    let { name } = e.currentTarget.dataset;
    this.setData({
      [name]: e.detail.value
    })
  },
  // 切换选项
  switchChange() {

  },
  // 获取缓存模板数据
  getStorage(groupId, tableId) {
    let _this = this;
    wx.getStorage({
      key: 'authorityTempData',
      success: function (res) {
        let data = res.data;
        for (let i = 0, length = data.length; i < length; i++) {
          if (data[i].PurviewIndex === groupId) {
            let tableData = data[i].table;
            for (let i = 0, length = tableData.length; i < length; i++) {
              if (tableData[i].PurviewIndex === tableId) {
                _this.setData({
                  list: data,
                  itemData: tableData[i].item
                });
                console.log(tableData[i].item)
                return;
              }
            }
          }
        }
      }
    })
  }
})