<template>
  <div>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane v-for="item in tabs" :key="item.name" :tab="item.title"></a-tab-pane>
    </a-tabs>
    <router-view #="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup name="DemosNestedRoutes">

  const router = useRouter();
  const route = useRoute();

  const tabs = [
    {
      title: '路由一',
      name: 'demos-nested-routes-one',
    },
    {
      title: '路由二',
      name: 'demos-nested-routes-two',
    },
    {
      title: '路由三',
      name: 'demos-nested-routes-three',
    },
  ];

  const activeKey = ref(route.name || tabs[0].name);

  watch(activeKey, (name) => {
    router.push({ name });
  });
</script>
