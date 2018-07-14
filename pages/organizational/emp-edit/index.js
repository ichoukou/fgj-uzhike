const { $Message } = require('../../../components/base/index');
import { GetEmployeeByID, UpEmployee } from '../../../api/organizational/employee';
import { FileUpLoad } from '../../../api/public';
import _fgj from '../../../utils/util';
import { maximum, urlPath, defaultImg } from '../../../utils/config';

Page({
  data: {
    params: {
      UserGroupID: '',  // 用户组id
      EmpID: '',        // 人员id
      DeptID: '',       // 部门id
      PositionID: '',   // 职务id
      EmpName: '',      // 用户名称
      Sex: '男',         // 性别
      Birthday: '',     // 生日
      Remark: '',       // 备注
      JoinDate: '',     // 加入时间
      Source: '',       // 来源
      EmpImg: '',       // 头像
      DeptName: '请选择部门',     // 选项
      PositionName: '请选择职务',
      GroupName: '请选择用户组',  
    },
    EmpImg: '',       // 用来显示的头像地址，拼接了服务器路径
    pickerValueSex: [
      {
        label: '男',
        value: '男'
      }, {
        label: '女',
        value: '女'
      }
    ],
    pickerValueSexIndex: 0,
    disabled: false,
    loading: false,
    nowDate: _fgj.formatTimeDate(new Date()),   // 当前日期
  },
  onLoad: function (options) {
    console.log('emp-edit', options)
    let { EmpID } = options;

    if (!EmpID) {
      wx.navigateBack();
    };
    this.GetEmployeeByID(EmpID);    // 根据用户id获取用户信息
  },
  onReady: function () {
    this.selectDept = this.selectComponent('#selectDept');
  },
  onShow: function () {
    this.getPositionValue();    // 获取职务选中后的缓存数据
  },
  // 获取select-page选中后的缓存数据
  getPositionValue() {
    let params = this.data.params;
    try {
      var value = wx.getStorageSync('organSelect');
      if (!value) {
        return
      };
      if (value.type === 'position') {
        params.PositionID = value.id;
        params.PositionName = value.name;
      }
      else if (value.type === 'group') {
        params.UserGroupID = value.id;
        params.GroupName = value.name;
      }; 
      this.setData({
        params
      });
      wx.removeStorageSync('organSelect');    // 保存之后再删除
    } catch (e) {
      console.log('catch', e);
      $Message({ content: e, type: 'error' });
    }
  },
  // 根据用户id获取用户信息
  GetEmployeeByID(EmpID) {
    wx.showLoading({
      title: '加载中',
    });
    GetEmployeeByID({
      EmpID
    }).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable[0];
        let { params, EmpImg, pickerValueSex, pickerValueSexIndex, nowDate } = this.data;

        // 回填性别选项
        for (let i = 0, length = pickerValueSex.length; i < length; i++) {
          if (data.Sex === pickerValueSex[i].value) {
            pickerValueSexIndex = i;
            break;
          }
        };
        data.Birthday || (data.Birthday = nowDate);   // 默认一个生日
        data.JoinDate || (data.JoinDate = nowDate);   // 默认一个加入时间

        // 处理图片路径
        EmpImg = data.EmpImg ? (urlPath + data.EmpImg) : defaultImg;

        this.setData({
          params: Object.assign({}, params, data),
          EmpImg,
          pickerValueSexIndex
        })
      } else {
        $Message({ content: res.data.msg, type: 'warning' })
      };
      wx.hideLoading();
    })
  },
  // 上传头像
  uploadPic() {
    let _this = this;
    let { params, EmpImg } = this.data;

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        var tempFilePaths = res.tempFilePaths;
        wx.showLoading({
          title: '图片上传中',
        });
        wx.uploadFile({
          url: FileUpLoad,
          filePath: tempFilePaths[0],
          name: 'file',
          success(res) {
            var data = JSON.parse(res.data);
            if (data.result === 'success') {
              $Message({ content: '上传成功', type: 'success' });
              params.EmpImg = data.path.replace(/\|/, '');
              _this.setData({
                params,
                EmpImg: tempFilePaths[0]
              });
            } else {
              $Message({ content: '上传失败', type: 'error' });
            }
            wx.hideLoading();
          },
          fail(error) {
            $Message({ content: '网络错误' + error, type: 'error' });
          }
        })
      }
    })
  },
  // 打开部门选择器
  bindOpenSelectDept() {
    this.selectDept.show();
  },
  // 选择部门返回值
  bindSelectConfirm(data) {
    let { DeptID, DeptName } = data.detail.value;
    let params = this.data.params;

    params.DeptID = DeptID;
    params.DeptName = DeptName;

    this.setData({
      params
    })
  },
  // 打开职务选择页
  bindOpenSelectPage(e) {
    let { type } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../select/index?type=' + type
    })
  },
  // 监听输入框
  changeInput(e) {
    let value = e.detail.value
    let { type } = e.currentTarget.dataset;
    let params = this.data.params;

    params[type] = value;
    this.setData({
      params
    })
  },
  // 性别
  bindPickerChange(e) {
    let { params, pickerValueSex, pickerValueSexIndex } = this.data;
    let index = e.detail.value;

    params.Sex = pickerValueSex[index].value;
    this.setData({
      params,
      pickerValueSexIndex: index
    })
  },
  // 选择日期
  bindDateChange(e) {
    console.log(e)
    let { type } = e.currentTarget.dataset;
    let params = this.data.params;

    params[type] = e.detail.value;

    this.setData({
      params
    })
  },
  // 备注
  bindTextAreaBlur(e) {
    let params = this.data.params;

    params.Remark = e.detail.value;

    this.setData({
      params
    });
  },
  // 完成
  bindSubmit() {
    let params = this.data.params;
    let verify = this.verifyData(params);   // 验证数据

    console.log(params)

    if (!verify.status) {
      $Message({ content: verify.msg, type: 'error' });
      return;
    };

    this.setData({
      disabled: true,
      loading: true
    });

    UpEmployee(params).then(res => {
      if (res.data.result === 'success') {
        $Message({ content: '修改成功', type: 'success' });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
      else {
        $Message({ content: res.data.msg, type: 'error' })
      }
    });
  },
  // 验证数据
  verifyData(data) {
    let result = {
      status: false,
      msg: '错误提示'
    };
    if (!_fgj.verify(data.DeptID, 'require')) {
      result.msg = '请选择部门';
      return result;
    };
    result.status = true;
    result.msg = '验证通过';
    return result;
  },
})