import * as echarts from '../../../components/ec-canvas/echarts.js';

let hchart = null;
let vchart = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    monthIndex: 1,
    detail1: true,
    detail2: true,
    detail3: true,
    detail4: true,
    detail5: true,
    detail6: true,
    ecHBar: {
      onInit: function (canvas, width, height) {
        hchart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(hchart);
        const xData = [70, 40, 60, 80];
        var option = {
          color: ['#ffdd5e'],
          grid: {
            left: 0,
            right: 50,
            bottom: 0,
            top: 0,
            containLabel: true
          },
          xAxis: [
            { show: false },
            { show: false }
          ],
          yAxis: [
            {
              type: 'category',
              axisTick: { show: false },
              data: ['人事', '行政', '技术', '业务'],
              axisLine: { show: false },
              axisLabel: {
                color: '#0e0e0e'
              }
            }
          ],
          series: [
            // 背景色
            {
              show: true,
              type: 'bar',
              barWidth: 7,
              itemStyle: {
                normal: {
                  barBorderRadius: 3,
                  color: '#e5e5e5'
                }
              },
              label: {
                normal: {
                  show: true,
                  textStyle: {
                    color: '#000', //百分比颜色
                  },
                  position: 'right',
                  //百分比格式
                  formatter: function (data) {
                    return (xData[data.dataIndex]) + '/100';
                  },
                }
              },
              z: 1,
              data: [100, 100, 100, 100]
            },
            // 黄条
            {
              show: true,
              type: 'bar',
              barWidth: 7,
              barGap: '-100%',
              itemStyle: {
                normal: {
                  barBorderRadius: 3
                }
              },
              max: 100,

              labelLine: {
                show: false,
              },
              z: 2,
              data: [70, 40, 60, 80],
            }
          ]
        };

        hchart.setOption(option);
        return hchart;
      }
    },
    ecPie: {
      onInit: function (canvas, width, height) {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(chart);
        var option = {
          grid: {
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            containLabel: true
          },
          title: {
            text: '80',
            x: 'center',
            y: 'center',
            textStyle: {
              fontWeight: 'normal',
              color: '#fff',
              fontSize: '20'
            }
          },
          color: ['rgba(255, 255, 255, 1)'],

          series: [{
            name: 'Line 1',
            type: 'pie',
            clockWise: true,
            radius: ['70%', '100%'],
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },

            hoverAnimation: false,
            data: [{
              value: 80,
              name: '01',
              itemStyle: {
                normal: {
                  color: 'rgba(255,255,255,.3)', // 完成的圆环的颜色
                  labelLine: {
                    show: false
                  }
                }
              }
            },
            {
              name: '02',
              value: 20
            }],
          }]
        }
        chart.setOption(option);
        return chart;
       
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.echartsComponnet = this.selectComponent('#mychart-dom-vbar');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // setTimeout(function () {
    //   // 获取 chart 实例的方式
    //   console.log(chart)
    // }, 2000);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  // tab切换
  bindTabSwitch(e) {
    console.log(e.target)
    let { index } = e.target.dataset;
    this.setData({
      tabIndex: index
    })
    if(e.target.dataset.index == 1) {
      this.echartsComponnet.init((canvas, width, height) => {
        vchart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(vchart);
        const xData = ['人事', '培训', '渠道', '技术', '市场', '行政', '客服', '网销'];
        const yData = [10, 5, 6, 3, 6, 14, 3, 8]
        var option = {
          grid: {
            left: -12,
            right: 12,
            bottom: 10,
            top: 5,
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: xData,
              axisTick: { show: false },
              axisLine: { show: false }
            },
            { show: false }
          ],
          yAxis: [
            { show: false },
            { show: false }
          ],
          series: [
            {
              type: 'bar',
              barWidth: 15,
              label: {
                normal: {
                  show: true,
                  position: "top",
                  textStyle: {
                    color: '#313131',
                    fontSize: 9
                  },
                  formatter: function (data) {
                    return (yData[data.dataIndex]) + '人';
                  }
                }
              },
              itemStyle: {
                normal: {
                  barBorderRadius: 15,
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1, [{
                      offset: 0,
                      color: 'rgb(250,119,48)'
                    },
                    {
                      offset: 0.5,
                      color: 'rgb(253,154,76)'
                    },
                    {
                      offset: 1,
                      color: 'rgb(255,189,103)'
                    }
                    ]
                  )
                }
              },
              data: yData,
            }
          ]
        };
        vchart.setOption(option);

        console.log('111')
        return vchart;
      })
    }
  },

  // month切换
  bindMonthSwitch(e) {
    // console.log(e.target)
    let { index } = e.target.dataset;
    this.setData({
      monthIndex: index
    })
  },

  // 折叠面板
  changeShow (e) {
    console.log(e.currentTarget.dataset.param)
    let param = e.currentTarget.dataset.param
    switch (param) {
      case '1':
        this.setData({
          detail1: !this.data.detail1
        });
        break;
      case '2':
        this.setData({
          detail2: !this.data.detail2
        });
        break;
      case '3':
        this.setData({
          detail3: !this.data.detail3
        });
        break;
      case '4':
        this.setData({
          detail4: !this.data.detail4
        });
        break;
      case '5':
        this.setData({
          detail5: !this.data.detail5
        });
        break;
      case '6':
        this.setData({
          detail6: !this.data.detail6
        });
        break;
    }
    // this.setData({
    //   detail1: param == 1 ? !this.data.detail1 : true,
    //   detail2: param == 2 ? !this.data.detail2 : true,
    // })
  },
})