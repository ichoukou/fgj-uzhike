const { $Message } = require('../../../components/base/index');
import _fgj from '../../../utils/util.js';
import GUID from '../../../utils/guid';
import { InsertProject, UpProject, GetProject } from '../../../api/project/new';

// 随机ID
const guid = new GUID();
const guidstr = guid.newGUID().toUpperCase();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: { // 筛选参数
      EstateID: '', 
      ProjectID:'',
      ProjectName:'',
      PropertyType:'',
      DeclareType:'',
      DeclareProtectDays:'',
      NeedBringCust:'',
      VisitProtectDays:'',
      CommissionMode:'',
      IsOpen:0,
      Commission:'',
      SettlementDesc:'',
      Remark:'',
      ManagerContact:'',
      
    },
    sales:[{
      label:'整盘',
      value:'0',
    },{
      label:'部分',
      value:'1',
    }],
    items: [{
      label: '写字楼',
      value: '写字楼'
    }, {
      label: '商铺',
      value: '商铺'
    }, {
      label: '公寓',
      value: '公寓'
    }, {
      label: '住宅',
      value: '住宅'
    }],
    DeclareTypeArray:['全号','全号隐号混合'],
    DeclareProtectDaysArray:[1,2,3,4,5,6,7],
    NeedBringCustArray:['不需要','需要'],
    VisitProtectDaysArray:[1,2,3,4,5,6,7],
    CommissionModeArray: [{id:0,name:'体外刷筹'},{id:1,name:'体内刷筹'}],
    ManagerContactArray:[0],
    label:[{
      label:'地铁边',
      value:"地铁边"
    }, {
        label: '发展潜力大',
        value: "发展潜力大"
      },
      {
        label: '交3千抵1万',
        value: "交3千抵1万"
      },
      {
        label: '配套完善',
        value: "配套完善"
      },
    ],
    Project:{
      ProjectName:'',
      ProjectPhone:''
    },
    Estate: {//楼盘
      EstateName: '',
      EstateID: ''
    },
    checked:0, //销售类型默认整盘
    CommissionModeIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let params = this.data.params
    let ProjectID = options.projectId;
    console.log(options)
    ProjectID && (params.ProjectID = ProjectID);

    this.setData({
      params
    });

    // 判断是新建还是编辑
    if (ProjectID) {
      wx.setNavigationBarTitle({
        title: '编辑项目'
      });
      this.GetProject(ProjectID);    // 获取需要编辑的数据
    } else {
      wx.setNavigationBarTitle({
        title: '新建项目'
      });
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.Estate.EstateName != '' && this.data.Estate.EstateID !=""){
      this.data.EstateID = this.data.Estate.EstateID
      this.data.ProjectName = this.data.Estate.EstateName
      let params = this.data.params
      params.EstateID = this.data.EstateID
      params.ProjectName = this.data.ProjectName
    }
    console.log(this.data.params)
  },
  //选择楼盘
  selectEstate() {
    wx.navigateTo({
      url: '../search-estate/index'
    })
  },
  //选择项目种类
  changeCheckbox(e) {
    let ProjectSort = e.detail.value.join("|")
    let params  = this.data.params
    params.PropertyType = ProjectSort
    console.log(params)
  },
  //选择折扣优惠标签
  OfferFlagchangeCheckbox(e){
    let OfferFlag = e.detail.value.join("|")
    let params = this.data.params
    params.OfferFlag = OfferFlag
    console.log(params)
  },
  //选择报备类型
  bindDeclareTypeChange(e){
    var params = this.data.params
    params.DeclareType = e.detail.value,
    this.setData({
      params,
    })
  },
  //选择报备有效期
  bindDeclareProtectChange(e) {
    var params = this.data.params
    params.DeclareProtectDays = Number(e.detail.value)+1,
      this.setData({
        params,
      })
    console.log(Number(e.detail.value) + 1)
  },
  //选择是否带访
  bindNeedBringCustChange(e){
    var params = this.data.params
    params.NeedBringCust = e.detail.value,
      this.setData({
        params,
      })
    console.log(params)
  },
  //选择到访有效期
  bindVisitProtectDaysChange(e) {
    var params = this.data.params
    params.VisitProtectDays = Number(e.detail.value) + 1,
      this.setData({
        params
      })
    console.log(params)
  },
  //选择佣金模式
  bindCommissionModeChange(e) {
    console.log(e)
    let { params , CommissionModeArray } = this.data
    params.CommissionMode = CommissionModeArray[e.detail.value].name,
      this.setData({
        params,
      CommissionModeIndex: e.detail.value
      })
    console.log(params)
  },
  //选择是否公开
  switchChange(e){
    let params = this.data.params
    if(e.detail.value==false){
      params.IsOpen = 0
    }else{
      params.IsOpen = 1
    }
    this.setData({
      params
    })
    console.log(params)
  },
  //选择销售类型
  radioChange(e) {
    let  checked  = e.detail.value
    this.setData({
      checked
    })
    console.log(e.detail.value)
    
  },
  //项目名称
  bindNameChange(e){
    let params = this.data.params
    params.ProjectName = e.detail.value
  },
  //佣金描述
  bindCommissionChange(e){
    let params = this.data.params
    params.Commission = e.detail.value
    this.setData({
      params,
      Commission: e.detail.value
    })
  },
  //点击添加 
  addMember(e){
    let ManagerContactArray = this.data.ManagerContactArray
    ManagerContactArray.push(1)
    this.setData({ ManagerContactArray})
    console.log(e)
  },
