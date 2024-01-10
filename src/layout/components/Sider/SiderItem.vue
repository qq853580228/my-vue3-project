<template>
  <template v-for="item in filterMenus" :key="item.name || item.fullPath">
    <!-- 目录 -->
    <template v-if="isShowSubMenu(item)">
      <a-sub-menu :key="item?.name" v-bind="$attrs">
        <template #title>
          <sider-content :item="item" />
        </template>
        <template v-if="item.children">
          <!-- 递归生成菜单 -->
          <sider-item :menus="item.children" />
        </template>
      </a-sub-menu>
    </template>
    <!-- 菜单 -->
    <template v-else>
      <a-menu-item :key="item?.name">
        <sider-content :item="item" />
      </a-menu-item>
    </template>
  </template>
</template>

<script setup name="SiderItem">
  import SiderContent from '@/layout/components/Sider/SiderContent';

  const props = defineProps({
    menus: {
      type: Array,
      default: () => [],
    },
  });

  const filterMenus = computed(() => {
    return [...props.menus]
      .filter((n) => !n.meta?.hideInMenu)
      .sort((a, b) => (a?.meta?.orderNum || 0) - (b?.meta?.orderNum || 0));
  });

  const isShowSubMenu = menuItem => {
    return (
      menuItem?.meta?.type === 0 ||
      (!Object.is(menuItem?.meta?.hideChildrenInMenu, true) && menuItem?.children?.length)
    );
  };

</script>
<style scoped>

</style>