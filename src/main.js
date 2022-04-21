import Vue from 'vue';
import App from './App.vue';
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
  Empty,
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
Vue.use(Empty);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
