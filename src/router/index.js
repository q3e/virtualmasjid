import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const About = () => import('../components/About.vue');
const BeerList = () => import('../components/BeerList.vue');

export default function createRouter() {
  return new Router({
    routes: [
      { path: '/about', component: About },
      { path: '/', component: BeerList },
    ],
    scrollBehavior() {
      return { x: 0, y: 0 };
    },
  });
}
