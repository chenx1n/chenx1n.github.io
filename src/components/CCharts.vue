<template>
  <div id="main"></div>
</template>

<script>
import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

export default {
  props: {
    girlList: {
      type: Array,
    },
    boyList: {
      type: Array,
    },
    commonList: {
      type: Array,
    },
  },
  name: 'CCharts',
  data() {
    return {
      seriesList: [],
      myChart: undefined,
    };
  },
  watch: {
    girlList() {
      this.refreshData();
    },
    boyList() {
      this.refreshData();
    },
    commonList() {
      this.refreshData();
    },
  },
  mounted() {
    echarts.use([
      TooltipComponent,
      GridComponent,
      LegendComponent,
      BarChart,
      CanvasRenderer,
    ]);
    var chartDom = document.getElementById('main');
    this.myChart = echarts.init(chartDom);
    this.handleData();
    this.refreshData();
  },
  methods: {
    handleData() {
      // 获取所有项目名称并去重
      let allList = [...this.girlList, ...this.boyList, ...this.commonList];
      let allNameList = allList.map((d) => d.name);
      let nameList = Array.from(new Set(allNameList));
      // 设置图表数据
      this.seriesList = [];
      nameList.forEach((d) => {
        let option = {
          name: d,
          type: 'bar',
          stack: 'total',
          label: {
            show: true,
          },
          emphasis: {
            focus: 'series',
          },
          data: [],
        };
        ['girlList', 'boyList', 'commonList'].forEach((l) => {
          let data = this[l].find((item) => item.name == d);
          data ? option.data.push(data.money) : option.data.push('');
        });
        this.seriesList.push(option);
      });
    },
    // 更新数据
    refreshData() {
      this.handleData();
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
          },
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
          data: ['女生', '男生', '公共'],
        },
        series: this.seriesList,
      };
      this.myChart.clear();
      this.myChart.setOption(option);
    },
  },
};
</script>

<style lang="less" scoped>
#main {
  width: 100%;
  height: 400px;
}
</style>
