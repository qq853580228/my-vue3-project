import { defineStore } from 'pinia';
import useKeepAliveStore from './keepAlive';
import { TABS_ROUTES } from '@/enums/cacheEnum';
import router from '@/routers';
import { LOGIN_NAME, REDIRECT_NAME, PAGE_NOT_FOUND_NAME } from '@/stores/modules/mutation-types';

// 不需要出现在标签页中的路由
export const blackList = [REDIRECT_NAME, LOGIN_NAME, PAGE_NOT_FOUND_NAME];

export const useTabsViewStore = defineStore({
  id: 'tabs-view',
  state: () => ({
    tabsList: [],
  }),
  getters: {
    getTabsList: (state) => {
      return state.tabsList.filter((item) => {
        return !item.meta?.hideInTabs && item.name && router.hasRoute(item.name);
      });
    },
    /** 当前activity tab */
    getCurrentTab: (state) => {
      const currentRoute = router.currentRoute.value;
      return state.tabsList.find((item) => {
        return !item.meta?.hideInTabs && item.fullPath === currentRoute.fullPath;
      });
    },
  },
  actions: {
    /** 将已关闭的标签页的组件从keep-alive中移除 */
    delCompFromClosedTabs(closedTabs) {
      const keepAliveStore = useKeepAliveStore();
      const routes = router.getRoutes();
      const compNames = closedTabs.reduce((prev, curr) => {
        if (curr.name && router.hasRoute(curr.name)) {
          const componentName = routes.find((n) => n.name === curr.name)?.components?.default?.name;
          componentName && prev.push(componentName);
        }
        return prev;
      }, []);
      keepAliveStore.delete(compNames);
    },
    /** 初始化标签页 */
    initTabs(routes) {
      this.tabsList = routes;
    },
    /** 添加标签页 */
    addTabs(route) {
      if (blackList.includes(route.name)) return false;
      const isExists = this.tabsList.some((item) => item.fullPath == route.fullPath);
      if (!isExists) {
        this.tabsList.push(route);
      }
      return true;
    },
    /** 关闭左侧 */
    closeLeftTabs(route) {
      const index = this.tabsList.findIndex((item) => item.fullPath == route.fullPath);
      this.delCompFromClosedTabs(this.tabsList.splice(0, index));
    },
    /** 关闭右侧 */
    closeRightTabs(route) {
      const index = this.tabsList.findIndex((item) => item.fullPath == route.fullPath);
      this.delCompFromClosedTabs(this.tabsList.splice(index + 1));
    },
    /** 关闭其他 */
    closeOtherTabs(route) {
      const targetIndex = this.tabsList.findIndex((item) => item.fullPath === route.fullPath);
      if (targetIndex !== -1) {
        const current = this.tabsList.splice(targetIndex, 1);
        this.delCompFromClosedTabs(this.tabsList);
        this.tabsList = current;
      }
    },
    /** 关闭当前页 */
    closeCurrentTab(route) {
      const index = this.tabsList.findIndex((item) => item.fullPath == route.fullPath);
      const isDelCurrentTab = Object.is(this.getCurrentTab, this.tabsList[index]);
      this.delCompFromClosedTabs(this.tabsList.splice(index, 1));
      // 如果关闭的tab就是当前激活的tab，则重定向页面
      if (isDelCurrentTab) {
        const currentRoute = this.tabsList[Math.max(0, this.tabsList.length - 1)];
        router.push(currentRoute);
      }
    },
    /** 关闭全部 */
    closeAllTabs() {
      this.delCompFromClosedTabs(this.tabsList);
      this.tabsList = [];
      localStorage.removeItem(TABS_ROUTES);
    },
    // 更新tab标题
    updateTabTitle(title) {
      const currentRoute = router.currentRoute.value;
      const upTarget = this.tabsList.find((item) => item.fullPath === currentRoute.fullPath);
      if (upTarget) {
        upTarget.meta.title = title;
      }
    },
  },
});

