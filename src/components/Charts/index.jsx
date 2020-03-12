import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts';
import _ from 'lodash';
import moment from 'moment';
import { chartColors } from '../../utils/enum';

const ChartRef0 = React.createRef();
const ChartRef1 = React.createRef();

class indexPage extends Component {
  constructor() {
    super();
    this.state = {
    };
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
  }


  componentWillUnmount() {
    const self = this;
    self.mounted = false;
    // if (self.timer.handler) {
    //   clearInterval(self.timer.handler);
    //   self.timer.handler = null;
    // }
  }

  getChartConfig = (sData = [], name, textY, textX) => {
    // console.log('sData======', sData);

    const names = _.map(sData, (item, key) => (key));
    // console.log('name', names)

    const prepareData = (data = []) => {
      const obj = {
        list: _.map(data, item => item[1]),
      };
      // console.log(obj);
      obj.min = _.min(obj.list);
      obj.max = _.max(obj.list);
      return obj;
    };
    // const yAxisData = () => {
    //   // console.log('this.state.buyCloseSpread', _.map(this.state.buyCloseSpread, item => item[1]));
    //   const data = [
    //     ..._.map(sData[`BINANCE_${name}`], item => item[1]),
    //     ..._.map(sData[`composite_${name}`], item => item[1]),
    //     ..._.map(sData[`HUOBI_${name}`], item => item[1]),
    //     ..._.map(sData[`OKEX_${name}`], item => item[1]),
    //   ];
    //   const obj = {
    //     data,
    //   };
    //   // console.log('data======', data);
    //   obj.min = _.min(obj.data);
    //   obj.max = _.max(obj.data);
    //   // console.log(obj);
    //   return obj;
    // };

    const categories = _.map(sData[names[0]], item => (item[0] - 0));
    // console.log('categories', categories);

    const data = {};
    _.map(names, (item) => {
      data[item] = prepareData(sData[item])
    })
    // console.log(data)
  
    const series = _.map(sData, (item, key) => (
       {
        name: key,
        type: 'spline',
        // yAxis: 7,
        visible: data[`${key}`].list[0] !== null,
        data: data[`${key}`].list,
      }
    ))

    const config = {
      credits: {
        enabled: false,
      },
      chart: {
        type: 'line',
        zoomType: 'x'
      },
      colors: chartColors,
      plotOptions: {
        series: {
          animation: false,
          marker: {
            enabled: false,
          },
          // states: {
          //   hover: {
          //     enabled: false,
          //   },
          // },
        },
      },
      title: {
        text: '',
        align: 'left',
      },
      rangeSelector: {
        enabled: false,
      },
      navigator: {
        enabled: false,
      },
      scrollbar: {
        enabled: false,
      },
      legend: {
        enabled: true,
      },
      tooltip: {
        shared: true,
        xDateFormat: '%Y-%m-%d %H:%M:%S',
      },
      xAxis: [{
        title: {
          text: textX,
        },
        categories: categories,
        type: 'datetime',
        crosshair: true,
        labels: {
          formatter() {
            return moment(this.value - 0).format('MM-DD HH:mm:ss'); // eslint-disable-line
          },
        },
      }],
      yAxis: {
        title: {
          text: textY,
        },
        // startOnTick: true,
        // endOnTick: true,
        // min: yAxisData().min,
        // max: yAxisData().max,
        minPadding: 0,
        maxPadding: 0,
        showEmpty: false,
      },
      series,
    };
    return config;
  }

  render() {
    return (
      <React.Fragment>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          {
              !_.isEmpty(this.props.askData) ? (
                <div style={{ borderBottom: '1px solid black' }}>
                <ReactHighcharts config={this.getChartConfig(this.props.askData, 'ask', this.props.textY, this.props.textX)} ref={ChartRef1} />
                </div>
              ) : ''
            }
            {
              !_.isEmpty(this.props.bidData) ? (
                  <div style={{  marginTop: '40px', borderBottom: '1px solid black' }}>
                  <ReactHighcharts config={this.getChartConfig(this.props.bidData, 'bid', this.props.textY, this.props.textX)} ref={ChartRef0} />
                  </div>
              ) : ''
            }
           
          </div>
      </React.Fragment>

    )
  }
}

export default indexPage;

indexPage.defaultProps = {
  textY: '与comp 的价格差',
  textX: '',
}