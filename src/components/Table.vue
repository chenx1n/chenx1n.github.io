<template>
  <div>
    <h3 class="title">
      <div class="table-name">{{ name }}</div>
      <div>
        <!-- <a-button  shape="circle" icon="search" /> -->
        人数：
        <a-input-number
          :min="1"
          :max="10"
          :precision="0"
          :value="num"
          @change="numChange"
        />
        <a-button
          style="margin-left: 10px"
          @click="showModal"
          shape="circle"
          icon="plus"
        />
      </div>
    </h3>
    <a-table
      bordered
      size="small"
      :pagination="false"
      :columns="columns"
      :dataSource="dataSource"
      rowKey="name"
    >
      <template slot="operation" slot-scope="text, record">
        <a @click="del(record)">删除</a>
      </template>
      <!-- <template slot="footer" slot-scope="currentPageData">
        {{ footerText(currentPageData) }}
      </template> -->
    </a-table>
    <a-modal title="新建项目" v-model="visible" @ok="add">
      <p class="form-item">
        <a-row :gutter="20">
          <a-col :span="6" class="form-label">项目名称：</a-col>
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
  </div>
</template>

<script>
const columns = [
  {
    title: '项目名称',
    dataIndex: 'name',
  },
  // {
  //   title: '时间',
  //   dataIndex: 'time',
  // },
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
    list: {
      type: Array,
      default: function () {
        return [];
      },
    },
    num: {
      type: [Number, String],
      default: 0,
    },
    name: {
      type: String,
    },
  },
  computed: {
    dataSource() {
      return this.list.map((d) => {
        return {
          name: d.name,
          money: d.money,
          average: (d.money / this.num).toFixed(2),
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
        money: 0,
      },
    };
  },
  methods: {
    numChange(val) {
      this.$emit('numChange', val);
    },
    showModal() {
      this.visible = true;
      this.form = { name: undefined, money: 0 };
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    add() {
      let list = JSON.parse(JSON.stringify(this.list));
      list.push(this.form);
      this.$emit('listChange', list);
      this.visible = false;
    },
    del(record) {
      let list = JSON.parse(JSON.stringify(this.list));
      list = list.filter((d) => d.name != record.name);
      this.$emit('listChange', list);
    },
    footerText(currentPageData) {
      let total = currentPageData.reduce((acc, cur) => {
        return acc + cur.money;
      }, 0);
      return `总计 ${total}，平均${(total / this.num).toFixed(2)}`;
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
