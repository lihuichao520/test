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
  {
    path: '/test-ant-dynamicform',
    name: 'dynamicform',
    component: () => import(/* webpackChunkName: 'test-dynamic-from' */ '../views/DynamicForm/DynamicForm.vue'),
  },
  {
    path: '/test/font-size',
    name: 'fontSize',
    component: () => import(/* webpackChunkName: 'test-font' */ '../views/TestFont/TestFont.vue'),
  },
  {
    path: '/test/animation',
    name: 'animation',
    component: () => import(/* webpackChunkName: 'animation' */ '../views/Animation/Animation.vue'),
  },
  {
    path: '/test/scroll',
    name: 'scroll',
    component: () => import(/* webpackChunkName: 'scroll' */ '../views/TestScroll/TestScroll.vue'),
  },
  {
    path: '/test/popup',
    name: 'popup',
    component: () => import(/* webpackChunkName: 'popup' */ '../views/Popup/TestPopup.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
