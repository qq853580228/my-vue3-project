<template>
  <div>
    <a-button type="primary" size="small" @click="handleLogOut">退出登录</a-button>
  </div>
</template>

<script setup>
  import { userInfo } from '@/stores/modules/user';
  
  const handleLogOut = () => {
    userInfo().handleLogOut().then(() => {
      location.href = '/login';
    });
  };
</script>
<style lang="less" scoped>

</style>