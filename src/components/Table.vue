<template>
  <div>
    <!-- <h3 class="title">
      <div class="table-name">{{ data.name }}</div>
      <div>
        <a-button title="添加" style="margin-left: 10px" @click="showModal" shape="circle" icon="plus" />
        <a-button title="删除" style="margin-left: 10px" type="danger" @click="delProject" shape="circle" icon="delete" />
      </div>
    </h3>
    <div style="text-align: right">人员：{{ data.users.join() }} &nbsp;&nbsp; 人数：{{ data.users.length }}</div> -->
    <a-table
      style="margin: 20px 0"
      bordered
      :pagination="false"
      :columns="columns"
      :dataSource="dataSource"
      rowKey="key"
    >
      <template slot="users" slot-scope="text, record">
        {{ record.users.join() }}
      </template>
      <template slot="operation" slot-scope="text, record">
        <a @click="showEditModal(record)">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm title="确认删除?" @confirm="del(record)">
          <a class="has-error">删除</a>
        </a-popconfirm>
      </template>
      <!-- <template slot="footer" slot-scope="currentPageData">
        {{ footerText(currentPageData) }}
      </template> -->
    </a-table>
    <a-modal title="新建项目" v-model="visible" @ok="add">
      <p class="form-item">
        <a-row :gutter="20">
          <a-col :span="6" class="form-label">支出名称：</a-col>
          <a-col :span="18">
            <a-input ref="input" v-model="form.name" />
          </a-col>
        </a-row>
      </p>
      <p class="form-item">
        <a-row :gutter="20">
          <a-col :span="6" class="form-label">金额：</a-col>
          <a-col :span="18"
            ><a-input-number :min="0" :precision="0" v-model="form.money"
          /></a-col>
        </a-row>
      </p>
    </a-modal>
    <add-modal
      type="project"
      :userList="users"
      :list="data"
      ref="addModal"
      @confirm="edit"
    ></add-modal>
  </div>
</template>

<script>
import AddModal from './Modal.vue';
const columns = [
  {
    title: '支出名称',
    dataIndex: 'name',
  },
  {
    title: '人员',
    dataIndex: 'users',
    scopedSlots: { customRender: 'users' },
  },
  {
    title: '金额',
    dataIndex: 'money',
  },
  {
    title: '平均',
    dataIndex: 'average',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  },
];
export default {
  name: 'CTable',
  props: {
    data: Array,
    users: Array,
  },
  components: { AddModal },
  computed: {
    dataSource() {
      return this.data.map((d) => {
        return {
          name: d.name,
          money: d.money,
          average: (d.money / d.users.length).toFixed(2),
          users: d.users,
          key: d.key,
        };
      });
    },
  },
  data() {
    this.columns = columns;
    return {
      visible: false,
      form: {
        name: undefined,
        users: [],
        money: 0,
      },

      editData: {},
    };
  },
  methods: {
    numChange(val) {
      this.$emit('numChange', val);
    },
    showEditModal(record) {
      this.$refs.addModal.showModal(record);
    },
    edit(record) {
      let list = JSON.parse(JSON.stringify(this.data));
      let index = list.findIndex((d) => d.key == record.key);
      list[index] = record;
      this.$emit('listChange', list);
    },
    showModal() {
      this.visible = true;
      this.form = { name: undefined, money: 0 };
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    add() {
      let list = JSON.parse(JSON.stringify(this.data));
      list.push(this.form);
      this.$emit('listChange', list);
      this.visible = false;
    },
    del(record) {
      let list = JSON.parse(JSON.stringify(this.data));
      list = list.filter((d) => d.name != record.name);
      this.$emit('listChange', list);
    },
    delProject() {
      this.$emit('delProject', this.data.key);
    },
    footerText(currentPageData) {
      let total = currentPageData.reduce((acc, cur) => {
        return acc + cur.money;
      }, 0);
      return `总计 ${total}，平均${(total / this.data.users.length).toFixed(
        2
      )}/人`;
    },
  },
};
</script>

<style lang="less" scoped>
.title {
  display: flex;
  padding: 0 0 0 20px;
  place-items: center;
  justify-content: space-between;
}
.table-name {
  position: relative;
  font-size: 22px;
  padding-left: 18px;
  &:before {
    display: block;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    content: '';
    width: 4px;
    height: 20px;
    background: rgba(10, 147, 252, 1);
  }
}
.form-item {
  margin-bottom: 20px;
}
.form-label {
  line-height: 32px;
  text-align: right;
}
</style>
