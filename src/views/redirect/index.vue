<template>
  <div></div>
</template>

<script setup>
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute();
  const router = useRouter();
  const { params, query } = route
  const { path, redirectType = 'path' } = params;
  const _path = Array.isArray(path) ? path.join('/') : path;
  setTimeout(() => {
    if (redirectType === 'name') {
      router.replace({
        name: _path,
        query,
        params,
      });
    } else {
      router.replace({
        path: _path.startsWith('/') ? _path : `/${_path}`,
        query,
      });
    }
  });
</script>