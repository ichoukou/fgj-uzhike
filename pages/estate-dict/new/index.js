
const { $Message } = require('../../../components/base/index');
import _fgj from '../../../utils/util.js';
import { FileUpLoad } from '../../../api/public';

import { GetPositionByID, InsertPosition, UpPosition } from '../../../api/position/position';

Page({
  data: {
    params: {
      imgPath: '',      // 图片
    },
    pickerValueType: [
      {
        label: '0',
        value: '0'
      }, {
        label: '1',
        value: '1'
      }, {
        label: '2',
        value: '2'
      }, {
        label: '3',
        value: '3'
      }, {
        label: '4',
        value: '4'
      }
    ],
    pickerValueTypeIndex: 0,
    disabled: false,
    loading: false,

    src: 'http://bpic.588ku.com/back_pic/05/14/68/2559a7c01c90133.jpg!r650/fw/800',
    photo: {
      imgData: [],    // 存储添加的图片地址
      imgView: [],    // 存储本地选中的图片地址，只用来显示
    },
  },
  onLoad(options) {
    console.log('参数', options)
    let { PositionID } = options;
    let params = this.data.params;

    // PositionID && (params.PositionID = PositionID);

    this.setData({
      params
    });

    // 是新建还是编辑
    // if (!BooIsNew) {
    //   wx.setNavigationBarTitle({
    //     title: '编辑职务'
    //   });
    //   this.GetPositionByID(PositionID);    // 获取需要编辑的数据
    // } else {
    //   wx.setNavigationBarTitle({
    //     title: '新建职务'
    //   });
    // }
  },
  onReady: function () {
  },
  onShow: function () {
  },
  // 浮动输入框改变
  bindFieldChange(e) {
    console.log(e)
  },

  // 上传图片
  bindUploadImg() {
    let _this = this;
    let { photo, imgView } = this.data;

    wx.chooseImage({
      count: 6, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        let tempFilePaths = res.tempFilePaths;

        wx.showLoading({
          title: '图片上传中',
        });
        
        for (let i = 0; i < tempFilePaths.length; i++) {
          uploadFile(tempFilePaths[i]);
        };
      }
    });
    function uploadFile(path) {
      wx.uploadFile({
        url: FileUpLoad,
        filePath: path,
        name: 'file',
        success(res) {
          let data = JSON.parse(res.data);
          if (data.result === 'success') {

            $Message({ content: '图片上传成功', type: 'success' });
            photo.imgData.push(data.path.replace(/\|/, ''));
            photo.imgView.push(path)

            _this.setData({
              photo
            });
            console.log(photo)
          } else {
            $Message({ content: '图片上传失败', type: 'error' });
          };
          wx.hideLoading();
        },
        fail(error) {
          wx.hideLoading();
          $Message({ content: '网络错误' + error, type: 'error' });
        }
      })
    }
  },

  // 获取需要编辑的数据
  GetPositionByID(PositionID) {
    let { params, pickerValueType } = this.data;

    wx.showLoading({ title: '加载中' });
    GetPositionByID({
      PositionID
    }).then(res => {
      // console.log(res)
      if (res.data.result === 'success') {
        let temptable = res.data.temptable[0];
        let pickerValueTypeIndex = 0;
        let newObj = Object.assign({}, params, temptable);

        // 处理权限类型
        for (let i = 0, length = pickerValueType.length; i < length; i++) {
          if (temptable.PositionLevel === pickerValueType[i].value) {
            pickerValueTypeIndex = i
          }
        };

        this.setData({
          pickerValueTypeIndex,
          params: newObj
        });
        wx.hideLoading();
      } else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },
  // 封装监听input函数
  changeInput(e) {
    let { type } = e.currentTarget.dataset;
    let params = this.data.params;
    params[type] = e.detail.value;
    this.setData({
      params
    });
  },
  // picker改变事件
  bindPickerChange: function (e) {
    let { params, pickerValueType, pickerValueTypeIndex } = this.data;
    let index = e.detail.value;

    params.PositionLevel = pickerValueType[index].value;
    this.setData({
      params,
      pickerValueTypeIndex: index
    })
  },
  // 点击完成
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
        this.InsertPosition()
      } else {
        this.UpPosition();
      }
    } else {
      $Message({ content: verify.msg, type: 'error' });
    }
  },
  // 新建
  InsertPosition() {
    let params = this.data.params;
    wx.showLoading({ title: '加载中' });

    InsertPosition(params).then(res => {
      // console.log(res)
      wx.hideLoading();
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
  UpPosition() {
    let params = this.data.params;

    wx.showLoading({ title: '加载中' });
    UpPosition(params).then(res => {
      // console.log(res)
      wx.hideLoading();
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
    // if (!_fgj.verify(data.PositionName, 'require')) {
    //   result.msg = '职务名称不能为空';
    //   return result;
    // };
    // if (!_fgj.verify(data.BaseSalary, 'number-dot')) {
    //   result.msg = '基本薪资只能是纯数字';
    //   return result;
    // };
    // if (!_fgj.verify(data.FloatSalary, 'number-dot')) {
    //   result.msg = '浮动薪资只能是纯数字';
    //   return result;
    // };
    result.status = true;
    result.msg = '验证通过';
    return result;
  },
})