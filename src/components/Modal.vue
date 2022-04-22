<template>
  <div>
    <a-modal
      v-if="type == 'project'"
      title="新建项目"
      v-model="modalVisible"
      @ok="confirm"
    >
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="项目名称" prop="name">
          <a-input
            ref="input"
            v-model="form.name"
            placeholder="请输入项目名称"
          />
        </a-form-model-item>
        <a-form-model-item label="金额" prop="money">
          <a-input-number
            :min="0"
            :precision="0"
            v-model="form.money"
            placeholder="请输入金额"
          />
        </a-form-model-item>
        <a-form-model-item label="人员" prop="users">
          <a-checkbox-group v-model="form.users" :options="userOptions" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
      v-if="type == 'user'"
      title="新建人员"
      v-model="modalVisible"
      :footer="null"
      @cancel="cancel"
    >
      <div>
        <a-input ref="input" @pressEnter="addUser" v-model="userName"></a-input>
        <a-alert
          style="margin: 10px 0"
          message="输入完成按下回车，可连续添加"
          type="info"
        />
        <a-card size="small">
          <a-tag
            v-for="(item, i) in users"
            :key="i"
            :visible="!!item"
            closable
            @close="delUser(i)"
            >{{ item.name }}</a-tag
          >
        </a-card>
      </div>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'AddModal',
  props: {
    type: String,
    userList: Array,
    list: Array,
  },
  data() {
    return {
      modalVisible: false,
      form: {
        name: '',
        users: [],
        money: 0,
      },
      rules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在1-20内', trigger: 'blur' },
        ],
        users: [
          {
            type: 'array',
            required: true,
            message: '请选择人员',
            trigger: 'change',
          },
        ],
      },
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },

      users: [],
      userName: undefined,
    };
  },
  computed: {
    userOptions() {
      return this.users.map((d) => d.name);
    },
  },
  methods: {
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 判断名称是否重复
          let repeat = this.list.filter(
            (d) => d.name == this.form.name && d.key != this.form.key
          );
          if (repeat.length) return this.$message.error('项目名称重复!');
          this.$emit('confirm', JSON.parse(JSON.stringify(this.form)));
          this.resetForm();
          this.modalVisible = false;
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.form.name = undefined;
      this.form.money = 0;
      this.form.users = [];
      this.userName = undefined;
    },
    showModal(record) {
      this.modalVisible = true;
      this.resetForm();
      this.$nextTick(() => {
        this.$refs.input.focus();
        this.users = this.userList || [];
        if (this.type == 'user') return;
        this.$refs.form.resetFields();
        if (record && record.key) {
          // 有数据  证明是编辑
          this.form = {
            ...this.form,
            ...record,
          };
        }
      });
    },
    delUser(i) {
      this.users.splice(i, 1);
    },
    addUser() {
      this.users.push({
        name: this.userName.trim(),
        ket: Date.now(),
      });
      this.userName = undefined;
    },
    cancel() {
      this.$emit('updateUser', this.users);
    },
  },
};
</script>

<style lang="less" scoped></style>
