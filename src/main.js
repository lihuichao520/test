import Vue from 'vue';
import Antd from 'ant-design-vue';
import { Checkbox, CheckboxGroup } from 'vant';
import 'vant/lib/index.css'; // 引入样式
import App from './App.vue';
import router from './router';

Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Antd);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
