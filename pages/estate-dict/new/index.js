
const { $Message } = require('../../../components/base/index');
import _fgj from '../../../utils/util.js';
import { FileUpLoad, GetDistrictByCityID, GetCookie } from '../../../api/public';
import { InsertEstate } from '../../../api/estate-dict/new';

const app = getApp();

Page({
  data: {
    params: {
      CityID: '',         // 城市id
      DistrictName: '',		// 区域名
      EstateName: '',		  // 楼盘名
      Address: '',		    // 地址
      CoverImgUrl: '',		// 封面图
    },
    imgView: '',        // 存储本地选中的图片地址，只用来显示
    citySelector: {       // citySelector标识符城市选择列表用到，不可修改
      CityName: '请选择城市'
    },
    pickerDistrict: [
      {
        CityName: '请选择区域'
      }
    ],
    pickerDistrictIndex: 0,
    disabled: false,
    loading: false,
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

    // GetCookie().then(res => {
    //   console.log(res)
    // })
    
    let { params, citySelector } = this.data;
    console.log(citySelector)
    if (citySelector.CityID) {
      params.CityID = citySelector.CityID;
      this.setData({
        params
      });
      this.GetDistrictByCityID(citySelector.CityID);      // 根据城市ID获取区域数据
    }
  },
  // 打开选择城市页面
  bindOpenCity() {
    wx.navigateTo({
      url: '../city/index'
    })
  },
  // 根据城市ID获取区域数据
  GetDistrictByCityID(id) {
    GetDistrictByCityID({
      CityID: id
    }).then(res => {
      console.log(res)
      if (res.data.result === 'success') {
        let { params } = this.data;
        let data = res.data.temptable;

        params.DistrictName = data[0].CityName;     // 默认选中第一个
        this.setData({
          params,
          pickerDistrict: data
        })
      } else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },
  // 选择区域
  bindPickerChange(e) {
    let index = e.detail.value;
    let { params, pickerDistrict, pickerDistrictIndex } = this.data;

    params.DistrictName = pickerDistrict[index].CityName;

    this.setData({
      params,
      pickerDistrictIndex: index
    })
  },
  // 浮动输入框改变
  bindFieldChange(e) {
    console.log(e)
    let { type } = e.currentTarget.dataset;
    let { value } = e.detail;
    let { params } = this.data;

    if (type === 'name') {
      params.EstateName = value;
    } 
    else if (type === 'address') {
      params.Address = value
    };
    this.setData({
      params
    });
  },
  /*
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
  */
  // 点击完成
  bindSubmit() {
    let params = this.data.params;
    let verify = this.verifyData(params);   // 验证数据

    console.log(params)

    if (verify.status) {
      this.setData({
        disabled: true,
        loading: true
      });

      this.InsertEstate();
    } else {
      $Message({ content: verify.msg, type: 'error' });
    }
  },
  // 新建
  InsertEstate() {
    let params = this.data.params;
    wx.showLoading({ title: '加载中' });

    InsertEstate(params).then(res => {
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
      }
      else if (res.data.result === '权限不足') {
        $Message({ content: '权限不足，请先登录', type: 'success' });
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/login/entry/index?url=/pages/estate-dict/new/index'
          })
        }, 1500);
      } 
      else {
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
    if (!_fgj.verify(data.CityID, 'require')) {
      result.msg = '请选择城市';
      return result;
    };
    if (!_fgj.verify(data.DistrictName, 'require')) {
      result.msg = '请选择区域';
      return result;
    };
    if (!_fgj.verify(data.EstateName, 'require')) {
      result.msg = '请填写楼盘名称';
      return result;
    };
    if (!_fgj.verify(data.Address, 'require')) {
      result.msg = '请填写楼盘地址';
      return result;
    };
    result.status = true;
    result.msg = '验证通过';
    return result;
  },
  // 上传封面图
  bindUploadImg() {
    let _this = this;
    let { params, imgView } = this.data;

    wx.chooseImage({
      count: 1, // 只能一张
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        let tempFilePaths = res.tempFilePaths;

        wx.showLoading({
          title: '图片上传中',
        });
        uploadFile(tempFilePaths[0]);
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
            params.CoverImgUrl = data.path.replace(/\|/, '');

            _this.setData({
              params,
              imgView: path
            });

            $Message({ content: '图片上传成功', type: 'success' });
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
  /*
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
  */
})