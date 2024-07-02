// router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useRedirect } from '@/hooks/useRedirect'
const redirecter = useRedirect()

const routes: Array<RouteRecordRaw> = [
  {
    name: 'index',
    path: '/',
    meta: {
      title: 'index',
    },
    redirect() {
      return redirecter.initDirect()
    },
  },
  {
    name: 'home',
    path: '/home',
    meta: {
      title: 'home',
    },
    component: () => import('@/views/Home/index.vue'),
  },
  {
    name: '/login',
    path: '/login',
    meta: {
      title: 'login',
    },
    component: () => import('@/views/Login/index.vue'),
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
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
