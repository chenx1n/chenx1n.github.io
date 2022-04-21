<template>
  <div id="app">
    <a-config-provider :locale="zhCN">
      <div>
        <h2 class="title">人均消费支出</h2>
        <div class="actions">
          <a-space>
            <a-button icon="plus" @click="showModal">新增项目</a-button>
            <a-button type="danger" @click="clearData">清空数据</a-button>
          </a-space>
        </div>
        <a-row class="table-container" :gutter="20" v-if="list.length">
          <a-col :span="8" v-for="item in list" :key="item.key">
            <c-table :data="item" @listChange="(list) => (item.list = list)" @numChange="(num) => (item.num = num)" @delProject="delProject"></c-table>
          </a-col>
        </a-row>
        <template v-if="list.length">
          <h2 class="title">可视化图表</h2>
          <c-charts :data="list"></c-charts>
        </template>
        <a-empty v-else />
        <add-modal ref="addModal" @add="add"></add-modal>
      </div>
    </a-config-provider>
  </div>
</template>

<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import CTable from './components/Table.vue';
import AddModal from './components/Modal.vue';
import CCharts from './components/CCharts.vue';

export default {
  name: 'App',
  components: {
    CTable,
    AddModal,
    CCharts,
  },
  data() {
    return {
      zhCN,
      list: [],
    };
  },
  created() {
    let data = localStorage.getItem('data');
    if (data) {
      this.list = JSON.parse(data);
    }
    if (!Array.isArray(this.list)) this.list = [];
    // 离开/刷新页面保存数据
    this.saveData();
  },
  methods: {
    delProject(key) {
      this.list = this.list.filter((d) => d.key != key);
    },
    add({ name }) {
      this.list.push({
        name,
        list: [],
        num: 1,
        key: Date.now(),
      });
    },
    showModal() {
      this.$refs.addModal.showModal();
    },
    saveData() {
      let _this = this;
      window.onbeforeunload = function () {
        let data = _this.list;
        localStorage.setItem('data', JSON.stringify(data));
      };
    },
    clearData() {
      this.list = [];
      localStorage.removeItem('data');
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
      let girlText = `女生总计 ${(girlMoney / this.numObj.girlNum + commonMoney / this.numObj.commonNum).toFixed(2)}`;
      let boyText = `男生总计 ${(boyMoney / this.numObj.girlNum + commonMoney / this.numObj.commonNum).toFixed(2)}`;
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
  color: #2c3e50;
  padding: 20px;
}
.title {
  text-align: center;
  margin-top: 0.5em;
}
.table-container {
  margin-top: 20px;
}
.actions {
  text-align: right;
}
</style>
