import Vue from 'vue';
import App from './App.vue';
import router from './router';
import {
  Space,
  Button,
  Table,
  Col,
  Row,
  ConfigProvider,
  InputNumber,
  Input,
  Modal,
  FormModel,
  Alert,
  Tag,
  Card,
  message,
  Checkbox,
  Divider,
  Popconfirm,
  Icon,
  Tooltip,
} from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.use(Space);
Vue.use(FormModel);
Vue.use(Button);
Vue.use(Table);
Vue.use(Row);
Vue.use(Col);
Vue.use(ConfigProvider);
Vue.use(InputNumber);
Vue.use(Input);
Vue.use(Modal);
Vue.use(Alert);
Vue.use(Tag);
Vue.use(Card);
Vue.use(Checkbox);
Vue.use(Divider);
Vue.use(Popconfirm);
Vue.use(Icon);
Vue.use(Tooltip);

Vue.prototype.$message = message;
Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
