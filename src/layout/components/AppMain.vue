<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <template v-if="Component">
        <transition
          :name="Object.is(route.meta?.transitionName, false) ? '' : 'fade-transform'"
          mode="out-in"
          appear
        >
          <keep-alive :include="keepAliveComponents">
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
        </transition>
      </template>
    </router-view>
  </section>
</template>

<script setup>
  import useKeepAliveStore from '@/stores/modules/keepAlive';

  const keepAliveStore = useKeepAliveStore();

  // 缓存的路由组件列表
  const keepAliveComponents = computed(() => keepAliveStore.list);
</script>

<style lang="less" scoped>
.app-main {
  padding: 12px;
  height: calc(100vh - @header-height);
  width: 100%;
  position: relative;
  overflow: auto;
}

.fixed-header + .app-main {
  padding-top: @header-height;
}

.hasTabsView {
  .app-main {
    /* 84 = navbar + tags-view = 60 + 45 */
    height: calc(100vh - 105px);
  }

  .fixed-header + .app-main {
    padding-top: 105px;
  }
}
</style>

