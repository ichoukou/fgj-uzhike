

Page({
  data: {
    sideNav: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
    map: [
      // {
      //   title: 'A',
      //   items: [
      //     { name: '内容A' }
      //   ]
      // }
    ],
    // currentIndex: 'A',
    // scrollTop: 0,
    currentNodes: {
      title: 'A',
      scrollTop: 0,
      prevTitle: 'A',        // 记录上一个的位置
      prevScrollTop: 0,     // 记录上一个的滚动位置
    }
  },
  onLoad: function (options) {
    this.filterMap();   // 处理数据
  },
  onReady: function () {
  
  },
  onShow: function () {

  },
  // 手指按下
  handlerStart(e) {
    console.log(e)
    let { title } = e.target.dataset;
    let currentNodes = this.data.currentNodes;

    currentNodes.title = title

    this.setData({
      currentNodes
    })

    this.queryMultipleNodes('the-list-' + title);
  },
  // 手指滑动
  handlerMove(e) {
    let { title } = e.target.dataset;
    let currentNodes = this.data.currentNodes;

    currentNodes.title = title

    this.setData({
      currentNodes
    })

    this.queryMultipleNodes('the-list-' + title);
  },
  // 手指抬起
  handlerEnd(e) {

  },
  // 点击侧边导航
  bindNavTap(e) {
    let { title } = e.currentTarget.dataset;
    let currentNodes = this.data.currentNodes;

    currentNodes.title = title

    this.setData({
      currentNodes
    })

    this.queryMultipleNodes('the-list-' + title);
  },
  // 获取元素位置
  queryMultipleNodes: function (id) {
    let query = wx.createSelectorQuery();
    let currentNodes = this.data.currentNodes;
    let _this = this;

    query.select('#' + id).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      console.log(res[0].top - 50)

      // currentNodes.scrollTop = res[0].top - 50

      // currentNodes.prevScrollTop = currentNodes.scrollTop;

      // _this.setData({
      //   currentNodes
      // });

      _this.currentScrollTop(res[0].top);   // 计算滚动
    })
  },
  // 监听滚动
  bindScrollChange(e) {
    let currentNodes = this.data.currentNodes;
    currentNodes.prevScrollTop = e.detail.scrollTop;
  },
  // 计算滚动
  currentScrollTop(top) {
    let currentNodes = this.data.currentNodes;

    // 判断是往上还是往下
    if (currentNodes.title >= currentNodes.prevTitle) {
      currentNodes.scrollTop = top + currentNodes.prevScrollTop
    } 
    else {
      currentNodes.scrollTop = currentNodes.prevScrollTop - Math.abs(top)
    }
    
    console.log(currentNodes)

    // 记录上一个位置
    currentNodes.prevTitle = currentNodes.title;            
    currentNodes.prevScrollTop = currentNodes.scrollTop;
    
    this.setData({
      currentNodes
    });
  },
  // 处理数据
  filterMap() {
    let map = this.data.map;
    let sideNav = this.data.sideNav;
    let obj = {};

    // 模拟数据
    for (let i = 0; i < sideNav.length; i++) {
      obj = {
        title: sideNav[i],
        items: []
      }
      let random = Math.ceil( (Math.random() * 10) + 3 );
      for (let j = 0; j < random; j ++) {
        obj.items.push({
          name: '内容' + sideNav[i]
        })
      };
      map.push(obj)
    };
    console.log(map)

    this.setData({
      map
    })
  }
})