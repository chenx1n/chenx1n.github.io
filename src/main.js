import Vue from 'vue';
import App from './App.vue';
import {
  Button,
  Table,
  Col,
  Row,
  LocaleProvider,
  InputNumber,
  Input,
  Modal,
} from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.use(Button);
Vue.use(Table);
Vue.use(Row);
Vue.use(Col);
Vue.use(LocaleProvider);
Vue.use(InputNumber);
Vue.use(Input);
Vue.use(Modal);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
