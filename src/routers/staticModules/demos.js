import RouterView from '@/layout/router-view/index.vue';

const moduleName = 'demos';

const routes = [
  {
    path: '/demos',
    name: moduleName,
    redirect: { name: `${moduleName}-custom-modal` },
    component: RouterView,
    meta: {
      title: 'routes.demo.demo',
      icon: 'icon-twitter',
    },
    children: [
      {
        path: 'nested-routes',
        name: `${moduleName}-nested-routes`,
        // redirect: { name: `${moduleName}-nested-routes-one` },
        meta: {
          title: '嵌套路由',
          icon: 'icon-twitter',
          keepAlive: true,
          hideChildrenInMenu: true,
          transitionName: false,
          icon: 'icon-twitter',
        },
        component: () =>
          import(/* webpackChunkName: "nested-routes" */ '@/views/demos/nested-routes/index.vue'),
        children: [
          {
            path: 'route-one',
            name: `${moduleName}-nested-routes-one`,
            meta: {
              title: '路由一',
              icon: 'icon-twitter',
              hideInMenu: true,
              activeMenu: `${moduleName}-nested-routes`,
            },
            component: () => import('@/views/demos/nested-routes/route-one.vue'),
          },
          {
            path: 'route-two',
            name: `${moduleName}-nested-routes-two`,
            meta: {
              title: '路由二',
              icon: 'icon-twitter',
              hideInMenu: true,
              activeMenu: `${moduleName}-nested-routes`,
            },
            component: () => import('@/views/demos/nested-routes/route-two.vue'),
          },
          {
            path: 'route-three',
            name: `${moduleName}-nested-routes-three`,
            meta: {
              title: '路由三',
              icon: 'icon-twitter',
              hideInMenu: true,
              activeMenu: `${moduleName}-nested-routes`,
            },
            component: () => import('@/views/demos/nested-routes/route-three.vue'),
          },
        ],
      },
    ],
  },
];

export default routes;
