// router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    name: 'home',
    path: '/',
    meta: {
      title: 'home',
    },
    component: () => import('@/views/Home/index.vue'),
  },
  // 页面不存在时的路由
  {
    name: '404',
    path: '/:pathMatch(.*)*',
    meta: {
      title: '404',
    },
    component: () => import('@/views/Error/404.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

