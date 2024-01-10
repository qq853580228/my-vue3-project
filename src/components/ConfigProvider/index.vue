<template>
  <a-config-provider :locale="zhCN" :theme="theme">
    <router-view />
  </a-config-provider>
</template>

<script setup>
  import zhCN from "ant-design-vue/lib/locale/zh_CN";
  import useSetting from '@/stores/modules/settings';
  const { themeConfig, toggleTheme, layoutSetting } = useSetting();
  toggleTheme(layoutSetting.navTheme);
  const theme = computed(() => themeConfig);
  watch(theme, newV => {
    console.log('newV');
  })
</script>