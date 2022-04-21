<template>
  <a-locale-provider :locale="zh_CN">
    <div id="app">
      <a-row :gutter="20">
        <a-col :span="8">
          <c-table
            name="女生"
            :list="girlList"
            :num="numObj.girlNum"
            @listChange="listChange($event, 'girl')"
            @numChange="numChange($event, 'girl')"
          ></c-table>
        </a-col>
        <a-col :span="8">
          <c-table
            name="男生"
            :list="boyList"
            :num="numObj.boyNum"
            @listChange="listChange($event, 'boy')"
            @numChange="numChange($event, 'boy')"
          ></c-table>
        </a-col>
        <a-col :span="8">
          <c-table
            name="公共"
            :list="commonList"
            :num="numObj.commonNum"
            @listChange="listChange($event, 'common')"
            @numChange="numChange($event, 'common')"
          ></c-table>
        </a-col>
      </a-row>
      <c-charts :girlList="girlList" :boyList="boyList" :commonList="commonList"></c-charts>
      <!-- <h3>{{ totalText() }}</h3> -->
    </div>
  </a-locale-provider>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import CTable from './components/Table.vue';
import CCharts from './components/CCharts.vue';

export default {
  name: 'App',
  components: {
    CTable,
    CCharts,
  },
  data() {
    // this.zh_CN = zh_CN;
    return {
      zh_CN,
      girlList: [],
      boyList: [],
      commonList: [],

      numObj: {
        girlNum: 3,
        boyNum: 3,
        commonNum: 6,
      },
    };
  },
  created() {
    let data = localStorage.getItem('data');
    if (data) {
      const { girlList, boyList, commonList } = JSON.parse(data);
      this.girlList = girlList;
      this.boyList = boyList;
      this.commonList = commonList;
    }
    // 离开/刷新页面保存数据
    this.saveData();
  },
  methods: {
    numChange(val, type) {
      if (isNaN(val)) return;
      this.numObj[`${type}Num`] = val;
    },
    listChange(data, type) {
      this[`${type}List`] = data;
    },
    saveData() {
      let _this = this;
      window.onbeforeunload = function () {
        const { girlList, boyList, commonList } = _this;
        let data = {
          girlList,
          boyList,
          commonList,
        };
        localStorage.setItem('data', JSON.stringify(data));
      };
    },
    totalText() {
      let girlMoney = this.girlList.reduce((acc, cur) => {
        return acc + cur.money;
      }, 0);
      let boyMoney = this.boyList.reduce((acc, cur) => {
        return acc + cur.money;
      }, 0);
      let commonMoney = this.commonList.reduce((acc, cur) => {
        return acc + cur.money;
      }, 0);
      let girlText = `女生总计 ${(
        girlMoney / this.numObj.girlNum +
        commonMoney / this.numObj.commonNum
      ).toFixed(2)}`;
      let boyText = `男生总计 ${(
        boyMoney / this.numObj.girlNum +
        commonMoney / this.numObj.commonNum
      ).toFixed(2)}`;
      return `${girlText}, ${boyText}`;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
