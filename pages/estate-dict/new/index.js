const { $Message } = require('../../../components/base/index');
import _fgj from '../../../utils/util.js';
import { FileUpLoad, GetDistrictByCityID } from '../../../api/public';
import { InsertEstate, UpdateEstate, GetEstateByID } from '../../../api/estate-dict/new';
import { URL_PATH } from '../../../utils/config';

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
    imgCropper: '',       // 裁切后的图片地址
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
    iconLoading: false,   // 图片加载中
  },
  onLoad(options) {
    console.log('参数', options)
    let { EstateID } = options;
    let params = this.data.params;

    EstateID && (params.EstateID = EstateID);

    this.setData({
      params
    });

    // 判断是新建还是编辑
    if (EstateID) {
      wx.setNavigationBarTitle({
        title: '编辑楼盘'
      });
      this.GetEstateByID(EstateID);    // 获取需要编辑的数据
    } else {
      wx.setNavigationBarTitle({
        title: '快速创建楼盘'
      });
    }
  },
  onReady: function () {

  },
  onShow: function () {
    let { params, citySelector, imgCropper } = this.data;
    // 处理城市
    if (citySelector.CityID) {
      params.CityID = citySelector.CityID;
      this.setData({
        params
      });
      this.GetDistrictByCityID(citySelector.CityID);      // 根据城市ID获取区域数据
    };
    // 上传裁切后的图片
    if (imgCropper && imgCropper.indexOf(URL_PATH) === -1) {
      this.uploadFile(imgCropper)
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
      // console.log(res)
      if (res.data.result === 'success') {
        let { params, pickerDistrictIndex } = this.data;
        let data = res.data.temptable;

        if (!params.DistrictName) {
          params.DistrictName = data[0].CityName; // 如果没有，就默认选中第一个
        } else {
          for (let i = 0, length = data.length; i < length; i++) {
            if (params.DistrictName === data[i].CityName) {
              pickerDistrictIndex = i
            }
          };
        };

        console.log(data)
        
        this.setData({
          params,
          pickerDistrict: data,
          pickerDistrictIndex
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
  // 获取需要编辑的数据
  GetEstateByID(EstateID) {
    let { params, citySelector, pickerDistrict } = this.data;

    wx.showLoading({ title: '加载中' });
    GetEstateByID({
      EstateID
    }).then(res => {
      // console.log(res)
      if (res.data.result === 'success') {
        let temptable = res.data.temptable[0];
        let newObj = Object.assign({}, params, temptable);

        citySelector.CityName = newObj.CityName;    // 回填城市
        this.GetDistrictByCityID(newObj.CityID);    // 处理区域

        this.setData({
          params: newObj,
          citySelector,
          imgCropper: URL_PATH + newObj.CoverImgUrl      // URL_PATH 拼接图片地址，用来显示
        });
        wx.hideLoading();
      } else {
        wx.hideLoading();
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },
  // 点击完成
  bindSubmit() {
    let params = this.data.params;
    let verify = this.verifyData(params);   // 验证数据

    if (verify.status) {
      this.setData({
        disabled: true,
        loading: true
      });

      if (!params.EstateID) {
        this.InsertEstate();      // 新建
      } else {
        this.UpdateEstate();      // 编辑
      }
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
            url: '/pages/login/entry/index'
          })
        }, 1500);
      } 
      else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },
  // 编辑
  UpdateEstate() {
    let params = this.data.params;

    wx.showLoading({ title: '加载中' });
    UpdateEstate(params).then(res => {
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
    let { params } = this.data;

    wx.chooseImage({
      count: 1, // 只能一张
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        let tempFilePaths = res.tempFilePaths;
        // 去裁切
        wx.navigateTo({
          url: `/pages/img-cropper/index?src=${tempFilePaths[0]}`
        });
      },
      fail(e) {
        console.log(e)
      }
    });
  },
  // 调用上传接口
  uploadFile(path) {
    let _this = this;
    let { params } = this.data;

    wx.showLoading({
      title: '图片上传中',
    });
    _this.setData({
      iconLoading: true
    })

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
            imgCropper: URL_PATH + data.sm_path.replace(/\|/, '')      // URL_PATH 拼接图片地址，用来显示
          });
          $Message({ content: '图片上传成功', type: 'success' });
        } else {
          $Message({ content: '图片上传失败', type: 'error' });
        };
        wx.hideLoading();
        _this.setData({
          iconLoading: false
        })
      },
      fail(error) {
        wx.hideLoading();
        _this.setData({
          iconLoading: false
        });
        $Message({ content: '图片上传失败', type: 'error' });
      }
    })
  },
})