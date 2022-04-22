<template>
  <div id="app">
    <a-config-provider :locale="zhCN">
      <div>
        <h2 class="title">人均消费支出</h2>
        <div class="actions">
          <a-space>
            <a-button icon="plus" @click="showModal('user')">新增人员</a-button>
            <a-button icon="plus" @click="showModal('project')">新增项目</a-button>
            <a-button type="danger" @click="clearData">清空数据</a-button>
          </a-space>
        </div>
        <a-row type="flex" justify="left" align="top" class="table-container" :gutter="20" v-if="list.length">
          <a-col :span="8" v-for="item in list" :key="item.key">
            <c-table :data="item" @listChange="(list) => (item.list = list)" @numChange="(num) => (item.num = num)" @delProject="delProject"></c-table>
          </a-col>
        </a-row>
        <template v-if="list.length">
          <h2 class="title">可视化图表</h2>
          <c-charts :data="list"></c-charts>
        </template>
        <a-empty style="margin-top: 20px" v-else />
        <add-modal :type="modalType" :userList="users" ref="addModal" @add="add" @updateUser="updateUser"></add-modal>
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
      users: [],
      modalType: 'user',
    };
  },
  created() {
    let data = localStorage.getItem('data');
    if (data) {
      this.list = JSON.parse(data).list;
      this.users = JSON.parse(data).users;
    }
    // 数据错乱 或 没有数据  重置
    if (!Array.isArray(this.list) || !Array.isArray(this.users)) {
      this.clearData(false);
    }
    // 离开/刷新页面保存数据
    this.saveData();
  },
  methods: {
    delProject(key) {
      this.list = this.list.filter((d) => d.key != key);
    },
    add({ name, users }) {
      this.list.push({
        name,
        list: [],
        users,
        key: Date.now(),
      });
    },
    updateUser(users) {
      this.users = users;
    },
    showModal(type) {
      // 如果 type 为 project 并且没有人员信息 则给出提示
      if (type == 'project' && !this.users.length) return this.$message.warning('请新增人员!');
      this.modalType = type;
      this.$refs.addModal.showModal();
    },
    saveData() {
      let _this = this;
      window.onbeforeunload = function () {
        let data = {
          list: _this.list,
          users: _this.users,
        };

        localStorage.setItem('data', JSON.stringify(data));
      };
    },
    clearData(isTips = true) {
      isTips && this.$message.success('清空数据成功!');
      this.list = [];
      this.users = [];
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
