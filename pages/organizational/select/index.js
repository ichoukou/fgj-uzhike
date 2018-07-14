const { $Message } = require('../../../components/base/index');
import { GetAllPosition } from '../../../api/position/position';
import { GetAllUserGroup } from '../../../api/userGroup/userGroup';

Page({
  data: {
    map: [
      // {
      //   title: 'A',
      //   items: [
      //     { name: '内容A' }
      //   ]
      // }
    ],
    currentType: '',
    params: {},     // 筛选条件
    onceTime: null,
    currentNodes: {
      title: 'A',
      scrollTop: 0,
      isNavShowN: false,
    },
    loading: false,
  },
  onLoad: function (options) {
    console.log('select', options);
    let { type } = options;
    this.data.currentType = type;

    // 判断类型，决定加载什么数据
    this.judgeType(type);
  },
  onReady: function () {
  
  },
  onShow: function () {

  },
  // 判断类型，决定加载什么数据
  judgeType(type) {
    if (type === 'position') {
      this.GetAllPosition();   // 获取职务数据
    }
    else if (type === 'group') {
      this.GetAllUserGroup();
    }
  },
  // 获取职务数据
  GetAllPosition() {
    this.setData({
      map: [],
      loading: false
    });
    GetAllPosition(this.data.params).then(res => {
      if (res.data.result === 'success') {
        this.filterMap(res.data.temptable);
      };
      this.setData({
        loading: true,
      });
    })
  },
  // 获取用户组数据
  GetAllUserGroup() {
    this.setData({
      map: [],
      loading: false
    });
    GetAllUserGroup(this.data.params).then(res => {
      if (res.data.result === 'success') {
        this.filterMap(res.data.temptable);
      };
      this.setData({
        loading: true,
      });
    })
  },
  // 选中
  bindClick(e) {
    console.log(e.target)
    let { name, id } = e.target.dataset;
    if (id) {
      // 把选中的值存储起来，这里用的是同步，避免没有存储进去
      try {
        wx.setStorageSync('organSelect', {
          name,
          id,
          type: this.data.currentType
        });
      } catch (e) {
        console.log(e)
      };
      wx.navigateBack()
    }
  },
  // 搜索
  bindQuery(e) {
    console.log(e.detail.value)
    // let likestr = e.detail.value;
    this.data.params.likestr = e.detail.value;
    let currentType = this.data.currentType;

    this.data.onceTime && (clearTimeout(this.data.onceTime));
    this.data.onceTime = setTimeout(() => {
      if (currentType === 'position') {
        this.GetAllPosition();   // 获取职务数据
      }
      else if (currentType === 'group') {
        this.GetAllUserGroup();   // 获取用户组数据
      }
    }, 200)
  },
  // 点击侧边导航
  bindNavTap(e) {
    let { title } = e.target.dataset;
    let map = this.data.map;
    let currentNodes = this.data.currentNodes;

    for (let i = 0, length = map.length; i < length; i++) {
      if (map[i].title === title) {
        currentNodes.scrollTop = map[i].scrollTop;
        currentNodes.title = title;
        currentNodes.isNavShowN = true;
        break;
      }
    };

    this.setData({
      currentNodes
    });

    // 一段时间之后隐藏选中的提示
    this.data.onceTime && (clearTimeout(this.data.onceTime))
    this.data.onceTime = setTimeout(() => {
      currentNodes.isNavShowN = false;
      this.setData({
        currentNodes
      })
    }, 1000);
  },
  // 处理数据
  filterMap(data) {
    let map     = this.data.map,
        obj     = {},
        element = '',
        type    = this.data.currentType,
        title   = '';

    for (let i = 0, length = data.length; i < length; i++) {
      title = data[i].PY.substring(0, 1).toLocaleUpperCase();      // 截取首字母并转大写

      // 在数据里面多添加这两条字段，当做公用字段
      if (type === 'position') {
        data[i].name = data[i].PositionName;
        data[i].id = data[i].PositionID;
      }
      else if (type === 'group') {
        data[i].name = data[i].GroupName;
        data[i].id = data[i].UserGroupID;
      }
      
      if (!obj[title]) {
        obj[title] = {
          title: title,
          items: [
            data[i]
          ]
        }
      } else {
        obj[title].items.push(data[i])
      }
    };

    // 变成有序列表
    for (let key in obj) {
      map.push(obj[key])
    };
    console.log(map)
    this.setData({
      map
    });
    
    // 获取每个元素的滚动位置
    setTimeout(() => {
      this.data.map.forEach(item => {
        element = 'the-list-' + item.title;
        this.itemScrollTop(element, function (data) {
          item.scrollTop = data
        });
      })
    }, 300)
  },
  // 获取每个元素的滚动位置
  itemScrollTop(id, callback) {
    let query = wx.createSelectorQuery();

    query.select('#' + id).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      // console.log(res[0].top - 50);
      typeof callback === 'function' && callback(res[0].top - 50);
    })
  }
})