// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';

import 'element-ui/lib/theme-default/index.css';
//import UEditor from './components/common/UEditor.vue';

//export default UEditor;
import ueditor  from './components/vue-ueditor'
import './router/http.js';

//import './mock/index.js';


/* eslint-disable no-new */
Vue.use(ElementUI);
Vue.use(ueditor);

Vue.prototype.$axios = axios;
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');

