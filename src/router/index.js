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
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
