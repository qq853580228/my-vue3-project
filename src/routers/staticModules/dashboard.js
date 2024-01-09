import { INDEX_MAIN_PAGE_NAME } from '@/stores/modules/mutation-types';

const routes = [
  {
    name: INDEX_MAIN_PAGE_NAME,
    path: '/index',
    component: () => import('@/views/index/index.vue'),
    meta: {
      title: '首页',
      icon: 'icon-twitter',
    },
    children: [],
  },
];

export default routes;
