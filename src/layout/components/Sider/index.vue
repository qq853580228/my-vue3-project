<template>
  <div class="menu-container" :class="{ 'is-side-menu': isSideMenu }">
    <a-menu 
      v-model:selectedKeys="state.selectedKeys"
      :open-keys="isSideMenu ? state.openKeys : []"
      :mode="isSideMenu ? 'inline' : 'horizontal'"
      :theme="theme"
      :collapsed="collapsed"
      collapsible
      @click="clickMenuItem"
      @openChange="onOpenChange"
    >
      <siderbar-item :menus="menus" />
    </a-menu>
  </div>
</template>
<script setup>
  import useSetting from '@/stores/modules/settings';
  import { userInfo } from '@/stores/modules/user';
  import { LOGIN_NAME } from '@/stores/modules/mutation-types';
  import SiderbarItem from './SiderItem.vue';

  const props = defineProps({
    collapsed: {
      // 侧边栏菜单是否收起
      type: Boolean,
    },
    theme: {
      type: String,
    },
  });

  // 当前路由
  const currentRoute = useRoute();
  const router = useRouter();

  const { layoutSetting } = useSetting();
  const userStore = userInfo();
  /** 侧边栏布局 */
  const isSideMenu = computed(() => layoutSetting.layout === 'sidemenu');
  const menus = computed(() => userStore.menus);
  const getRouteByName = name => router.getRoutes().find(n => n.name === name);
  const state = reactive({
    openKeys: [],
    selectedKeys: [currentRoute.name],
    rootSubmenuKeys: menus.value.map(i => i.name),
  });
  // 根据activeMenu获取指定的menu
  const getTargetMenuByActiveMenuName = activeMenu => {
    return router.getRoutes().find((n) => [n.name, n.path].includes(activeMenu));
  };
  // 获取当前打开的子菜单
  const getOpenKeys = () => {
    const meta = currentRoute.meta;
    console.log('meta', meta);
    if (meta?.activeMenu) {
      const targetMenu = getTargetMenuByActiveMenuName(meta.activeMenu);
      return targetMenu?.meta?.namePath ?? [meta?.activeMenu];
    }
    return meta.hideInMenu ? 
      state.openKeys || [] : 
      meta.namePath ?? currentRoute.matched.slice(1).map((n) => n.name);
  }
  // 监听菜单收缩状态
  watch(
    () => props.collapsed,
    (newVal) => {
      state.openKeys = newVal ? [] : getOpenKeys();
      state.selectedKeys = [currentRoute.name];
    },
  );

  // 跟随页面路由变化，切换菜单选中状态
  watch(
    () => currentRoute.fullPath,
    () => {
      if (currentRoute.name === LOGIN_NAME || props.collapsed) return;
      state.openKeys = getOpenKeys();
      const meta = currentRoute.meta;
      if (meta?.activeMenu) {
        const targetMenu = getTargetMenuByActiveMenuName(meta.activeMenu);
        state.selectedKeys = [targetMenu?.name ?? meta?.activeMenu];
      } else {
        state.selectedKeys = [currentRoute.meta?.activeMenu ?? currentRoute.name];
      }
    },
    {
      immediate: true,
    },
  );
  // 点击菜单
  const clickMenuItem = ({ key }) => {
    if (key === currentRoute.name) return;
    const targetRoute = getRouteByName(key);
    const { isExt, openMode } = targetRoute?.meta || {};
    if (isExt && openMode !== 2) {
      window.open(key);
    } else {
      router.push({ name: key });
    }
  };

  const onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => state.openKeys.indexOf(key) === -1);
    if (state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      state.openKeys = openKeys;
    } else {
      state.openKeys = latestOpenKey ? [latestOpenKey] : [];
    }
    // console.log('rootSubmenuKeys', state.openKeys);
  };
</script>

<style lang="less" scoped>
  .menu-container {
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    &.is-side-menu {
      height: calc(100vh - @header-height);
    }
  }
</style>