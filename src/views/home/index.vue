<template>
  <div class="container">
    <h2 class="title">
      人均消费支出
      <a-tooltip>
        <template slot="title">
          <ol style="margin-bottom: 0">
            <li>数据仅本地存储</li>
            <li>更换电脑、浏览器之后，不会显示之前的数据</li>
            <li>练习产品，仅供娱乐</li>
          </ol>
        </template>
        <a-icon style="margin-left: 6px" type="question-circle" />
      </a-tooltip>
    </h2>
    <div class="actions">
      <a-space>
        <a-button icon="plus" @click="showModal('user')">新增人员</a-button>
        <a-button icon="plus" @click="showModal('project')">新增项目</a-button>
        <a-popconfirm title="确认清空数据?" @confirm="clearData">
          <a-button type="danger">清空数据</a-button>
        </a-popconfirm>
      </a-space>
    </div>
    <c-table
      :data="list"
      :users="users"
      @listChange="listChange"
      @delProject="delProject"
    ></c-table>

    <template v-if="list.length">
      <c-charts :data="list"></c-charts>
    </template>
    <add-modal
      :type="modalType"
      :userList="users"
      :list="list"
      ref="addModal"
      @confirm="add"
      @updateUser="updateUser"
    ></add-modal>
  </div>
</template>
<script>
import CTable from '../../components/Table.vue';
import AddModal from '../../components/Modal.vue';
import CCharts from '../../components/CCharts.vue';

export default {
  name: 'App',
  components: {
    CTable,
    AddModal,
    CCharts,
  },
  data() {
    return {
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
    listChange(list) {
      this.list = list;
    },
    delProject(key) {
      this.list = this.list.filter((d) => d.key != key);
    },
    add({ name, users, money }) {
      this.list.push({
        name,
        // list: [],
        money,
        users,
        key: Date.now(),
      });
    },
    updateUser(users) {
      this.users = users;
    },
    showModal(type) {
      // 如果 type 为 project 并且没有人员信息 则给出提示
      if (type == 'project' && !this.users.length)
        return this.$message.warning('请新增人员!');
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

<style scoped>
.container {
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
.has-error {
  color: #f5222d;
}
.has-error:hover {
  color: #f5222d;
}
</style>
