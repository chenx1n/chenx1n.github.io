import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/home'),
    meta: {
      title: '记账',
    },
  },
  {
    path: '/love',
    name: 'love',
    component: () => import('../views/gt'),
    meta: {
      title: '❤️',
    },
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/test'),
    meta: {
      title: '测试',
    },
  },
];

const router = new VueRouter({
  // mode: 'history',
  routes,
});

export default router;
