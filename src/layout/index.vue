<template>
  <a-layout class="layout">
    <a-layout-sider
      v-if="layoutSetting.layout === 'sidemenu'"
      v-model:collapsed="collapsed"
      :width="asiderWidth"
      :trigger="null"
      collapsible
      :theme="getTheme"
      class="layout-sider"
    >
      <Logo :collapsed="collapsed" :title="layoutSetting.title" />
      <sider :collapsed="collapsed" :theme="getTheme" class="sidebar-container" />
    </a-layout-sider>
    <a-layout>
      <div :class="{ 'fixed-header': layoutSetting.fixedHeader, hasTabsView: layoutSetting.tabsView }" class="main-container">
        <Header v-model:collapsed="collapsed">
          <template v-if="layoutSetting.layout === 'topmenu'" #default>
            <Logo :collapsed="collapsed" :title="layoutSetting.title" />
            <div class="topmenu">
              <sider :collapsed="collapsed" :theme="getTheme" class="sidebar-container" />
            </div>
          </template>
        </Header>
        <tabs-view />
        <a-layout-content>
          <app-main />
        </a-layout-content>
      </div>
    </a-layout>
  </a-layout>
</template>
<script setup>
  import useSetting from '@/stores/modules/settings';
  import Header from './components/Header/index.vue';
  import Sider from './components/Sider/index.vue';
  import Logo from './components/Logo/index.vue';
  import AppMain from './components/AppMain.vue';
  import TabsView from './components/TabsView/index.vue';
  const settings = useSetting();
  const { layoutSetting, getNavTheme } = storeToRefs(settings);
  const collapsed = ref(false);
  // 自定义侧边栏菜单收缩和展开时的宽度
  const asiderWidth = computed(() => (collapsed.value ? 80 : 200));
  const getTheme = computed(() => (getNavTheme.value === 'light' ? 'light' : 'dark'));
  // const getTheme = computed(() => (settings.getNavTheme === 'light' ? 'light' : 'dark'));
  // const fixedHeader = computed(() => layoutSetting.fixedHeader);
</script>
<style lang="less" scoped>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;

  .ant-layout {
    overflow: hidden;
  }

  .layout-content {
    flex: none;
  }
}
</style>