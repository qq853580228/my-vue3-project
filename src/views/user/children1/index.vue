<template>
  <div>
    <p>动态路由User1 - Children1</p>
    <a-button @click="toDetail">详情</a-button>
  </div>
</template>

<script setup name="User1Children1">
  // 没内容name不生效
  // const route = useRoute();
  // console.log('User1Children1', route);

  const route = useRoute();
  const router = useRouter();

  console.log('User1Children1 --- id', route.params.id);

  const toDetail = () => {
    router.push('/user/detail/' + route.params.id);
  }

</script>
<style scoped>

</style>