<template>
  <a-button type="primary" @click="handleLogin">登录</a-button>
</template>

<script setup>
  import { userInfo } from '@/stores/modules/user';
  import { getCodeImg } from '@/api/login';

  const route = useRoute();
  const router = useRouter();
  const model = reactive({ accessToken: 'bls' });

  const handleLogin = () => {
    userInfo().handleLogin(model).then(res => {
      const query = route.query;
      const otherQueryParams = Object.keys(query).reduce((acc, cur) => {
          if (cur !== "redirect") {
            acc[cur] = query[cur];
          }
          return acc;
        }, {});
      router.push({ path: route.query && route.query.redirect || '/', query: otherQueryParams });
    });
  };
  const getCode = () => {
    getCodeImg().then(res => {
      console.log('res', res);
    });
  };
  getCode();
</script>
<style scoped>

</style>@/stores/modules/user