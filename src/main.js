// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import VueAnalytics from 'vue-analytics';
import infiniteScroll from 'vue-infinite-scroll';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// import 'bootstrap-material-design';
// import 'bootstrap-material-design/dist/css/bootstrap-material-design.min.css';

import App from './App';
import createRouter from './router';

window.$ = require('jquery');
window.jQuery = require('jquery');

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(infiniteScroll);

const router = createRouter();

Vue.use(VueAnalytics, {
  id: 'UA-133963028-1',
  router,
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
