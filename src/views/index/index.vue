<template>
  <div>
    <van-button type="primary" size="small" @click="handleLogOut">退出登录</van-button>
    <p>这是第1个p元素</p>
    <p>这是第2个p元素</p>
    <p>这是第3个p元素</p>
    <p>这是第4个p元素</p>
    <p>这是第5个p元素</p>
    <p>这是第6个p元素</p>
    <p>这是第7个p元素</p>
    <p>这是第8个p元素</p>
    <p>这是第9个p元素</p>
    <p>这是第10个p元素</p>
    <p>这是第11个p元素</p>
    <p>这是第12个p元素</p>
    <p>这是第13个p元素</p>
    <p>这是第14个p元素</p>
    <p>这是第15个p元素</p>
    <p>这是第16个p元素</p>
    <p>这是第17个p元素</p>
    <p>这是第18个p元素</p>
    <p>这是第19个p元素</p>
    <p>这是第20个p元素</p>
    <p>这是第21个p元素</p>
    <p>这是第22个p元素</p>
    <p>这是第23个p元素</p>
    <p>这是第24个p元素</p>
    <p>这是第25个p元素</p>
    <p>这是第26个p元素</p>
    <p>这是第27个p元素</p>
    <p>这是第28个p元素</p>
    <p>这是第29个p元素</p>
    <p>这是第30个p元素</p>
    <p>这是第31个p元素</p>
  </div>
</template>

<script setup>
  import { userInfo } from '@/stores/modules/user';
  
  const handleLogOut = () => {
    userInfo().handleLogOut().then(() => {
      location.href = '/index';
    });
  };
</script>
<style lang="less" scoped>

</style>