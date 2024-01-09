<template>
  <div class="tabs-view">
    <a-tabs
      :active-key="activeKey"
      hide-add
      type="editable-card"
      class="tabs"
      @change="changePage"
      @edit="editTabItem"
    >
      <a-tab-pane v-for="pageItem in tabsList" :key="pageItem.fullPath">
        <template #tab>
          <a-dropdown :trigger="['contextmenu']">
            <div style="display: inline-block">
              {{ pageItem.meta?.title }}
            </div>
            <template #overlay>
              <a-menu style="user-select: none">
                <a-menu-item key="1" :disabled="activeKey !== pageItem.fullPath" @click="reloadPage">
                  <reload-outlined />
                  {{ $t('layout.multipleTab.reload') }}
                </a-menu-item>
                <a-menu-item key="2" @click="removeTab(pageItem)">
                  <close-outlined />
                  {{ $t('layout.multipleTab.close') }}
                </a-menu-item>
                <Menu.Divider />
                <a-menu-item key="3" @click="closeLeft(pageItem)">
                  <vertical-right-outlined />
                  {{ $t('layout.multipleTab.closeLeft') }}
                </a-menu-item>
                <a-menu-item key="4" @click="closeRight(pageItem)">
                  <vertical-left-outlined />
                  {{ $t('layout.multipleTab.closeRight') }}
                </a-menu-item>
                <Menu.Divider />
                <a-menu-item key="5" @click="closeOther(pageItem)">
                  <column-width-outlined />
                  {{ $t('layout.multipleTab.closeOther') }}
                </a-menu-item>
                <a-menu-item key="6" @click="closeAll">
                  <minus-outlined />
                  {{ $t('layout.multipleTab.closeAll') }}
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </a-tab-pane>

      <template #rightExtra>
        <Dropdown :trigger="['click']" placement="bottomRight">
          <a class="ant-dropdown-link" @click.prevent>
            <down-outlined :style="{ fontSize: '20px' }" />
          </a>
          <template #overlay>
            <Menu style="user-select: none">
              <a-menu-item key="1" :disabled="activeKey !== route.fullPath" @click="reloadPage">
                <reload-outlined />
                {{ $t('layout.multipleTab.reload') }}
              </a-menu-item>
              <a-menu-item key="2" @click="removeTab(route)">
                <close-outlined />
                {{ $t('layout.multipleTab.close') }}
              </a-menu-item>
              <Menu.Divider />
              <a-menu-item key="5" @click="closeOther(route)">
                <column-width-outlined />
                {{ $t('layout.multipleTab.closeOther') }}
              </a-menu-item>
              <a-menu-item key="6" @click="closeAll">
                <minus-outlined />
                {{ $t('layout.multipleTab.closeAll') }}
              </a-menu-item>
            </Menu>
          </template>
        </Dropdown>
      </template>
    </a-tabs>
  </div>
</template>

<script setup>
import Storage from '@/utils/cache';
// import { TABS_ROUTES } from '@/enums/cacheEnum';
import { useTabsViewStore, blackList } from '@/stores/modules/tabsView';
import { REDIRECT_NAME } from '@/stores/modules/mutation-types';


const route = useRoute();
const router = useRouter();
const tabsViewStore = useTabsViewStore();

const activeKey = computed(() => tabsViewStore.getCurrentTab?.fullPath);

// 标签页列表
const tabsList = computed(() => tabsViewStore.getTabsList);

// 获取简易的路由对象
const getSimpleRoute = route => {
  const { fullPath, hash, meta, name, params, path, query } = route;
  return { fullPath, hash, meta, name, params, path, query };
};

let routes = [getSimpleRoute(route)];

// try {
//   const routesStr = Storage.local.get(TABS_ROUTES);
//   routes = routesStr ? JSON.parse(routesStr) : [getSimpleRoute(route)];
// } catch (e) {
//   routes = [getSimpleRoute(route)];
// }

// 初始化标签页
// tabsViewStore.initTabs(routes);
tabsViewStore.initTabs(routes);

// tabsViewMutations.initTabs(routes)

watch(
  () => route.fullPath,
  () => {
    if (blackList.some((n) => n === route.name)) return;
    // tabsViewMutations.addTabs(getSimpleRoute(route))
    tabsViewStore.addTabs(getSimpleRoute(route));
  },
  { immediate: true },
);

// 在页面关闭或刷新之前，保存数据
// window.addEventListener('beforeunload', () => {
//   Storage.local.set(TABS_ROUTES, JSON.stringify(tabsList.value));
// });

// 目标路由是否等于当前路由
const isCurrentRoute = (route) => {
  return router.currentRoute.value.matched.some((item) => item.name === route.name);
};

// 关闭当前页面
const removeTab = (route) => {
  if (tabsList.value.length === 1) {
    return message.warning('这已经是最后一页，不能再关闭了！');
  }
  // tabsViewMutations.closeCurrentTabs(route)
  tabsViewStore.closeCurrentTab(route);
};
// tabs 编辑（remove || add）
const editTabItem = (targetKey, action) => {
  if (action == 'remove') {
    removeTab(tabsList.value.find((item) => item.fullPath == targetKey));
  }
};
// 切换页面
const changePage = (key) => {
  Object.is(route.fullPath, key) || router.push(key);
};

// 刷新页面
const reloadPage = () => {
  router.replace({
    name: REDIRECT_NAME,
    params: {
      path: unref(route).fullPath,
    },
  });
};

// 关闭左侧
const closeLeft = (route) => {
  // tabsViewMutations.closeLeftTabs(route)
  tabsViewStore.closeLeftTabs(route);
  !isCurrentRoute(route) && router.replace(route.fullPath);
};

// 关闭右侧
const closeRight = (route) => {
  // tabsViewMutations.closeRightTabs(route)
  tabsViewStore.closeRightTabs(route);
  !isCurrentRoute(route) && router.replace(route.fullPath);
};

// 关闭其他
const closeOther = (route) => {
  // tabsViewMutations.closeOtherTabs(route)
  tabsViewStore.closeOtherTabs(route);
  !isCurrentRoute(route) && router.replace(route.fullPath);
};

// 关闭全部
const closeAll = () => {
  Storage.local.remove('routes');
  // tabsViewMutations.closeAllTabs()
  tabsViewStore.closeAllTabs();
  router.replace('/');
};
</script>

<style lang="less" scoped>
.dark .tabs-view {
  border-top: 1px solid black;
}

.tabs-view {
  border-top: 1px solid #eee;

  :deep(.tabs) {
    .dark {
      .ant-tabs-nav {
        background: #000;
      }
    }
    .ant-tabs-nav {
      background: #fff;
      margin: 0;
      padding: 4px 20px 0 10px;
      user-select: none;
    }

    .ant-tabs-tabpane {
      display: none;
    }

    .ant-tabs-tab-remove {
      display: flex;
      margin: 0;
      padding: 0;

      .anticon-close {
        padding-left: 6px;
      }
    }

    .ant-tabs-tab:not(.ant-tabs-tab-active) {
      .ant-tabs-tab-remove {
        width: 0;
      }

      .anticon-close {
        visibility: hidden;
        width: 0;
        transition: width 0.3s;
      }

      &:hover {
        .anticon-close {
          visibility: visible;
          width: 16px;
          padding-left: 6px;
        }

        .ant-tabs-tab-remove {
          width: unset;
        }
      }
    }
  }
}
</style>
