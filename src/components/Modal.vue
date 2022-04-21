<template>
  <div>
    <a-modal title="新建项目" v-model="modalVisible" @ok="confirm">
      <a-form-model ref="form" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="项目名称" prop="projectName">
          <a-input v-model="form.projectName" placeholder="请输入项目名称" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'AddModal',
  data() {
    return {
      modalVisible: false,
      form: {
        projectName: '',
      },
      rules: {
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在1-20内', trigger: 'blur' },
        ],
      },
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
    };
  },
  methods: {
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('add', { name: this.form.projectName });
          // this.list.push({
          //   name: this.form.projectName,
          //   num: undefined,
          //   list: [],
          // });
          this.resetForm();
          this.modalVisible = false;
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.form.projectName = undefined;
    },
    showModal() {
      this.modalVisible = true;
    },
  },
};
</script>

<style lang="less" scoped></style>
