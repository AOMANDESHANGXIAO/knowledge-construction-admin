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
      console.log('跳转登录')
      return redirecter.initDirect()
    },
  },
  {
    name: 'home',
    path: '/home',
    meta: {
      title: 'home',
    },
    children: [
      {
        name: 'classManage',
        path: 'class',
        meta: {
          title: 'classManage',
        },
        component: () => import('@/views/Home/classManage/index.vue'),
      },
      {
        name: 'discussManage',
        path: 'discuss',
        meta: {
          title: 'discussManage',
        },
        component: () => import('@/views/Home/discussManage/index.vue'),
      },
      {
        name: 'analysisManage',
        path: 'analysis',
        meta: {
          title: 'analysisManage',
        },
        component: () => import('@/views/Home/analysisManage/index.vue'),
      },
      {
        name: 'adminManage',
        path: 'admin',
        meta: {
          title: 'adminManage',
        },
        component: () => import('@/views/Home/adminManage/index.vue'),
      },
      {
        name: 'processManage',
        path: 'process',
        meta: {
          title: 'processManage',
        },
        component: () => import('@/views/Home/processManage/index.vue'),
      },
    ],
    component: () => import('@/views/Home/Index/index.vue'),
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
