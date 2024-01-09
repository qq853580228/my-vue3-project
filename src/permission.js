import router from '@/routers';
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { userInfo } from '@/stores/modules/user';
import keepAlive from '@/stores/modules/keepAlive';
import settings from '@/stores/modules/settings';
import { ACCESS_TOKEN, INDEX_MAIN_PAGE_PATH, LOGIN_PAGE_PATH, REDIRECT_NAME, whiteList } from "@/stores/modules/mutation-types";

// 路由守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start(); // start progress bar
  const { [ACCESS_TOKEN]: token, roles, menus, afterLogin } = userInfo();
  if (token) {
    to.meta.title && settings().setTitle(to.meta.title);
    if (to.path === LOGIN_PAGE_PATH) {
      next({ path: INDEX_MAIN_PAGE_PATH });
      NProgress.done();
    } else if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      if (menus.length === 0) {
        await afterLogin()
        next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
      } else {
        next();
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.name) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
});

  /** 获取路由对应的组件名称 */
  const getComponentName = route => {
    const comp = route.matched.at(-1)?.components?.default;
    return comp?.name ?? comp?.type?.name;
  };

router.afterEach((to, from) => {
  const useKeepAlive = keepAlive();
  // 在这里设置需要缓存的组件名称
  const toCompName = getComponentName(to);
  if (to.meta.keepAlive) {
    if (toCompName) {
      useKeepAlive.add(toCompName);
    } else {
      console.warn(
        `${to.fullPath}页面组件的keepAlive为true但未设置组件名，会导致缓存失效，请检查`,
      );
    }
  } else {
    // 不需要缓存的组件
    if (toCompName) {
      useKeepAlive.delete(toCompName);
    }
  }
  
  // 如果进入的是 Redirect 页面，则也将离开页面的缓存清空(刷新页面的操作)
  if (to.name === REDIRECT_NAME) {
    const fromCompName = getComponentName(from);
    fromCompName && useKeepAlive.delete(fromCompName);
  }

  // 如果已退出登录， 清空所有缓存组件
  const { [ACCESS_TOKEN]: token } = userInfo();
  if (!token) {
    useKeepAlive.clear();
  }
  NProgress.done(); // finish progress bar
});