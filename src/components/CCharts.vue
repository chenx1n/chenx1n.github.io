<template>
  <div id="main"></div>
</template>

<script>
import * as echarts from 'echarts/core';
import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

export default {
  props: {
    data: Array,
  },
  name: 'CCharts',
  data() {
    return {
      seriesList: [],
      myChart: undefined,
      yAxis: [],
    };
  },
  watch: {
    data: {
      handler() {
        this.refreshData();
      },
      deep: true,
    },
    // girlList() {
    //   this.refreshData();
    // },
    // boyList() {
    //   this.refreshData();
    // },
    // commonList() {
    //   this.refreshData();
    // },
  },
  mounted() {
    echarts.use([TooltipComponent, GridComponent, LegendComponent, BarChart, CanvasRenderer]);
    var chartDom = document.getElementById('main');
    this.myChart = echarts.init(chartDom);
    this.handleData();
    this.refreshData();
  },
  methods: {
    handleData() {
      let allList = [...this.data];
      // 获取y轴 名称
      let yNames = allList.map((d) => d.name);
      let nameList = Array.from(new Set(yNames));
      this.yAxis = nameList;

      // 获取所有支出名称
      let names = [];
      allList.forEach((d) => {
        let arr = d.list.map((l) => l.name);
        names.push(...arr);
      });
      let allNames = Array.from(new Set(names));
      // 设置图表数据
      this.seriesList = [];
      allNames.forEach((d) => {
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
        this.data.forEach((l) => {
          let data = l.list.find((item) => item.name == d);
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
          data: this.yAxis,
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
