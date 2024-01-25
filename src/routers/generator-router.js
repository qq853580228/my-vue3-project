import { Result } from 'ant-design-vue';
import { notFound, errorRoute } from './staticModules/error';
import { REDIRECT_ROUTE } from './staticModules/besidesLayout';
import outsideLayout from './outsideLayout';
import RouterView from '@/layout/routerView/index.vue';
import { isURL } from '@/utils/validate';
import utils from '@/utils';
import { asyncRoutes } from '@/routers/asyncModules';
import common from '@/routers/staticModules';
import router, { routes } from '@/routers';
import NotFound from '@/views/404/index.vue';
import IFramePage from '@/components/iframePage/index.vue';

// 需要放在所有路由之后的路由
const endRoutes = [REDIRECT_ROUTE, errorRoute, notFound];

export function filterAsyncRoute(
  routes = [],
  parentPath = '',
  lastNamePath = [],
) {
  return routes
    // .filter((item) => item.type !== 2 && item.isShow && item.parentId == parentRoute?.id)
    .filter((item) => item.type !== 2 && item.isShow)
    .map((item) => {
      // const { router, viewPath, name, icon, orderNum, keepAlive, isExt, openMode } = item;
      const { router, viewPath, name, orderNum, keepAlive, isExt, openMode, meta, routeVal } = item;
      let fullPath = '';
      const pathPrefix = lastNamePath.at(-1) || '';
      if (isURL(router)) {
        fullPath = router;
      } else {
        fullPath = router.startsWith('/') ? router : `/${router}`;
        fullPath = router.startsWith(pathPrefix) ? fullPath : pathPrefix + fullPath;
        fullPath = [...new Set(utils.uniqueSlash(fullPath).split('/'))].join('/');
      }
      let realRoutePath = router;
      if (parentPath) {
        if (fullPath.startsWith(parentPath)) {
          realRoutePath = fullPath.split(parentPath)[1];
        } else if (!isURL(parentPath) && !isURL(router)) {
          realRoutePath = router;
        }
      }
      realRoutePath = realRoutePath.startsWith('/') ? realRoutePath.slice(1) : realRoutePath;
      realRoutePath = realRoutePath.replace(/http(s)?:\/\//, '');
      // console.log('fullPath', fullPath, realRoutePath);
      // console.log('realRoutePath', realRoutePath);
      const route = {
        path: realRoutePath,
        // path: fullPath,
        // name: `${viewPath ? toHump(viewPath) : fullPath}-${item.id}`,
        name: fullPath,
        meta: {
          // fullPath,
          routeVal,
          orderNum,
          isExt,
          openMode,
          icon: meta?.icon,
          title: meta?.title || name,
          type: item.type,
          perms: [],
          namePath: lastNamePath.concat(fullPath),
          keepAlive,
          hideInMenu: meta?.hideInMenu,
        },
      };
      // 如果是目录
      if (item.type === 0) {
        let children = [];
        if (item?.children?.length) {
          children = filterAsyncRoute(item.children, item.router, lastNamePath.concat(fullPath));
        }
        // const children = filterAsyncRoute(routes, item, lastNamePath.concat(fullPath));
        if (children?.length) {
          route.component = RouterView;
          route.children = children;
          // console.log('route.component', route);
          route.redirect = { name: children[0].name };
        } else {
          route.component = (
            <Result
              status="500"
              title={name}
              sub-title="目录类型菜单不是真实页面，请为当前目录添加页面级子菜单或更改当前菜单类型."
            />
          );
        }
        return route;
        // 如果是页面
      } else if (item.type === 1) {
        const newViewPath = viewPath && viewPath.indexOf('.vue') === -1 ? `${viewPath}.vue` : viewPath;
        const Component =
          isExt && openMode === 2 ? (
            <IFramePage src={fullPath} />
          ) : (
            asyncRoutes[newViewPath] || NotFound
          );
        route.component = Component;

        // const perms = routes
        //   .filter((n) => n.parentId === item.id)
        //   .flatMap((n) => n.perms?.split(','));
        // if (route.meta && perms) {
        //   // 设置当前页面所拥有的权限
        //   route.meta.perms = perms;
        // }
        return route;
      }
      return undefined;
    })
    .filter(item => !!item);
}

/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = (asyncMenus = []) => {
  try {
    // console.log('asyncMenus', asyncMenus);
    const routeList = filterAsyncRoute(asyncMenus);
    const layout = routes.find((item) => item.name == 'Layout') || {};
    // console.log(routeList, '根据后端返回的权限路由生成');
    // 给公共路由添加namePath
    const newCommon = generatorNamePath(common);
    // console.log('newCommon', newCommon);
    const menus = [...newCommon, ...routeList, ...endRoutes];
    layout.children = menus;
    const removeRoute = router.addRoute(layout);
    // 获取所有没有包含children的路由，上面addRoute的时候，vue-router已经帮我们拍平了所有路由
    const filterRoutes = router
      .getRoutes()
      .filter(
        (item) =>
          (!item.children.length || Object.is(item.meta?.hideChildrenInMenu, true)) &&
          !outsideLayout.some((n) => n.name === item.name) && 
          item.meta?.routeVal !== '1'
      );
    // 清空所有路由
    removeRoute();
    layout.children = [...filterRoutes];
    console.log('layout routes', layout);
    // 重新添加拍平后的路由
    router.addRoute(layout);
    console.log('所有路由', router.getRoutes());

    return Promise.resolve({
      menus,
      routes: layout.children,
    });
  } catch (error) {
    console.error('生成路由时出错', error);
    return Promise.reject(`生成路由时出错: ${error}`);
  }
};

/**
 * 主要方便于控制a-menu的open-keys，即控制左侧菜单应当展开哪些菜单
 * @param {RouteRecordRaw[]} routes 需要添加namePath的路由
 * @param {string[]} namePath
 */
export const generatorNamePath = (
  routes = [],
  namePath = [],
  pathPrefix = '',
) => {
  return routes.map((item) => {
    if (item.meta && typeof item.name === 'string') {
      item.meta.namePath = Array.isArray(namePath) ? namePath.concat(item.name) : [item.name];
      item.meta.fullPath = parent?.meta?.fullPath
        ? [parent.meta.fullPath, item.path].join('/')
        : item.path;
      item.meta.fullPath = utils.uniqueSlash(item.meta.fullPath);
      // let fullPath = '';
      // if (isURL(item.path)) {
      //   fullPath = item.path;
      // } else {
      //   fullPath = item.path.startsWith('/') ? item.path : `/${item.path}`;
      //   fullPath = item.path.startsWith(pathPrefix) ? fullPath : pathPrefix + fullPath;
      //   fullPath = [...new Set(utils.uniqueSlash(fullPath).split('/'))].join('/');
      // }
      // item.meta.fullPath = fullPath;
      // item.name = fullPath;
      // item.meta.namePath = Array.isArray(namePath) ? namePath.concat(fullPath) : [fullPath];
      if (item.children?.length) {
        item.children = generatorNamePath(item.children, item.meta.namePath, item.path);
      }
    }
    return item;
  });
};
