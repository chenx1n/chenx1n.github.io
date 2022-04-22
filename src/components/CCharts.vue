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
      // 获取y轴 名称 || 获取所有支出名称
      let yNames = [];
      let names = [];
      allList.forEach((d) => {
        yNames.push(...d.users.map((u) => u));
        let arr = d.list.map((l) => l.name);
        names.push(...arr);
      });
      let nameList = Array.from(new Set(yNames));
      this.yAxis = nameList;
      let allNames = Array.from(new Set(names));

      // 设置图表数据
      this.seriesList = [];

      // 循环所有子项目
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
        // 循环所有人员 给每个字项目添加所有人员的支出
        this.yAxis.forEach((u) => {
          // 获取当前项目的数据
          let currData = this.data.find((item) => {
            return item.list.find((l) => l.name == d);
          });
          // 判断当前人员在不在项目里面
          let hasUser = currData.users.find((d) => d == u);
          // 在 添加平均数据
          if (hasUser) {
            let currList = currData.list.find((l) => l.name == d);
            option.data.push((currList.money / currData.users.length).toFixed(2));
          } else option.data.push('');
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
