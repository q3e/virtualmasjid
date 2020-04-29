import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const About = () => import('../components/About.vue')
const EventList = () => import('../components/EventList.vue')

export default function createRouter() {
  return new Router({
    routes: [
      {
        path: '/about',
        component: About,
      },
      {
        path: '/',
        component: EventList,
      },
    ],
    scrollBehavior() {
      return {
        x: 0,
        y: 0,
      }
    },
  })
}
