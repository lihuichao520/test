import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/test-flex',
    name: 'testFlex',
    component: () => import(/* webpackChunkName: "test-flex" */ '../views/TestFlex/TestFlex.vue'),
  },
  {
    path: '/drop-menu',
    name: 'dropMenu',
    component: () => import(/* webpackChunkName: "drop-menu" */ '../views/DropMenu/DropMenu.vue'),
  },
  {
    path: '/middle-scroll',
    name: 'middleScroll',
    component: () => import(/* webpackChunkName: 'middle-scroll' */ '../views/MiddleScroll/MiddleScroll.vue'),
  },
  {
    path: '/select-card',
    name: 'selectCard',
    component: () => import(/* webpackChunkName:  'select-card' */ '../views/SelectCard/SelectCard.vue'),
  },
  {
    path: '/test-ant-date-picker',
    name: 'testDate',
    component: () => import(/* webpackChunkName: 'test-date' */ '../views/TestDatePicker/TestDatePicker.vue'),
  },
  {
    path: '/test/text',
    name: 'testText',
    component: () => import(/* webpackChunkName: 'test-text' */ '../views/TestText/TestText.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
