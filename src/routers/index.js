import { createRouter, createWebHistory } from 'vue-router';
import outsideLayout from './outsideLayout';
import { whiteList } from '@/stores/modules/mutation-types';
const Layout = () => import('@/layout/index.vue'); 

export const routes = [
  {
    path: '/',
    name: 'Layout',
    redirect: '/index',
    component: Layout,
    meta: {
      title: '首页',
    },
    children: [],
  },
  // Layout之外的路由
  ...outsideLayout,
];


// reset router
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route;
    console.log('name', name);
    if (name && !whiteList.some((n) => n === name)) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}

const router = createRouter({
  base: import.meta.env.BASE_URL,
  history: createWebHistory(),
  routes,
});

export default router;