//添加联系人
  ProjectName(e){
    let array = []
    let Project = this.data.Project
    array.push(e.detail.value)
    array.push(Project.ProjectName)
    Project.ProjectName = array.join(",")
    this.setData({
      Project
    })
    console.log(Project)
  },
  //添加联系号码
  ProjectPhone(e){
    let array = []
    let Project = this.data.Project
    let phone = e.detail.value
    let result = {
      status: false,
      msg: '错误提示'
    };
    if (!_fgj.verify(phone, 'phone')) {
      $Message({ content: '填写正确号码', type: 'error' });
      return false;
    };
    array.push(e.detail.value)
    array.push(Project.ProjectPhone)
    Project.ProjectPhone = array.join(",")
    this.setData({
      Project
    })
    console.log(Project)

  },
//结算模式描述
  SettlementDescChange(e) {
    let params = this.data.params
    params.SettlementDesc = e.detail.value
    this.setData({
      params
    })
    console.log(params)
  },
  //项目说明
  RemarkChange(e) {
    let params = this.data.params
    params.Remark = e.detail.value
    this.setData({
      params
    })
    console.log(params)
  },
  //点击完成提交
  bindSubmit(e){
    let { Project,params} = this.data
    let ManagerContact = '联系人：' + Project.ProjectName + ';电话：' + Project.ProjectPhone
    params.ManagerContact = ManagerContact
    console.log(this.data.params)
    this.setData({
      params
    })
    
    let verify = this.verifyData(params);   // 验证数据
    if (verify.status) {
      this.setData({
        disabled: true,
        loading: true
      });

      if (!params.ProjectID) {
        params.ProjectID = guidstr;    // 临时项目ID
        this.InsertProject();      // 新建
      } else {
        this.UpProject();      // 编辑
      }
    } else {
      $Message({ content: verify.msg, type: 'error' });
    }

  },
  // 新建
  InsertProject() {
    let params = this.data.params;
    wx.showLoading({ title: '加载中' });

    InsertProject(params).then(res => {
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
  //修改数据
  UpProject(e){
    let params = this.data.params;

    wx.showLoading({ title: '加载中' });
    UpProject(params).then(res => {
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
//根据UpProject获取数据
  GetProject(e){
    let ProjectID = this.data.params.ProjectID;
    let { params, Estate}= this.data
    wx.showLoading({ title: '加载中' });
    GetProject({
      ProjectID
    }).then(res => {
      // console.log(res)
      if (res.data.result === 'success') {
        let temptable = res.data.temptable[0];
        let newObj = Object.assign({}, params, temptable);

        
        Estate.EstateName = newObj.ProjectName;    // 回填楼盘
        Estate.EstateID = newObj.EstateID;    

        this.setData({
          params: newObj,
          Estate,
        });
        wx.hideLoading();
      } else {
        wx.hideLoading();
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },


  // 验证数据
  verifyData(data) {
    console.log(data)
    let result = {
      status: false,
      msg: '错误提示'
    };
    if (!_fgj.verify(data.EstateID, 'require')) {
      result.msg = '请选择楼盘';
      return result;
    };
    if (!_fgj.verify(data.PropertyType, 'require')) {
      result.msg = '请选择项目种类';
      return result;
    };
    if (!_fgj.verify(data.DeclareType, 'require')) {
      result.msg = '请选择报备类型';
      return result;
    };
    if (!_fgj.verify(data.DeclareProtectDays, 'require')) {
      result.msg = '请选择报备有效期';
      return result;
    };
    
    if (!_fgj.verify(data.ProjectName, 'require')) {
      result.msg = '请填写项目名称';
      return result;
    };
    if (!_fgj.verify(data.NeedBringCust, 'require')) {
      result.msg = '请选择是否需要带访';
      return result;
    };
    if (!_fgj.verify(data.VisitProtectDays, 'require')) {
      result.msg = '请选择到访有效期';
      return result;
    };
   

    if (!_fgj.verify(data.CommissionMode, 'require')) {
      result.msg = '请选择佣金模式';
      return result;
    };
    if (!_fgj.verify(data.Commission, 'require')) {
      result.msg = '请填写佣金描述';
      return result;
    };
    if (!_fgj.verify(data.SettlementDesc, 'require')) {
      result.msg = '请填写结算模式说明';
      return result;
    };
    if (!_fgj.verify(data.Remark, 'require')) {
      result.msg = '请填写项目说明';
      return result;
    };
    if (!_fgj.verify(data.ManagerContact, 'require')) {
      result.msg = '请填写项目管理人员及联系方式';
      return result;
    };

    result.status = true;
    result.msg = '验证通过';

    return result;
  },
})