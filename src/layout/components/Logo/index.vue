<template>
  <div class="logo">
    <transition name="sidebarLogoFade">
      <router-link key="collapse" to="/">
        <img src="~@/assets/images/logo.png" alt="" />
        <h2 v-show="!collapsed" class="title">{{ title }}</h2>
      </router-link>
    </transition>
  </div>
</template>

<script setup>
  defineProps({
    collapsed: {
      type: Boolean,
    },
    title: {
      type: String,
    },
  });
</script>

<style lang="less" scoped>
  .sidebarLogoFade-enter-active {
    transition: opacity 1.5s;
  }

  .sidebarLogoFade-enter,
  .sidebarLogoFade-leave-to {
    opacity: 0;
  }
  .logo {
    height: @header-height;
    line-height: @header-height;
    padding-left: 24px;
    white-space: nowrap;
    img {
      width: 32px;
      height: 32px;
      margin-right: 8px;
      vertical-align: middle;
    }

    .title {
      display: inline-block;
      margin: 0;
      max-width: 144px;
      .txt-overflow-s();
      font-weight: 600;
      line-height: @header-height;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
      color: @primary-color;
    }
  }
</style>
