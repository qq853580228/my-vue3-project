import { LOGIN_NAME, LOGIN_PAGE_PATH } from '@/stores/modules/mutation-types';

/**
 * layout布局之外的路由
 */
const routes = [
  {
    path: LOGIN_PAGE_PATH,
    name: LOGIN_NAME,
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    name: 'Agreement',
    path: '/my/agreement',
    component: import('@/views/my/agreement.vue'),
    meta: {
      title: '用户协议',
    },
  },
];

export default routes;
